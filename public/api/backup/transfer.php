<?php
function transferIndex($post, $root){
	foreach ($post as $param_name => $param_value) {
		if ($param_value == 'null'){
			$param_value = '';
		}
		$$param_name = $param_value;
	}
	$root .= 'content/';
	$country_dir = $root . $countryCODE;
	if (file_exists($country_dir)){
		$language_dir = $country_dir . '/'. $languageISO;
		if (file_exists($language_dir)){
			$this_dir = $language_dir . '/life/';
			if (file_exists($this_dir)){
				$content = file_get_contents($this_dir . 'index.json' );
				$content = str_ireplace('"principles"', '"life"', $content );
				$content = str_ireplace('principle2', 'life2', $content );
				$fh = fopen($this_dir . 'index.json', 'w');
				fwrite($fh, $content);
				fclose($fh);
			}
		}
	}

}
function transferMyfriends($post, $root){
	transferBasics($post, $root);
	transferLife($post, $root);
	foreach ($post as $param_name => $param_value) {
		if ($param_value == 'null'){
			$param_value = '';
		}
		$$param_name = $param_value;
	}
	$root .= 'content/';
	$country_dir = $root . $countryCODE;
	if (file_exists($country_dir)){
		$language_dir = $country_dir . '/'. $languageISO;
		if (file_exists($language_dir)){
			$old_dir = $language_dir . '/myfriends';
			if (file_exists($old_dir)){
				rename ($old_dir .'/about.html', $language_dir . '/about.html');
				rename ($old_dir .'/celebrate.html', $language_dir . '/celebrate.html');
				rename ($old_dir .'/community.html', $language_dir . '/community.html');
				rename ($old_dir .'/gospel.html', $language_dir . '/gospel.html');
				rmdir($old_dir);
			}
		}
	}
}
//// add content to database
function transferBasics($post, $root){
    foreach ($post as $param_name => $param_value) {
		if ($param_value == 'null'){
			$param_value = '';
		}
		$$param_name = $param_value;
	}
	$root .= 'content/';
	$country_dir = $root . $countryCODE;
	if (file_exists($country_dir)){
		$language_dir = $country_dir . '/'. $languageISO;
		if (file_exists($language_dir)){
			$old_dir = $language_dir . '/myfriends';
			if (file_exists($old_dir)){
				$new_dir = $language_dir . '/basics';
				if (!file_exists($new_dir)){
					mkdir($new_dir);
				}
				transferSome($old_dir, $new_dir, 'basics');
			}
			if (file_exists($new_dir .'/basics-chapters.json')){
				rename ($new_dir .'/basics-chapters.json', $new_dir . '/index.json');
			}
			if (file_exists($new_dir .'/basics.json')){
				rename ($new_dir .'/basics.json', $new_dir . '/index.json');
			}
		}
	}

}
function transferLife($post, $root){
    foreach ($post as $param_name => $param_value) {
		if ($param_value == 'null'){
			$param_value = '';
		}
		$$param_name = $param_value;
	}
	$root .= 'content/';
	$country_dir = $root . $countryCODE;
	if (file_exists($country_dir)){
		$language_dir = $country_dir . '/'. $languageISO;
		if (file_exists($language_dir)){
			$old_dir = $language_dir . '/myfriends';
			if (file_exists($old_dir)){
				$new_dir = $language_dir . '/life';
				mkdir($new_dir);
				transferRename($old_dir, $new_dir, 'principle', 'life');
			}
			if (file_exists($new_dir .'/life-chapters.json')){
				rename ($new_dir .'/life-chapters.json', $new_dir . '/index.json');
			}
			if (file_exists($new_dir .'/life.json')){
				rename ($new_dir .'/life.json', $new_dir . '/index.json');
			}
		}
	}
}
function transferPages($post, $root){
    foreach ($post as $param_name => $param_value) {
		if ($param_value == 'null'){
			$param_value = '';
		}
		$$param_name = $param_value;
	}
}
function transferSteps($post, $root){
    foreach ($post as $param_name => $param_value) {
		if ($param_value == 'null'){
			$param_value = '';
		}
		$$param_name = $param_value;
	}
	$root .= 'content/';
	$country_dir = $root . $countryCODE;
	if (file_exists($country_dir)){
		$language_dir = $country_dir . '/'. $languageISO;
		if (file_exists($language_dir)){
			$steps_dir = $language_dir . '/first_steps';
			if (file_exists($steps_dir)){
				$new_dir = $language_dir . '/steps';
				rename ($steps_dir, $new_dir);
				$ending = '';
				if (file_exists($new_dir .'/first_steps-chapters.json')){
					rename ($new_dir .'/first_steps-chapters.json', $new_dir . '/index.json');
				}
				if (file_exists($new_dir .'/first_steps.json')){
					rename ($new_dir .'/first_steps.json', $new_dir . '/index.json');
				}
				if (file_exists($new_dir .'/first_steps-template.html')){
					rename ($new_dir .'/first_steps-template.html', $new_dir . '/steps-template.html');
				}
			}
		}
	}
}
function transferSome($source, $destination, $mask){
	if (file_exists($source)){
		$out['debug'] = 'Source exists: '. $source . "\n";
		$handler = opendir ($source);
		while ($mfile = readdir ($handler)){
			if ($mfile != '.' && $mfile != '..' ){
				if (strpos($mfile, $mask) !== FALSE){
					rename($source . '/'.$mfile, $destination. '/'.$mfile);
				}
			}
		}
	}
	return $out;
}


function transferRename($source, $destination, $old_mask, $new_mask){
	if (file_exists($source)){
		$out['debug'] = 'Source exists: '. $source . "\n";
		$handler = opendir ($source);
		while ($mfile = readdir ($handler)){
			if ($mfile != '.' && $mfile != '..' ){
				if (strpos($mfile, $old_mask) !== FALSE){
					$new_name = str_ireplace($old_mask, $new_mask, $mfile);
					rename($source . '/'.$mfile, $destination. '/'.$new_name);
				}
			}
		}
	}
	return $out;
}