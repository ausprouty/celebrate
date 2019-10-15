<?php
function setupCountry($post, $root){
	$out['debug'] = 'setupCountry'. "
";
	foreach ($post as $param_name => $param_value) {
		$$param_name = $param_value;
	}
	$setup_directory = $root .  'content/ZZ/' ;
	$country_directory = $root . 'content/'. $country_code .'/';
	if (!file_exists($country_directory)){
		mkdir($country_directory);
	}
	// language.json
	if (!file_exists($country_directory . 'languages.json')){
		$fh = fopen($country_directory . 'languages.json', 'w');
		fwrite($fh, '[]');
		fclose($fh);
	}
	// copy images
	if (!file_exists($country_directory . 'images')){
		mkdir($country_directory . 'images');
	}
	$source = $setup_directory . 'images/GLOBAL/';
	$destination = $country_directory .'images/standard/';
	if (!file_exists($destination)){
		mkdir($destination);
	}
	copy_global($source, $destination);
	// copy styles
	setupStylesCountry($post, $root);
	//copy templates
	$out['debug'] .= 'copy templates' . "\n";
	setupTemplatesCountry($post, $root);
	if (!file_exists($country_directory . 'templates/library.json')){
		copy ($setup_directory . 'templates/library.json', $country_directory . 'templates/library.json');
	}
	return $out;
}
function setupImageFolder($post, $root, $conn){
	$out['debug'] = 'setupImageFolder';
	$source = $root . 'content/'. $country_code .'/images/standard/' ;
	$destination = $root . 'content/'. $country_code .'/images/'. $language_iso .'/' ;
	if (!file_exists($destination)){
		mkdir($destination);
	}
	copy_global($source, $destination);
	return $out;
}
function setupLanguageFolder($post, $root){
	$out['debug'] = 'setupLanguageFolder'. "
";
	foreach ($post as $param_name => $param_value) {
		$$param_name = $param_value;
	}
	$setup_directory = $root . 'content/'. $country_code .'/' ;
	$language_directory = $root . 'content/'. $country_code .'/'. $language_iso . '/' ;
	if (!file_exists($language_directory)){
		mkdir($language_directory);
	}
	if (!file_exists($language_directory . 'life')){
		mkdir($language_directory . 'life');
	}
	if (!file_exists($language_directory . 'basics')){
		mkdir($language_directory . 'basics');
	}
	if (!file_exists($language_directory . 'steps')){
		mkdir($language_directory . 'steps');
	}
	if (!file_exists($language_directory . 'compass')){
		mkdir($language_directory . 'compass');
	}
	if (!file_exists($language_directory . 'multiply')){
		mkdir($language_directory . 'multiply');
	}
	// copy images
	if (!file_exists($language_directory . 'images')){
		mkdir($language_directory . 'images');
	}
	$source = $setup_directory . 'images/';
	if (file_exists($source)){
		$destination = $language_directory .'images/standard';
		copy_global($source, $destination);
	}
	else{
		setupCountry($post, $root);
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
		setupCountry($post, $root);
	}
	// copy styles
	if (!file_exists($language_directory . 'styles')){
		mkdir($language_directory . 'styles');
	}
	$source = $setup_directory .'styles/';
	if (!file_exists($source)){
		setupStylesCountry($post, $root);
	}
	if (file_exists($source)){
		$destination = $language_directory .'styles/';
		copy_global($source, $destination);
	}
	//copy templates
	$out['debug'] .= 'copy templates' . "\n";
	setupTemplatesLanguage($post, $root);
	return $out;
}

function setupSeries($post, $root){
	$out['debug'] = 'setupLanguageFolder'. "
";
	foreach ($post as $param_name => $param_value) {
		$$param_name = $param_value;
	}
	if (!strpos($index, '.json')){
		$index .= '.json';
	}
	$template_file = $root . 'content/' . $country_code .'/'. $language_iso .'/templates/'. $template;
	$template_text = file_get_contents($template_file);
	$destination = $root .'content/'. $country_code .'/'. $language_iso .'/'. $folder;
	//Import Series in tab format (number| title | description| bible reference| filename)
	$out['debug'] = 'entered setupSeries for template' . $template_file;
	if ($_FILES['file']['error'] == UPLOAD_ERR_OK               //checks for errors
      && is_uploaded_file($_FILES['file']['tmp_name'])) { //checks that file is uploaded
		$text =  file_get_contents($_FILES['file']['tmp_name']); 
		$out['debug'] .= $text;
		$index_text = '{
		"series" :"'. $series_name . '",
	"language" : "'. $language_iso . '",
	"description":"'. $description . '",
	"chapters": [';
		$lines = explode("\n", $text);
		$i = 0;
		foreach ($lines as $line){
			$item = explode ("\t", $line);
			if (count($item) >= 5){
				$series_number = $item[0];
				$series_title = $item[1];
				$series_description = $item[2];
				$series_reference = $item[3];
				$series_filename = trim($item[4]);
				if (!strpos($series_filename, '.html')){
					$series_filename .= '.html';
				}
				// create text
				$new_text = $template_text;
				$fh = fopen($destination . '/'. $series_filename, 'w');
				fwrite($fh, $new_text);
				fclose($fh);
				//update index
				$index_text .= '
{
"id": '. $i . ',
"title": "'. $series_title . '",
"desciption": "'. $series_description. '",
"count": '. $series_number .',
"filename": "'. substr($series_filename, 0, -5) .'"	
},';
            $i++;
		    }
		}
		$index_text = substr($index_text,0, -1) . ']}';
		$out['debug'] .= $index_text . "\n";
		$fh = fopen($destination . '/'. $index, 'w');
		if ($fh !== null){
			fwrite($fh, $index_text);
		}
		fclose($fh);
	  }

	return $out;
}

// create series index
function setupSeriesFirstSteps($post, $root){
	$out['debug'] = 'setupSeriesFirstSteps'. "
";
	foreach ($post as $param_name => $param_value) {
		$$param_name = $param_value;
	}
	$source = $root . 'content/'. $countryCODE .'/templates/first_steps/' ;
	if (file_exists($source)){
		$destination = $root . 'content/'. $countryCODE .'/'. $languageISO . '/first_steps/' ;
		
		$out['debug'] .= $source . "\n";
		$out['debug'] .= $destination . "\n";
		if (!file_exists($destination)){
			mkdir($destination);
		}
		copy_global($source, $destination);
	}
	return $out;
}
function setupStylesCountry($post, $root){
	
	foreach ($post as $param_name => $param_value) {
		$$param_name = $param_value;
	}
	$setup_directory = $root . 'content/ZZ/' ;
	$country_directory = $root . 'content/'. $country_code . '/' ;
	if (!file_exists($country_directory . 'styles')){
		mkdir($country_directory . 'styles');
	}
	$source = $setup_directory .'styles/';
	$destination = $country_directory .'styles/';
	copy_global($source, $destination);
}
function setupTemplatesCountry($post, $root){
	foreach ($post as $param_name => $param_value) {
		$$param_name = $param_value;
	}
	$setup_directory = $root . 'content/ZZ/' ;
	$country_directory = $root . 'content/'. $country_code . '/' ;
	$out['debug'] = 'setupTemplatesCountrY' . "\n";
	
	if (!file_exists($country_directory . 'templates')){
		mkdir($country_directory . 'templates');
	}
	$template_dir = $setup_directory . 'templates/';
	$folders = array();
	$dir = new DirectoryIterator($template_dir);
	foreach ($dir as $fileinfo) {
		if ($fileinfo->isDir() && !$fileinfo->isDot()) {
			$dir = $fileinfo->getFilename();
			if (!file_exists($country_directory .'templates/'. $dir)){
				mkdir($country_directory .'templates/'. $dir);
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
function setupTemplatesLanguage($post, $root){
	foreach ($post as $param_name => $param_value) {
		$$param_name = $param_value;
	}
	$setup_directory = $root . 'content/'. $country_code .'/' ;
	$language_directory = $root . 'content/'. $country_code .'/'. $language_iso . '/' ;
	$out['debug'] = 'setupTemplatesLanguagE' . "
";
	if (!file_exists($language_directory . 'templates')){
		mkdir($language_directory . 'templates');
	}
	$template_dir = $setup_directory . 'templates/';
	$folders = array();
	$dir = new DirectoryIterator($template_dir);
	foreach ($dir as $fileinfo) {
		if ($fileinfo->isDir() && !$fileinfo->isDot()) {
			$dir = $fileinfo->getFilename();
			if (!file_exists($language_directory .'templates/'. $dir)){
				mkdir($language_directory .'templates/'. $dir);
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