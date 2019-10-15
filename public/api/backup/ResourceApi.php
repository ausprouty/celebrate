<?php

if(!isset($_GET['resource'])){
	return;
}

$debug = 'post' . "\n";
$debug .= 'parameters:' . "\n";
 foreach ($_POST as $param_name => $param_value) {
    $$param_name = $param_value;
	$debug .= $param_name . ' = ' . $param_value. "\n";
}
$debug .= 'end of parameters' . "\n";
$debug .= 'finished post loop' . "\n";
 
$debug .= '$_GET[resource] = ' . $_GET['resource']. "\n";
$debug = '';
$root = '../prototype/';
$resource = $_GET['resource'];
$results = '';

if ($resource == 'images'){
	$directory = $root . 'images/library/'. $menu ;
	$debug .= $directory . "\n";
	$out['content'] = dirlist($directory);
}
if ($resource == 'menu'){
	$directory = $root . 'images/library/';
	$debug .= $directory . "\n";
	$out['content'] = dirlist($directory);
}



if(isset($_SERVER['HTTP_ORIGIN'])) {
  $origin = $_SERVER['HTTP_ORIGIN'];
  if($origin == 'http://edit.myfriends.network' OR $origin == 'https://edit.myfriends.network' OR $origin == 'http://192.168.56.1:8080' OR origin == 'http://prototype.hereslife.info') {
    header("Access-Control-Allow-Origin: $origin");
  }
}


$debug .= "\n\nHi\n";
$debug .= $out['content'];
$debug .= "\n\n\n";
$debug .= strlen(json_encode($out, JSON_UNESCAPED_UNICODE));
$debug .= "\n\nHERE IS JSON_ENCODE OF DATA\n";
$debug .= json_encode($out, JSON_UNESCAPED_UNICODE);
$filename = "resource.txt";
 $fh = fopen($filename, 'w');
	fwrite($fh, $debug);
	fclose($fh);



header("Content-type: application/json");
echo json_encode($out, JSON_UNESCAPED_UNICODE);
die();
 

function dirlist ($directory){
	$results = '';
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