<?php

//// add content to database
function transferBasics($post, $root){
    foreach ($post as $param_name => $param_value) {
		if ($param_value == 'null'){
			$param_value = '';
		}
		$$param_name = $param_value;
	}
}
function transferLife($post, $root){
    foreach ($post as $param_name => $param_value) {
		if ($param_value == 'null'){
			$param_value = '';
		}
		$$param_name = $param_value;
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
function fileRename($old_dir, $new_dir, $filename){}