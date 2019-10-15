<?php

function getFoldersContent($post, $root){
	$out['debug'] = 'getFoldersContent'. "\n";
	foreach ($post as $param_name => $param_value) {
		$$param_name = $param_value;
	}
	$exclude = array('images', 'styles', 'templates');
	$path = $root . 'content/'. $country_code .'/'. $language_iso ;
	$out ['debug'] = $path . "\n";
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

// get styles from both global and country
function getFoldersLanguage($post, $root){
	$out['debug'] = 'getFoldersLanguage'. "\n";
	foreach ($post as $param_name => $param_value) {
		$$param_name = $param_value;
	}
	$exclude = ['images', 'styles', 'templates', 'menu'];
	$directory = 'content/' ;
	$countries = array();
	$results = '[';
	if (file_exists($root . $directory)){
		$dir = new DirectoryIterator($root . $directory);
		foreach ($dir as $fileinfo) {
			if ($fileinfo->isDir() && !$fileinfo->isDot()) {
				$name = $fileinfo->getFilename();
				$countries[] = $name;
			}
		}
		foreach ($countries as $country){
			$dir = new DirectoryIterator($root . $directory . $country);
			foreach ($dir as $fileinfo) {
				if ($fileinfo->isDir() && !$fileinfo->isDot()) {
					$name = $fileinfo->getFilename();
					if (!in_array($name,$exclude)){
						$results.= '"'. $country. '/'.  $name .'",';
					}
					$countries[] = $name;
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
// get folders from both global and country
function getFoldersImages($post, $root){
	$out['debug'] = 'getFolders'. "\n";
	foreach ($post as $param_name => $param_value) {
		$$param_name = $param_value;
	}
	$out['debug'] = 'in check folders library' . "\n";
	$directory = 'content/' ;
	$countries = array();
	$results = '[';
	if (file_exists($root . $directory)){
		$out['debug'] .= 'root direcgtory exists' . "\n";
		$dir = new DirectoryIterator($root . $directory);
		foreach ($dir as $fileinfo) {
			if ($fileinfo->isDir() && !$fileinfo->isDot()) {
				$name = $fileinfo->getFilename();
				$countries[] = $name;
			}
		}
		foreach ($countries as $country){
			$check = $root . $directory . $country .'/images';
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
// get images from folder
function getImages($post, $root){
	$out['debug'] = 'getImages'. "\n";
	foreach ($post as $param_name => $param_value) {
		$$param_name = $param_value;
	}
	$results = '[';
	$out['debug'] = 'in get Images' . "\n";
    $dir = $root . '/content/'. $image_dir;
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
function getStyles($post, $root){
	$out['debug'] = 'getStyles'. "\n";
	foreach ($post as $param_name => $param_value) {
		$$param_name = $param_value;
	}
	$root .= 'content/';
	$global_directory = 'ZZ/styles/' ;
	$country_directory =  $country_code . '/styles/';
	$results = '[';
	$out['debug'] = $country_directory . "\n";
	$out['debug'] .= $global_directory . "\n";
	if (file_exists($root . $global_directory)){
		$handler = opendir ($root . $global_directory);
		while ($mfile = readdir ($handler)){
			if ($mfile != '.' && $mfile != '..' ){
				$results.= '"' . $global_directory . $mfile .'",';
			}
		}
		closedir ($handler);
	}
	if (file_exists($root . $country_directory)){
		$handler = opendir ($root . $country_directory);
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
function getTemplate($post, $root){
	$out['debug'] = 'getTemplate'. "\n";
	foreach ($post as $param_name => $param_value) {
		$$param_name = $param_value;
	}
	$dir = $root .  'content/'. $countryCODE .'/'. $languageISO ;
	$template = $dir .'/templates/'. $template;
	$out['debug'] = $template. "\n";
	$destination = $dir . '/'. $fileNAME;
	$out['debug'] .= $destination. "\n";
	if (file_exists($template)){
		copy ($template, $destination);
		$out['message'] = "Template copied";
		$out['content'] = file_get_contents($template); 
	}
	else{
		$out['content'] = null;
		$out['message'] = "NO Templates found";
	}
	$out['error'] = false;
	return $out;
}
// use country and language
function getTemplates($post, $root){
	$out['debug'] = 'getTemplates'. "\n";
	foreach ($post as $param_name => $param_value) {
		$$param_name = $param_value;
	}
	$template_directory = $root . 'content/'. $country_code .'/'. $language_iso .'/templates/';
	$results = '[';
	$folders = array();
	$out['debug'] .= $template_directory . "\n";
	// find folders
	if (!file_exists($template_directory)){
		$include = '/home/vx5ui10wb4ln/public_html/create/setup.inc';
		require $include;
		$out['debug'] .= ' template directory does not exist so going to Setup Templates' . "\n";
		$out2 = setupTemplatesCountry ($post, $root);
		$out3 = setupTemplatesLanguage($post, $root);
		$out['debug'] .= $out2 ['debug'] . $out3 ['debug'];
	}
	if (file_exists($template_directory)){
		$handler = opendir ($template_directory);
		while ($mfile = readdir ($handler)){
			if ($mfile != '.' && $mfile != '..' ){
				$folders[] =  $mfile;
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
		else{
			$out['debug'] .= ' No templates so going to Setup Templates' . "\n";
			$include = '/home/vx5ui10wb4ln/public_html/create/setup.inc';
			require $include;
			$out2 = setupTemplatesCountry ($post, $root);
			$out3 = setupTemplatesLanguage($post, $root);
			$out['debug'] .= $out2 ['debug'] . $out3 ['debug'];
			$handler = opendir ($template_directory);
			while ($mfile = readdir ($handler)){
				if ($mfile != '.' && $mfile != '..' ){
					$folders[] =  $mfile;
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