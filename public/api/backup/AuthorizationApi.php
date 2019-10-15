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

 
$debug = 'post' . "\n";
$debug .= 'parameters:' . "\n";
 foreach ($_POST as $param_name => $param_value) {
    $$param_name = $param_value;
	$debug .= $param_name . ' = ' . $param_value. "\n";
}
$debug .= 'end of parameters' . "\n";
$debug .= 'finished post loop' . "\n";
 
$debug .= '$_GET[crud] = ' . $_GET['crud']. "\n";
$crud = 'deny';
if(isset($_GET['crud'])){
	$crud = $_GET['crud'];
}
 $debug .= 'GET = ' . $crud. "\n";
 $debug .= "\n\nHi\n";
 
if($crud == 'authorize'){
	$debug .= 'entered authorized'. "\n";
	$sql = "SELECT country FROM members WHERE userid = '$uid' AND password = '$pass' LIMIT 1";
	$debug .= $sql. "\n";
	$query = $conn->query($sql);
	$content = $query->fetch_array();
	$out['content'] = $content;
}



 
$conn->close();
$debug .= "\n\nHi\n";
$debug .= "\n\n\n";
$debug .= strlen(json_encode($out, JSON_UNESCAPED_UNICODE));
$debug .= "\n\nHERE IS JSON_ENCODE OF DATA\n";
$debug .= json_encode($out, JSON_UNESCAPED_UNICODE);
$filename = "authorize.txt";
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