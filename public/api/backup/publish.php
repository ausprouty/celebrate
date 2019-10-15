<?php

function publishCountries($recnum, $my_uid, $root, $conn){
}
function publishLanguage($recnum, $my_uid, $root, $conn){
}
function publishLibrary($recnum, $my_uid, $root, $conn){
	$debug = 'in publishLibrary'. "\n";
	$sql = "select * from content 
		WHERE recnum = $recnum
		ORDER BY recnum DESC LIMIT 1";
	$debug .= $sql . "\n";
	$query = $conn->query($sql);
	$index = $query->fetch_array();
	// give nice names for sql
	foreach ($index as $param_name => $param_value) {
		$$param_name = $param_value;
		$debug .= $$param_name. "\n";
	}
	$debug .= $index['text']. "\n";
	$books = JSON_DECODE ($index['text']);
	foreach ($books as $book){
		if ($book->format == 'series'){
			$debug .= $book->book . ' is series' . "\n";
			$this_filename = $book->index;
			$this_folder = $book->folder;
			$sql = "select recnum from content 
				WHERE country_iso =  '$country_iso' AND language_iso =  '$language_iso'
				AND folder =  '$this_folder' AND filename =  '$this_filename'
				AND publish_date IS NULL
				ORDER BY recnum DESC LIMIT 1";
			$query = $conn->query($sql);
			$series = $query->fetch_array();
			if (isset($series['recnum'])){
				$debug .= publishSeries($series['recnum'], $my_uid, $root, $conn);
			}
		}
		else{
			$debug .= $book->book . ' is page' . "\n";
			$this_filename = $book->page;
			$this_folder = $book->folder;
			$sql = "select recnum from content 
				WHERE country_iso =  '$country_iso' AND language_iso =  '$language_iso'
				AND folder =  '$this_folder' AND filename =  '$this_filename'
				AND publish_date IS NULL
				ORDER BY recnum DESC LIMIT 1";
			$query = $conn->query($sql);
			$page = $query->fetch_array();
			if (isset($page['recnum'])){
				$debug .= publishPage($page['recnum'], $my_uid, $root, $conn);
			}
		}
	}
	$debug .= publishPage($recnum, $my_uid, $root, $conn);
	return $debug;
	
}
function publishSeries($recnum, $my_uid, $root, $conn){
	$debug = 'in publishSeries'. "\n";
	// get library
	$sql = "select * from content 
		WHERE recnum = $recnum
		ORDER BY recnum DESC LIMIT 1";
	$debug .= $sql . "\n";
	$query = $conn->query($sql);
	$index = $query->fetch_array();
	// give nice names for sql
	foreach ($index as $param_name => $param_value) {
		$$param_name = $param_value;
		$debug .= $$param_name. "\n";
	}
	$debug .= $index['text']. "\n";
	$text = JSON_DECODE ($index['text']);
	
	$chapters = $text->chapters;
	// publish each chapter in latest index
	foreach ($chapters as $chapter){
		$this_filename = $chapter->filename;
		$debug .= $this_filename . "\n";
		$sql = "select recnum from content 
			WHERE country_iso =  '$country_iso' AND language_iso =  '$language_iso'
			AND folder =  '$folder' AND filename =  '$this_filename'
			AND publish_date IS NULL
			ORDER BY recnum DESC LIMIT 1";
		$query = $conn->query($sql);
		$chapter_revision = $query->fetch_array();
	    if ($chapter_revision['recnum']) {
			$debug .= publishPage($chapter_revision['recnum'] ,$my_uid, $root, $conn);
		}
	}
	$debug .= publishPage($recnum, $my_uid, $root, $conn);
	return $debug;
	
}
function publishPage($recnum, $my_uid, $root, $conn){
	$debug = 'in publishPage'. "\n";
	$debug .= 'REcnum: ' . $recnum . "\n";
	$sql = "select * from content 
		WHERE recnum = $recnum
		ORDER BY recnum DESC LIMIT 1";
	$debug .= $sql . "\n";
	$query = $conn->query($sql);
	$content = $query->fetch_array();
	// make nice names
	foreach ($content as $param_name => $param_value) {
		$$param_name = $param_value;
		$debug .= $param_name . ' = ' . $param_value. "\n";
	}
	// update records
	$publish_date = time();
	$sql = "update content SET publish_uid = '$my_uid',  publish_date ='$publish_date'
			WHERE country_iso =  '$country_iso' AND language_iso =  '$language_iso'
			AND folder =  '$folder' AND filename =  '$filename'
			AND publish_date IS NULL";
	$debug .= $sql . "\n";
	$query = $conn->query($sql);
	// create file
	$filename = $root . 'content/'. $country_iso . '/' . $language_iso. '/'. $folder . '/'. $filename;
	$filetype = '.'. $filetype;
	if (!strpos ($content['filename'], $filetype)){
		$filename .= $filetype;
	}
	$filename = str_ireplace('//', '/', $filename);
	$fh = fopen($filename, 'w');
	fwrite($fh, $content['text']);
	fclose($fh);
	
    return $debug;	
}
