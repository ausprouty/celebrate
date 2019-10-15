<?php
// connect to database
define("HOST", "localhost");
define("USER", "journey2018");
define("PASS", "ugWwRPb5ljRFeubJ");
define("DATABASE", "new_journey");

$conn = new mysqli(HOST, USER, PASS, DATABASE);
//$conn = new mysqli("localhost", "vuejs", "ViewJs2019", "vuejs");
if ($conn->connect_error) {
    die("Connection has failed: " . $conn->connect_error);
}
$out = array('error' => false);
// initialize all variables in case not set
$version= '';
$edit_date= NULL;
$edit_uid= NULL;

$languageISO = NULL;
$countryCODE = NULL;
$libraryCODE = NULL;
$folderNAME = NULL;
$filetype = NULL;
$title = NULL;
$fileNAME = NULL;
$text = NULL;
 
$debug = 'post' . "\n";
$debug .= 'parameters:' . "\n";
 foreach ($_POST as $param_name => $param_value) {
	$$param_name =  $conn->real_escape_string($param_value);
	if ($$param_name == 'null'){
		$$param_name = NULL;
	}
	$debug .= $param_name . ' = ' . $param_value. "\n";
}
$debug .= 'end of parameters' . "\n";
$version = '1.02';
$debug .= 'finished post loop' . "\n";
 
$crud = 'read';
$debug .= '$_GET[crud] = ' . $_GET['crud']. "\n";
if(isset($_GET['crud'])){
	$crud = $_GET['crud'];
}
 $debug .= 'GET = ' . $crud. "\n";
 $debug .= "\n\nHi\n";
 


if($crud == 'countries'){
	$debug .= 'entered countries'. "\n";
	$sql = "SELECT * FROM content 
		WHERE filename = 'countries'
		ORDER BY recnum DESC LIMIT 1";
	$debug .= $sql. "\n";
	$query = $conn->query($sql);
	if ($query){
		$content = $query->fetch_array();
		$out['content'] = $content;
	}
}
if($crud == 'country'){
	$debug .= 'entered country'. "\n";
	$sql = "SELECT * FROM content 
		WHERE  country_iso = '$countryCODE' AND language_iso = '$languageISO' AND filename = 'index' 
		ORDER BY recnum DESC LIMIT 1";
	$debug .= $sql. "\n";
	$query = $conn->query($sql);
	if ($query){
		$content = $query->fetch_array();
		$out['content'] = $content;
	}
}


if($crud == 'languages'){
	$debug .= 'entered languages'. "\n";
	$sql = "SELECT * from content 
		WHERE country_iso = '$countryCODE' AND filename = 'languages' 
		ORDER BY recnum DESC LIMIT 1";
	$debug .= $sql . "\n";
	$query = $conn->query($sql);
	if ($query){
		$content = $query->fetch_array();
		$out['content'] = $content;
	}
}
if($crud == 'library'){
	$sql = "SELECT * from content 
		WHERE country_iso = '$countryCODE' AND language_iso = '$languageISO' AND filename = '$libraryCODE' 
		ORDER BY recnum DESC LIMIT 1";
	$debug .= $sql . "\n";
	$query = $conn->query($sql);
	if ($query){
		$content = $query->fetch_array();
		$out['content'] = $content;
	}
}
if($crud == 'series'){
	if (strpos($fileNAME, '.json')){
		$fileNAME = substr($fileNAME, 0, -5);
	}
	$debug .= "I am in Series" . "\n";
	$sql = "SELECT * from content 
		WHERE country_iso = '$countryCODE' AND language_iso = '$languageISO'  AND folder = '$folderNAME' AND  filename = 'index'
		ORDER BY recnum DESC LIMIT 1";
	$debug .= $sql . "\n";
	
	$query = $conn->query($sql);
	if ($query){
		$content = $query->fetch_array();
		if ($content){
			foreach ($content as $key => $value){
				$debug .= $key   . "\n";
				$debug .= $value   . "\n\n\n";
			}
		}
		$out['content'] = $content;
	}
}

if($crud == 'page'){
	$sql = "SELECT * from content 
		WHERE country_iso = '$countryCODE' AND language_iso = '$languageISO'  AND folder = '$folderNAME' AND  filename = '$fileNAME' 
		ORDER BY recnum DESC LIMIT 1";
	$debug .= $sql . "\n";
	$query = $conn->query($sql);
	if ($query){
		$content = $query->fetch_array();
		$out['content'] = $content;
	}
}

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
 
$conn->close();
$debug .= "\n\nHi\n";
$debug .= "\n\n\n";
$debug .= strlen(json_encode($out, JSON_UNESCAPED_UNICODE));
$debug .= "\n\nHERE IS JSON_ENCODE OF DATA\n";
$debug .= json_encode($out, JSON_UNESCAPED_UNICODE);
$filename = "logs/ContentApi.txt";
 $fh = fopen($filename, 'w');
	fwrite($fh, $debug);
	fclose($fh);
	
//https://www.html5rocks.com/en/tutorials/cors/
//https://stackoverflow.com/questions/9631155/specify-multiple-subdomains-with-access-control-origin/9737907

if(isset($_SERVER['HTTP_ORIGIN'])) {
  $origin = $_SERVER['HTTP_ORIGIN'];
  if($origin == 'http://edit.myfriends.network' OR $origin == 'https://edit.myfriends.network' OR $origin == 'http://192.168.56.1:8080' OR origin == 'http://prototype.hereslife.info') {
    header("Access-Control-Allow-Origin: $origin");
  }
}

header("Content-type: application/json");
echo json_encode($out, JSON_UNESCAPED_UNICODE);
die();
 
 
?>