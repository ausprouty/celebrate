<?php
/*
  returns directories that can be used for content
  $p[language_iso] must be set
  $p[country_code]
*/
function getContentFoldersForLanguage($p){
	$exclude = ['images', 'styles', 'templates', 'menu'];
	$directory = 'content/' ;
	$countries = array();
	$results = '[';
	if (file_exists(ROOT_EDIT. $directory)){
        // find all countries
		$dir = new DirectoryIterator(ROOT_EDIT. $directory);
		foreach ($dir as $fileinfo) {
			if ($fileinfo->isDir() && !$fileinfo->isDot()) {
				$name = $fileinfo->getFilename();
				$countries[] = $name;
			}
		}
		foreach ($countries as $country){
			$dir = new DirectoryIterator(ROOT_EDIT. $directory . $country);
			foreach ($dir as $fileinfo) {
				if ($fileinfo->isDir() && !$fileinfo->isDot()) {
					$name = $fileinfo->getFilename();
					if (!in_array($name,$exclude)){
                        if ($name == $p['language_iso']){
                            $results.= '"'. $country. '/'.  $name .'",';
                        }
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