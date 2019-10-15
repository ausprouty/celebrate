<?php

//// add content to database
function createContent($post, $root, $conn){
	$out['debug'] = 'createContent'. "\n";
	foreach ($post as $param_name => $param_value) {
		if ($param_value == 'null'){
			$param_value = '';
		}
		$$param_name = $param_value;
	}
	GLOBAL $version;
	if (!isset($language_iso)){
		$language_iso = '';
	}
	if (!isset($folder)){
		$folder = '';
	}
	if (!isset($title)){
		$title = '';
	}
	if (!isset($version)){
		$version = 1;
	}
	$edit_date = time();
	$publish_date = time();
	$text = $conn->real_escape_string($text);
	$sql = "insert into content (version,edit_date,edit_uid,language_iso,
	country_iso,folder,filetype,title,filename,text) values ('$version','$edit_date','$my_uid','$language_iso','$country_code','$folder','$filetype','$title','$filename','$text')";
	
	$query = $conn->query($sql);

	if($query){
		$out['message'] = "Content Added Successfully";
	}
	else{
		$out['error'] = true;
		$out['message'] = "Could not add Content";
	}
	$out['debug'] .= $sql . "\n";
	$out['debug'] .= $out['message'] . "\n";
	return $out;
}

// create directory
function createContentFolder($post, $root, $conn){
	$out['debug'] = 'createContentFolder'. "\n";
	foreach ($post as $param_name => $param_value) {
		$$param_name = $param_value;
	}
	$dir = $root . '/content/'. $country_code. '/'. $language_iso . '/'. $folder;
	$out['debug'] .= 'dir: ' . $dir ."\n";
	if (!file_exists($dir)){
		mkdir ($dir);
	}
	return $out;
}

// create directory
function createDir($post, $root, $conn){
	$out['debug'] = 'createDir'. "\n";
	foreach ($post as $param_name => $param_value) {
		$$param_name = $param_value;
	}
	switch ($scope){
		case 'country':
			$dir = $root .'/content/'. $code;
			break;
		case 'language':
		$dir = $root .'/content/'. $country . '/'. $code;
			break;
		case 'menu':
			$dir = $root .'/images/library/menu-'. $code;
			break;
		case 'folder':
			break;
	}
	$out['debug'] .= 'dir: ' . $dir ."\n";
	if (!file_exists($dir)){
		mkdir ($dir);
	}
	return $out;
	
}
// create series index
function createSeriesIndex($post, $root, $conn){
	$out['debug'] = 'createSeriesIndex'. "\n";
	foreach ($post as $param_name => $param_value) {
		$$param_name = $param_value;
	}
	$content = '[]';
	$file_index = $root . 'content/' . $country_code . '/'. $language_iso . '/'. $folder .'/'. $index;
	$out['debug'] .= 'index: ' . $file_index  ."\n";
	if (!file_exists($file_index )){
		$fh = fopen($file_index , 'w');
		fwrite($fh, $content);
		fclose($fh);
	}
	return $out;
}
function createStyle($post, $root, $conn){
	$out['debug'] = 'createStyle'. "\n";
	foreach ($post as $param_name => $param_value) {
		$$param_name = $param_value;
	}
	switch ($_FILES['file']['type']){
		case 'text/css':
		   $type = '.css';
		   $valid = true;
		   break;
		default:
			$valid = false;
    }
	if ($valid){
		$dir = $root . 'content/' . $country_code . '/styles/';
		$out['debug'] .= 'directory: '. $dir . "\n";
		if (!file_exists($dir)){
			mkdir ($dir);
		}
		$fname = $dir. $_FILES["file"]["name"];
		$out['debug'] .= 'fname: '. $fname . "\n";
		if (move_uploaded_file($_FILES["file"]["tmp_name"], $fname)) {
			$out['error'] = false;
			$out['message'] = "Style Saved";
		}
		else{
			$out['error'] = true;
			$out['message'] = "Style NOT Saved";
		}
	}
	return $out;
}

function createTemplate ($post, $root, $conn){
	$out['debug'] = 'createTemplate'. "\n";
	foreach ($post as $param_name => $param_value) {
		$$param_name = $param_value;
	}
	switch ($_FILES['file']['type']){
		case 'text/html':
		   $type = '.html';
		   $valid = true;
		   break;
		default:
			$valid = false;
	}
	if ($valid){
		$dir = $root . 'content/' . $country_code . '/'.  $language_iso . '/templates/'. $folder ;
		if (!file_exists($dir)){
			mkdir ($dir);
		}
		$fname = $dir . '/'. $_FILES["file"]["name"];

		if (move_uploaded_file($_FILES["file"]["tmp_name"], $fname)) {
			$out['error'] = false;
			$out['message'] = "Style Saved";
		}
		else{
			$out['error'] = true;
			$out['message'] = "Style NOT Saved";
		}
	}
	return $out;
}