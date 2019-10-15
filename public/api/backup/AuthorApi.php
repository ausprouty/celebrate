<?php
// with help from https://github.com/RobDWaller/ReallySimpleJWT
require_once ('vendor/autoload.php');
use ReallySimpleJWT\Token;
$secret = 'sec!ReT423*&';
$root = '../edit/';
$ok = false;

// connect to database
define("HOST", "localhost");
define("USER", "journey2018");
define("PASS", "ugWwRPb5ljRFeubJ");
define("DATABASE", "new_journey");
$conn = new mysqli(HOST, USER, PASS, DATABASE);

if ($conn->connect_error) {
    die("Connection has failed: " . $conn->connect_error);
}
$out = array('error' => false);

// assign variables
$debug = 'post' . "\n";
$debug .= 'parameters:' . "\n";
 foreach ($_POST as $param_name => $param_value) {
    $$param_name = $param_value;
	$debug .= $param_name . ' = ' . $param_value. "\n";
}
$debug .= 'end of parameters' . "\n";
$debug .= 'finished post loop' . "\n";
 
// display file contents
 if ($_FILES){
	$debug .= '$_FILES exists '. "\n";
	
	$debug .=  'file name: ' .  $_FILES['file']['name']. "\n";
	$debug .=  'type: ' .  $_FILES['file']['type']. "\n";
	$debug .=  'tmp_name: ' .  $_FILES['file']['tmp_name']. "\n";
	$debug .=  'error: ' .  $_FILES['file']['error']. "\n";
	$debug .=  'size: ' .  $_FILES['file']['size']. "\n\n";
}
// establish action to take

$action = 'deny';
if(isset($_GET['action'])){
	$action = $_GET['action'];
}
$debug .= '$action = ' . $action. "\n";
$page = '';
if(isset($_GET['page'])){
	$page = $_GET['page'];
}

$debug .= 'GET = ' . $action. "\n";
$debug_filename = $action . ".txt";


// authorize for a time
if($action == 'authorize'){
	$debug .= 'entered authorized'. "\n";
	$sql = "SELECT uid,password,firstname, lastname, countries FROM members WHERE username = '$username' LIMIT 1";
	$debug .= $sql. "\n";
	$query = $conn->query($sql);
	$content = $query->fetch_array();
	$c = $content;
	$hash = $c['password'];
	if (password_verify($password, $hash)) {
		$userId = $c['uid'];
		$expiration = time() + 360000;
		$issuer = 'create.myfriends.network';
		$token = Token::create($userId, $secret, $expiration, $issuer);
		$debug .= '$token'. "\n";
		$debug .= $token. "\n";
		$content['password'] = null;
		$content[1] = null;
		$out['content'] = $content;
		$out['token'] = $token;
		$debug .= 'authorized' . "\n";
	}
	else {
		$debug .= 'NOT authorized' . "\n";
	}
}
// verify that authorized
if($action != 'authorize'){
	$ok = false;
	if ($token){
		$ok = Token::validate($token, $secret);
	}
	if ($ok){
		$debug .= 'authorized' . "\n";
	}
	else{
		$debug .= 'NOT authorized' . "\n";
	}
	
}

if ($ok){
	$debug .= '$action is '  . $action . "\n";
	
	if (substr($action, 0,6) == 'create'){
		$debug .= 'calling create.inc' . "\n";
		$include = '/home/vx5ui10wb4ln/public_html/create/create.php';
		require $include;
		$out = $action ($_POST, $root, $conn);
	}
	if (substr($action, 0,3) == 'get'){
		$debug .= 'calling get.inc' . "\n";
		$include = '/home/vx5ui10wb4ln/public_html/create/get.php';
		require $include;
		$out = $action ($_POST, $root);
	}
	if(substr($action, 0,9) == 'prototype'){
		$include = '/home/vx5ui10wb4ln/public_html/create/prototype.php';
		require $include;
		$debug .= 'before prototype' . "\n";
		$out= $action ($_POST, $root, $conn);
		$debug .= $out['debug'];
		$out['debug'] = '';
		$debug .= 'after prototype' . "\n";
	}
	if( $page == 'publish'){
		$include = '/home/vx5ui10wb4ln/public_html/create/'. $_GET['page'] . '.php';
		require $include;
		$out= $action ($recnum, $my_uid, $root, $conn);
	}
	if (substr($action, 0,5) == 'setup'){
		$debug .= 'calling setup.inc' . "\n";
		$include = '/home/vx5ui10wb4ln/public_html/create/setup.php';
		require $include;
		$out = $action ($_POST, $root);
	}
	if (substr($action, 0,8) == 'transfer'){
		$debug .= 'calling transfer.inc' . "\n";
		$include = '/home/vx5ui10wb4ln/public_html/create/transfer.php';
		require $include;
		$out = $action ($_POST, $root);
	}
	if (isset($out['debug'])){
		$debug .= $out['debug'];
	}
	if ($action == 'folders'){
		$debug .= 'in folders' . "\n";
		$directory = $root . 'content/'. $country_code .'/'. $language_iso ;
		$debug .= $directory . "\n";
		$out['content'] = folders($directory);
	}
	// https://serversideup.net/uploading-files-vuejs-axios/
	//https://itsolutionstuff.com/post/file-upload-using-vue-js-axios-phpexample.html
	if($action == 'storeImage') {
		$debug .= 'in storeImage' . "\n";
		switch ($_FILES['file']['type']){
			case 'image/jpeg':
			   $type = '.jpg';
			   $valid = true;
			   break;
			case 'image/png':
			   $type = '.png';
			   $valid = true;
			   break;
			case 'image/gif':
			   $type = '.gif';
			   $valid = true;
			   break;
			default:
				$valid = false;
		}
		if ($valid){
			if (!strpos($name, $type)){
				$name .= $type;
			}
			$fname = $root . $directory .'/'. $name;

			if (move_uploaded_file($_FILES["file"]["tmp_name"], $fname)) {
				$out['error'] = false;
				$out['message'] = "Image Saved";
				$debug .="Image Saved to ". $fname.  "\n";
			}
			else{
				$out['error'] = true;
				$out['message'] = "Image NOT Saved ";
				$debug .="Image NOT Saved to " . $fname.  "\n";
			}
		}
		else{
			$out['error'] = true;
			$out['message'] = "Image not in proper form";
		}
		
	}
	if ($action == 'registerUser'){
		$debug .= 'in registerUser' . "\n";
		if (isset($authorizer)){
			$sql = "SELECT countries FROM members WHERE uid = '$authorizer' LIMIT 1";
			$debug .= $sql. "\n";
			$query = $conn->query($sql);
			$check = $query->fetch_array();
			if ($check['countries'] == '*' ){
				$sql = "SELECT uid FROM members WHERE username = '$username' LIMIT 1";
				$debug .= $sql. "\n";
				$query = $conn->query($sql);
				$content = $query->fetch_array();
				if (!$content){
					$hash = password_hash($password, PASSWORD_DEFAULT);
					
					$sql = "INSERT INTO members ( username, password,firstname, lastname, countries) VALUES
						 ('$username', '$hash', '$firstname', '$lastname', '$countries')";
					$debug .= $sql. "\n";
					$query = $conn->query($sql);
					$out['content'] = 'registered';
					$out['error'] = false;
				}
				else{
					$out['message'] = "Username already in use";
					$out['error'] = true;
				}
			}
		}
		else{
			$out['message'] = "NOt Registered";
			$out['error'] = true;
		}
	}
}

$conn->close();
$debug .= "\nChecking for numbered items\n\n";
// get rid of numbered array items
if (isset($out['content'])){
	if (is_array($out['content'])){
		foreach ($out['content'] as $key => $value){
			$debug .= $key . "\n";
			if (is_numeric ($key)){
				unset ($out['content'][$key]);
			}
		}
	}
}
//$debug .= strlen(json_encode($out, JSON_UNESCAPED_UNICODE));
$debug .= "\n\nHERE IS JSON_ENCODE OF DATA\n";
$debug .= json_encode($out, JSON_UNESCAPED_UNICODE);

$fh = fopen('logs/' . $debug_filename, 'w');
fwrite($fh, $debug);
fclose($fh);
	
//https://www.html5rocks.com/en/tutorials/cors/
//https://stackoverflow.com/questions/9631155/specify-multiple-subdomains-with-access-control-origin/9737907

if(isset($_SERVER['HTTP_ORIGIN'])) {
  $origin = $_SERVER['HTTP_ORIGIN'];
   if($origin == 'http://edit.myfriends.network' OR $origin == 'https://edit.myfriends.network' OR $origin == 'http://192.168.56.1:8080' OR $origin == 'http://prototype.hereslife.info') {
    header("Access-Control-Allow-Origin: $origin");
  }
}

header("Content-type: application/json");
echo json_encode($out, JSON_UNESCAPED_UNICODE);
die();




function copy_global($source, $destination){
	$out = array();
	
	if (file_exists($source)){
		$out['debug'] = 'Source exists: '. $source . "\n";
		$handler = opendir ($source);
		while ($mfile = readdir ($handler)){
			if ($mfile != '.' && $mfile != '..' ){
				$setup_file = $source . $mfile;
				if (!is_dir($setup_file)){
					$newfile = str_replace('GLOBAL', '', $mfile);
					$destination_file = $destination . $newfile;
					$out['debug'] .= 'Destination File: '. $destination_file . "\n";
					if (!file_exists($destination_file)){
						$out['debug'] .= 'Does not exist'. "\n";
						if (!is_dir($destination_file)){
								$out['debug'] .= 'Is not directory: ' . "\n";
							if (strpos($setup_file, '.') !== FALSE){
								$out['debug'] .= 'Has a dot: ' . "\n";
								copy ($setup_file, $destination_file);
								$out['debug'] .= $setup_file . ' to ' . $destination_file . "\n";
							}
						}
					}
					else{
						$out['debug'] = 'Destination exists: '. $destination_file . "\n";
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
		closedir ($handler);//
		if (strlen($results) > 1){
			$results = substr($results,0, -1) . ']';
		}
		else{
			$results = null;
		}
	}
 return $results;
}
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

 
?>