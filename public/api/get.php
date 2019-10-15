<?php

function getFoldersContent($p){
	$out['debug'] = 'getFoldersContent'. "\n";
	if (!$p['language_iso']){
		$out['debug'] .= "language_iso not set\n";
		return $out;
	}
	$exclude = array('images', 'styles', 'templates');
	$path = ROOT_EDIT. 'content/'. $p['country_code'] .'/'. $p['language_iso'] ;
	$out ['debug'] = $path . "\n";
	$results = null;
	if (file_exists($path)){
		$results = '[';
		$dir = new DirectoryIterator($path);
		foreach ($dir as $fileinfo) {
			if ($fileinfo->isDir() && !$fileinfo->isDot()) {
				$name = $fileinfo->getFilename();
				if (!in_array($name, $exclude)){
					$results .= '"'. $name .'",';
				}
			}
		}
		if (strlen($results) > 1){
			$results = substr($results,0, -1) . ']';
		}
		else{
			$results = null;
		}
	}
	$out['content'] = $results;
	return $out;
}

// get folders from both global and country

// get folders from both global and country
function getFoldersImages($p){
	$out['debug'] = 'getFolders'. "\n";
	$directory = 'content/' ;
	$countries = array();
	$results = '[';
	if (file_exists(ROOT_EDIT. $directory)){
		$out['debug'] .= 'root direcgtory exists' . "\n";
		$dir = new DirectoryIterator(ROOT_EDIT. $directory);
		foreach ($dir as $fileinfo) {
			if ($fileinfo->isDir() && !$fileinfo->isDot()) {
				$name = $fileinfo->getFilename();
				$countries[] = $name;
			}
		}
		foreach ($countries as $country){
			$check = ROOT_EDIT. $directory . $country .'/images';
			$out['debug'] .= $check . "\n";
			if (file_exists($check)){
				$dir = new DirectoryIterator($check);
				foreach ($dir as $fileinfo) {
					if ($fileinfo->isDir() && !$fileinfo->isDot()) {
						$name = $fileinfo->getFilename();
						$results.= '"'. $country. '/images/'.  $name .'",';
					}
				}
			}
		}
		if (strlen($results) > 1){
			$results = substr($results,0, -1) . ']';
			$out['message'] = "Language folders found";
		}
		else{
			$results = null;
			$out['message'] = "NO Language Folders";
		}
		$out['content'] = $results;
		$out['error'] = false;
	}
	else{
		$results = null;
			$out['message'] = "NO Language Folders";
	}
	return $out;
	
}
// get images from folder (in /content) so it can transfer from edit to prototype
function getImages($p){
	$out['debug'] = 'getImages'. "\n";
	$results = '[';
	$out['debug'] = 'in get Images' . "\n";
    $dir = ROOT_EDIT. '/content/'. $p['image_dir'];
	$out['debug'] .= 'dir:' .  $dir . "\n";
	if (file_exists($dir)){
		$handler = opendir ($dir);
		while ($mfile = readdir ($handler)){
			if ($mfile != '.' && $mfile != '..' ){
					$results.= '"' .  $mfile .'",';
			}
	
		}
		closedir ($handler);
	}
	if (strlen($results) > 1){
		$results = substr($results,0, -1) . ']';
		$out['message'] = "Images found";
	}
	else{
		$results = null;
		$out['message'] = "NO images found";
	}
	$out['content'] = $results;
	$out['error'] = false;
	return $out;
	
}
// get styles from both global and country
function getStyles($p){
	$out['debug'] = 'getStyles'. "\n";
	if (!$p['country_code']){
		$out['debug'] .= "country_code not set\n";
		return $out;
	}
	$out['debug'] = 'getStyles'. "\n";
	$global_directory = '/content/ZZ/styles/' ;
	$country_directory = '/content/' .  $p['country_code'] . '/styles/';
	$results = '[';
	$out['debug'] = $country_directory . "\n";
	$out['debug'] .= $global_directory . "\n";
	if (file_exists(ROOT_EDIT. $global_directory)){
		$handler = opendir (ROOT_EDIT. $global_directory);
		while ($mfile = readdir ($handler)){
			if ($mfile != '.' && $mfile != '..' ){
				$results.= '"' . $global_directory . $mfile .'",';
			}
		}
		closedir ($handler);
	}
	if (file_exists(ROOT_EDIT. $country_directory) && $country_directory != $global_directory){
		$handler = opendir (ROOT_EDIT. $country_directory);
		while ($mfile = readdir ($handler)){
			if ($mfile != '.' && $mfile != '..' ){
				$results.= '"'. $country_directory.  $mfile .'",';
			}
		}
		closedir ($handler);
	}
	if (strlen($results) > 1){
		$results = substr($results,0, -1) . ']';
		$out['message'] = "Styles found";
	}
	else{
		$results = null;
		$out['message'] = "NO styles found";
	}
	$out['content'] = $results;
	$out['error'] = false;
	return $out;
	
}
// use country and language
// this looks for template in the language/templates directory
// copies it into  $p['filename'] 
// and then returns as content
// todo: why are we copying?
function getTemplate($p){
	$out['debug'] = 'getTemplate'. "\n";
	if (!$p['language_iso']){
		$out['debug'] .= "language_iso not set\n";
		return $out;
	}
	if (!$p['template']){
		$out['debug'] .= "template not set\n";
		return $out;
	}
	$language_dir = ROOT_EDIT.  'content/'. $p['country_code'] .'/'. $p['language_iso'] ;
	$template = $language_dir .'/templates/'. $p['template'];
	$out['debug'] =' template is '. $p['template']. "\n";
	$destination = $language_dir . '/'. $p['filename'];
	$out['debug'] .=' destination is '. $destination. "\n";
	if (file_exists($template)){
		copy ($template, $destination);
		$out['message'] = "Template copied";
		$out['debug'] .= "Template copied". "\n";
		$out['debug'].= file_get_contents($template) . "\n";
		$out['content'] = file_get_contents($template); 
	}
	else{
		$out['content'] = null;
		$out['debug'] .= "NO template found". "\n";
		$out['message'] = "NO Templates found";
	}
	$out['error'] = false;
	return $out;
}
// use country and language
function getTemplates($p){
	$out['debug'] = 'getTemplates'. "\n";
	if (!$p['language_iso']){
		$out['debug'] .= "language_iso not set\n";
		return $out;
	}
	
    $results = '[';
	$template_directory = ROOT_EDIT. 'content/'. $p['country_code'] .'/'. $p['language_iso'] .'/templates/';
	$out['debug'] .= $template_directory . "\n";
	// find folders
	if (!file_exists($template_directory)){
        $include = 'setup.php';
		require_once('setup.php');
		$out['debug'] .= ' template directory does not exist so going to Setup Templates' . "\n";
		$out2 = setupTemplatesCountry ($p);
		$out3 = setupTemplatesLanguage ($p);
		$out['debug'] .= $out2 ['debug'] . $out3 ['debug'];
    }
	if (file_exists($template_directory)){
        $results = '[';
	    $folders =  array();
		$handler = opendir ($template_directory);
		while ($mfile = readdir ($handler)){
			if ($mfile != '.' && $mfile != '..' ){
				$folders[] =  $mfile;
			}
		}
		closedir ($handler);
		foreach ($folders as $folder){
			if (is_dir($template_directory . $folder)){
				$handler = opendir ($template_directory . $folder);
				while ($mfile = readdir ($handler)){
					if ($mfile != '.' && $mfile != '..' ){
						$results.= '"'. $folder . '/' . $mfile .'",';
					}
				}
				closedir ($handler);
			}
			else{ // there are some files in the root directory
				$results.= '"'. $folder  .'",';
			}
		}
		if (strlen($results) > 1){
			$results = substr($results,0, -1) . ']';
			$out['message'] = "Templates found";
			$out['error'] = false;
		}
		else{
			$out['debug'] .= ' No templates so going to Setup Templates' . "\n";
			require_once(setup.php);
			$out2 = setupTemplatesCountry ($p);
			$out3 = setupTemplatesLanguage($p);
			$out['debug'] .= $out2 ['debug'] . $out3 ['debug'];
			$handler = opendir ($template_directory);
			while ($mfile = readdir ($handler)){
				if ($mfile != '.' && $mfile != '..' ){
					$foldernames[] =  $mfile;
				}
			}
			closedir ($handler);
			foreach ($folders as $folder){
				$handler = opendir ($template_directory . $folder);
				while ($mfile = readdir ($handler)){
					if ($mfile != '.' && $mfile != '..' ){
						$results.= '"'. $folder . '/' . $mfile .'",';
					}
				}
				closedir ($handler);
			}
			if (strlen($results) > 1){
				$results = substr($results,0, -1) . ']';
				$out['message'] = "Templates found";
				$out['error'] = false;
			}
		}
		$out['content'] = $results;
	}
	return $out;
	
}