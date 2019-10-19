<?php
if (!isset($_GET['action'])){die();}
// with help from https://github.com/RobDWaller/ReallySimpleJWT
require_once ('vendor/autoload.php');
require_once ('sql.php');
use ReallySimpleJWT\Token;
define("VERSION", '0.8');
define("ROOT_EDIT", '../../edit/');
define("ROOT_PROTOTYPE", '../../prototype/');
define("ROOT_PUBLISH", '../../mfjourney/');
define("ROOT_PROTOTYPE_CONTENT", '../../prototype/content/');
define("ROOT_PUBLISH_CONTENT", '../../mfjourney/content/');
define("ROOT_PROTOTYPE_IMAGES", '../../prototype/images/');
define("ROOT_PUBLISH_IMAGES", '../../mfjourney/images/');
define("STANDARD_CSS", '/content/ZZ/styles/myfriendsGLOBAL.css');
define("STANDARD_CARD_CSS",'/content/ZZ/styles/cardGLOBAL.css');
define("DEFAULT_BACK_RIBBON", 'ZZ/images/ribbons/back-ribbon-red.png');

// assign variables
$secret = 'sJeSuST423*&';
$dir_web = '/home/vx5ui10wb4ln/public_html/edit/api/';
$out = array(); 
$debug = 'From AuthorApi'. "\n";
$debug .= '$p[] = ' . "\n";
$debug .= 'parameters:' . "\n";
 foreach ($_POST as $param_name => $param_value) {
    $$param_name = $param_value;
	$debug .= $param_name . ' = ' . $param_value. "\n";
}
$debug .= 'end of parameters' . "\n";
$debug .= 'finished post loop' . "\n";
// $p is passed to all functions
$p = $_POST ;
$p['version'] = VERSION;// this can be overwritten
$p['debug'] = '';

// I am going to start computing this locally
//if (isset($p['bookmark'])){
//	$p['bm'] = json_decode($p['bookmark']);
//	$debug .= 'bookmark values: ' . $bookmark['language']->image_dir . "\n";
//}
if (isset($p['route'])){
	$debug .= "\n\n\n\n" .'set by route' . "\n";
    $route = json_decode($p['route']);
	$p['country_code'] = isset($route->country_code) ? $route->country_code : NULL;
	$debug .= 'country_code:' . $p['country_code'] . "\n";
	$p['language_iso'] = isset($route->language_iso )? $route->language_iso : NULL;
	$debug .= 'language_iso:' . $p['language_iso'] . "\n";
	$p['library_code'] = isset($route->library_code) ? $route->library_code : NULL;
	$debug .= 'library_code:' . $p['library_code'] .  "\n";
	$p['folder_name'] = isset($route->folder_name) ? $route->folder_name : NULL;
	$debug .= 'folder_name:' . $p['folder_name'].  "\n";
	$p['filename'] = isset($route->filename) ? $route->filename : NULL;
	$debug .= 'filename:' . $p['filename']. "\n\n\n";
}
// deal with action
$action = $_GET['action'];
$debug .= 'Action: '. $action . "\n";
if (isset($_GET['page'])){
	$debug .=  'Page: ' . $_GET['page'] . '.php'. "\n";
}
// login routine
if ($action == 'login'){
    $sql = "SELECT uid,password,firstname, lastname, countries FROM members 
        WHERE username = '". $p['username'] . "' LIMIT 1";
    $content = sqlArray($sql);
    $hash = $content['password'];
    if (password_verify($p['password'], $hash)) {
        $userId = $content['uid'];
        $expiration = time() + 360000;
        $secret = 'sJeSuST423*&';
        $issuer = 'create.myfriends.network';
        $token = Token::create($userId, $secret, $expiration, $issuer);
        $content['password'] = null;
        $out['content'] = $content;
        $out['token'] = $token;
        $debug .= 'authorized' . "\n";
    }
    else {
        $debug .= 'NOT authorized' . "\n";
    }
}
else{
    // take action if authorized user
    if (!isset($p['token'])){die();}
    $ok = Token::validate($p['token'], $secret );
    if($ok){
		// add any approved pages
		if (isset($_GET['page'])){
			// $allowed = array('create', 'debug', 'get', 'image', 'prototype', 'publish','register', 'setup');
			// if (!in_array($_GET['page'], $allowed )){
			//     die();
			// }
			$debug .= 'I am adding page' . "\n";
			require_once ($_GET['page'] . '.php');
		}
		$debug .= 'action is '  . $action ."\n";
		$out = $action ($p);
		if (isset($out['debug'])){
			$debug .= $out['debug'];
			unset ($out['debug']);
		}
		
    }
    else{
        $debug .= 'NOT AUTHORIED';
    }
}
//
// write log
//
$debug .= "\n\nHERE IS JSON_ENCODE OF DATA THAT IS NOT ESCAPED\n";
$debug .= json_encode($out) . "\n";
$fh = fopen('logs/' . $action . '.txt', 'w');
fwrite($fh, $debug);
fclose($fh);
//
//CORS	
//https://www.html5rocks.com/en/tutorials/cors/
//https://stackoverflow.com/questions/9631155/specify-multiple-subdomains-with-access-control-origin/9737907
//
if(isset($_SERVER['HTTP_ORIGIN'])) {
  $origin = $_SERVER['HTTP_ORIGIN'];
   if($origin == 'http://edit.myfriends.network' 
	OR $origin == 'https://edit.myfriends.network' 
	OR $origin == 'http://192.168.56.1:8080' 
	OR $origin == 'http://10.1.1.4:8080' 
	OR $origin == 'http://192.168.43.204:8080'
	OR $origin == 'http://localhost:8080' 
	OR $origin == 'http://prototype.hereslife.info') {
    header("Access-Control-Allow-Origin: $origin");
  }
}
// return response
header("Content-type: application/json");
echo json_encode($out, JSON_UNESCAPED_UNICODE);
die();

/*
/    // copies all files in directory and removes GLOBAL from the name
*/
function copy_global($source, $destination){
	
	$out = array();
	$out['debug'] = "Asked to copy $source to $destination \n";
	
	if (file_exists($source)){
		//$out['debug'] = 'Source exists: '. $source . "\n";
		$handler = opendir ($source);
		while ($mfile = readdir ($handler)){
			if ($mfile != '.' && $mfile != '..' ){
				$setup_file = $source . $mfile;
				if (!is_dir($setup_file)){
					$newfile = str_replace('GLOBAL', '', $mfile);
					$destination_file = $destination . $newfile;
					//$out['debug'] .= 'Destination File: '. $destination_file . "\n";
					if (!file_exists($destination_file)){
						//$out['debug'] .= 'Does not exist'. "\n";
						if (!is_dir($destination_file)){
								//$out['debug'] .= 'Is not directory: ' . "\n";
							if (strpos($setup_file, '.') !== FALSE){
								//$out['debug'] .= 'Has a dot: ' . "\n";
								copy ($setup_file, $destination_file);
								$out['debug'] .=  ' copied ' .  $setup_file . ' to ' . $destination_file . "\n\n";
							}
						}
					}
					else{
						$out['debug'] = 'Destination exists: '. $destination_file . "\n\n";
					}
				}
			}
		}
	}
	return $out;
}

function dirlist ($directory){
	if (file_exists($directory)){
		$results = '[';
		$handler = opendir ($directory);
		while ($mfile = readdir ($handler)){
			if ($mfile != '.' && $mfile != '..' ){
				$results.= '"'.  $mfile .'",';
			}
		}
		closedir ($handler);
		if (strlen($results) > 1){
			$results = substr($results,0, -1) . ']';
		}
		else{
			$results = null;
		}
	}
 return $results;
}
/* 
/  returns a json array of all folders in a given path
*/
function folders($path){
	if (file_exists($path)){
		$results = '[';
		$dir = new DirectoryIterator($path);
		foreach ($dir as $fileinfo) {
			if ($fileinfo->isDir() && !$fileinfo->isDot()) {
				$name = $fileinfo->getFilename();
				$results .= '"'. $name .'",';
			}
		}
		if (strlen($results) > 1){
			$results = substr($results,0, -1) . ']';
		}
		else{
			$results = null;
		}
	}
 return $results;
}

function dirMake($file){
	$dir = '';
	$parts = explode('/', $file);
	foreach ($parts as $part){
		if (strpos ($part, '.') < 2){
			$dir .= $part . '/';
			if (!file_exists($dir)){
				mkdir ($dir);
			}
		}
	}
}