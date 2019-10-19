<?php
include_once('create.php');

function setupCountry($p){
	$out['debug'] = 'setupCountry'."\n";
	if (!isset($p['country_code'])){
		$out['debug'] = 'country code not set'."\n";
		return $out;
	}
	
	$setup_directory = ROOT_EDIT .  'content/ZZ/' ;
	$country_directory = ROOT_EDIT. 'content/'. $p['country_code'] .'/';
	if (!file_exists($country_directory)){
		dirMake($country_directory);
	}
	// language.json
	if (!file_exists($country_directory . 'languages.json')){
		$fh = fopen($country_directory . 'languages.json', 'w');
		fwrite($fh, '[]');
		fclose($fh);
	}
	// copy images
	if (!file_exists($country_directory . 'images')){
		dirMake($country_directory . 'images');
	}
	$source = $setup_directory . 'images/GLOBAL/';
	$destination = $country_directory .'images/standard/';
	if (!file_exists($destination)){
		dirMake($destination);
	}
	copy_global($source, $destination);
	// copy styles
	setupStylesCountry($p);
	//copy templates
	$out['debug'] .= 'copy templates' . "\n";
	setupTemplatesCountry($p);
	if (!file_exists($country_directory . 'templates/library.json')){
		copy ($setup_directory . 'templates/library.json', $country_directory . 'templates/library.json');
	}
	return $out;
}
function setupImageFolder($p){
	$out['debug'] = 'setupImageFolder'. "\n";
	if (!isset($p['language_iso'])){
		$out['debug'] = 'language_iso not set'."\n";
		return $out;
	}
	$source = ROOT_EDIT. 'content/'. $p['country_code'] .'/images/standard/' ;
	$destination = ROOT_EDIT. 'content/'. $p['country_code'] .'/images/'. $p['language_iso'] .'/' ;
	if (!file_exists($destination)){
		dirMake($destination);
	}
	copy_global($source, $destination);
	return $out;
}
function setupLanguageFolder($p){
	$out['debug'] = 'setupLanguageFolder'. "\n";
	if (!isset($p['language_iso'])){
		$out['debug'] = 'language_iso not set'."\n";
		return $out;
	}
	$setup_directory = ROOT_EDIT. 'content/'. $p['country_code'] .'/' ;
	$language_directory = ROOT_EDIT. 'content/'. $p['country_code'] .'/'. $p['language_iso'] . '/' ;
	if (!file_exists($language_directory)){
		dirMake($language_directory);
	}
	if (!file_exists($language_directory . 'life')){
		dirMake($language_directory . 'life');
	}
	if (!file_exists($language_directory . 'basics')){
		dirMake($language_directory . 'basics');
	}
	if (!file_exists($language_directory . 'steps')){
		dirMake($language_directory . 'steps');
	}
	if (!file_exists($language_directory . 'compass')){
		dirMake($language_directory . 'compass');
	}
	if (!file_exists($language_directory . 'multiply')){
		dirMake($language_directory . 'multiply');
	}
	// copy images
	if (!file_exists($language_directory . 'images')){
		dirMake($language_directory . 'images');
	}
	$source = $setup_directory . 'images/';
	if (file_exists($source)){
		$destination = $language_directory .'images/standard';
		copy_global($source, $destination);
	}
	else{
		setupCountry($p);
	}
	//copy library
	$source = $setup_directory . 'templates/library.json';
	if (file_exists($source)){
		$destination = $language_directory .'library.json';
		if (!file_exists($destination)){
			copy($source, $destination);
		}
	}
	else{
		setupCountry($p);
	}
	// setup styles directory styles
	if (!file_exists($language_directory . 'styles')){
		dirMake($language_directory . 'styles');
	}
	
	//copy templates
	$out['debug'] .= 'copy templates' . "\n";
	setupTemplatesLanguage($p);
	return $out;
}

function setupSeries($p){
	/* This expects input of Series in tab format (number| title | description| bible reference| filename|image|publish)
	   and creates files for each
		plus html for each file in input using the template supplied
	
	*/
	$out['debug'] = 'setupLanguageFolder'. "\n";
	if (!isset($p['folder_name'])){
		$out['debug'] = 'folder_name not set'."\n";
		return $out;
	}
	if (isset($p['template'])){
		$template_file = ROOT_EDIT. 'content/' . $p['country_code'] .'/'. $p['language_iso'] .'/templates/'. $p['template'];
		$template_text = file_get_contents($template_file);
	}
	else{
		$template_text = null;
	}
	
	$destination = ROOT_EDIT.'content/'. $p['country_code'] .'/'. $p['language_iso'] .'/'. $p['folder_name'];
	
	$out['debug'] = 'entered setupSeries for template' . $template_file;
	if ($_FILES['file']['error'] == UPLOAD_ERR_OK               //checks for errors
      && is_uploaded_file($_FILES['file']['tmp_name'])) { //checks that file is uploaded
		$text =  file_get_contents($_FILES['file']['tmp_name']); 
		$out['debug'] .= $text;
		$index_text = '{
		"series" :"'. $p['series_name'] . '",
	"language" : "'. $p['language_iso'] . '",
	"description":"'. $p['description'] . '",
	"chapters": [';
		$lines = explode("\n", $text);
		$i = 0;
		foreach ($lines as $line){
			$item = explode ("\t", $line);
			if (count($item) >= 7){
				$chapter_number = $item[0];
				$chapter_title = $item[1];
				$chapter_description = $item[2];
				$chapter_reference = $item[3];
				$chapter_filename = trim($item[4]);
				$chapter_image = trim($item[5]);
				$publish = trim($item[6]);
				if ($publish){
					$chapter_publish = true;
				}
				else{
					$chapter_publish = false;
				}
				// we add .html here in case not in spreadsheet
				if (!strpos($chapter_filename, '.html')){
					$chapter_filename .= '.html';
				}
				// create text
				//$new_text = $template_text;
				//$fh = fopen($destination . '/'. $series_filename, 'w');
				//fwrite($fh, $new_text);
				//fclose($fh);
				//update index
				$index_text .= '
{
"id": '. $i . ',
"title": "'. $chapter_title . '",
"desciption": "'. $chapter_description . '",
"count": '. $chapter_number .',
"filename": "'. substr($chapter_filename, 0, -5) .'",
"image": "'. $chapter_image . '",
"publish": "'. $chapter_publish. '"	 
},';
            $i++;
		    }
		}
		$index_text = substr($index_text,0, -1) . ']}';
		$out['debug'] .= $index_text . "\n";
		$fh = fopen($destination . '/index.json', 'w');
		if ($fh !== null){
			fwrite($fh, $index_text);
		}
		fclose($fh);
	  }
	$p['text'] = $index_text;
	$p['filename'] = 'index';
	$p['file_type'] = 'json';
	$o = createContent($p);
	$out['debug'] .= $o['debug'];
	$out['error'] = isset($o['error']) ? $o['error']: false;
	$out['message'] = isset($o['message']) ? $o['message']: false;
	return $out;
}

// create series index
function setupSeriesFirstSteps($p){
	$out['debug'] = 'setupSeriesFirstSteps'. "\n";
	if (!isset($p['language_iso'])){
		$out['debug'] = 'language_iso not set'."\n";
		return $out;
	}
	$source = ROOT_EDIT. 'content/'. $p['country_code'] .'/templates/first_steps/' ;
	if (file_exists($source)){
		$destination = ROOT_EDIT. 'content/'. $p['country_code'] .'/'. $p['language_iso'] . '/first_steps/' ;
		
		$out['debug'] .= $source . "\n";
		$out['debug'] .= $destination . "\n";
		if (!file_exists($destination)){
			dirMake($destination);
		}
		copy_global($source, $destination);
	}
	return $out;
}
// only set up directory for styles; 
// do NOT copy styles into here
// encouarage people to use the ZZ folder
function setupStylesCountry($p){
	if (!isset($p['country_code'])){
		$out['debug'] = 'country_code not set'."\n";
		return $out;
	}
	$country_directory = ROOT_EDIT. 'content/'. $p['country_code'] . '/' ;
	if (!file_exists($country_directory . 'styles')){
		dirMake($country_directory . 'styles');
	}
	
}
function setupTemplatesCountry($p){
	if (!isset($p['country_code'])){
		$out['debug'] = 'country_code not set'."\n";
		return $out;
	}
	$setup_directory = ROOT_EDIT. 'content/ZZ/' ;
	$country_directory = ROOT_EDIT. 'content/'. $p['country_code'] . '/' ;
	$out['debug'] = 'setupTemplatesCountrY' . "\n";
	
	if (!file_exists($country_directory . 'templates')){
		dirMake($country_directory . 'templates');
	}
	$template_dir = $setup_directory . 'templates/';
	$p['folder_name'] = array();
	$dir = new DirectoryIterator($template_dir);
	foreach ($dir as $fileinfo) {
		if ($fileinfo->isDir() && !$fileinfo->isDot()) {
			$dir = $fileinfo->getFilename();
			if (!file_exists($country_directory .'templates/'. $dir)){
				dirMake($country_directory .'templates/'. $dir);
			}
			$source = $setup_directory .'templates/'. $dir . '/';
			$out['debug'] .= "Source is " . $source . "\n";
			if (file_exists($source)){
				$destination = $country_directory .'templates/'. $dir . '/';
				$out['debug'] .= "Destination is " . $destination . "\n";
				$o = copy_global($source, $destination);
				$out['debug'] .= $o['debug'];
				
			}
		}
	}
	return $out;
}
function setupTemplatesLanguage($p){
	if (!isset($p['language_iso'])){
		$out['debug'] = 'language_iso not set'."\n";
		return $out;
	}
	$setup_directory = ROOT_EDIT. 'content/'. $p['country_code'] .'/' ;
	$language_directory = ROOT_EDIT. 'content/'. $p['country_code'] .'/'. $p['language_iso'] . '/' ;
	$out['debug'] = 'setupTemplatesLanguage' . "\n";
	if (!file_exists($language_directory . 'templates')){
		dirMake($language_directory . 'templates');
	}
	$template_dir = $setup_directory . 'templates/';
	$p['folder_name'] = array();
	$dir = new DirectoryIterator($template_dir);
	foreach ($dir as $fileinfo) {
		if ($fileinfo->isDir() && !$fileinfo->isDot()) {
			$dir = $fileinfo->getFilename();
			if (!file_exists($language_directory .'templates/'. $dir)){
				dirMake($language_directory .'templates/'. $dir);
			}
			$source = $setup_directory .'templates/'. $dir . '/';
			$out['debug'] .= 'Source is '. $source . "\n";
			if (file_exists($source)){
				$destination = $language_directory .'templates/'. $dir . '/';
				$out['debug'] .= 'Destination is '. $destination . "\n";
				copy_global($source, $destination);
			}
		}
	}
	return $out;
}