<?php
require_once ('getLatestContent.php');
require_once ('sql.php');

$p = array();
$debug = 'Content API Post' . "\n";

$p['scope'] = $_GET['scope'];
$debug .= 'scope = ' . $p['scope'] . "\n";

$out = array();
$country_code = NULL;
$language_iso = NULL;
$library_code = NULL;
$folder_name = NULL;
$filetype = NULL;
$title = NULL;
$filename = NULL;
$text = NULL;


$debug .= 'parameters:' . "\n";
$conn = new mysqli(HOST, USER, PASS, DATABASE_CONTENT, DATABASE_PORT);
foreach ($_POST as $param_name => $param_value) {
    $$param_name =  $conn->real_escape_string($param_value);
    if ($$param_name == 'null'){
        $$param_name = NULL;
    }
    $debug .= $param_name . ' = ' . $param_value. "\n";
}

// route overrides any other parameters
if (isset($route)){
    $debug .= '$route is set'.  "\n";
    $debug .= $route.  "\n";
    $r = json_decode($route);
}
$p['country_code'] = isset($r['country_code']) ? $r['country_code'] : $country_code;
$p['language_iso'] = isset($r['language_iso'] )? $r['language_iso'] : $language_iso;
$p['library_code'] = isset($r['library_code']) ? $r['library_code'] : $library_code;
$p['folder_name'] = isset($r['folder_name']) ? $r['folder_name'] : $folder_name;
$p['filename'] = isset($r['filename']) ? $r['filename'] : $filename;

$out = getLatestContent($p);
if (isset($out['debug'])){
    $debug .= $out['debug'];
}
// many times $out['text'] was created by json_encode. 
// decode here so we can properly send it back in good form.
$ok =  json_decode($out['content']['text']);
if ($ok){
    $out['content']['text'] = $ok;
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
// create log file
$debug .= "\n\n\n";
$debug .= strlen(json_encode($out, JSON_UNESCAPED_UNICODE));
$debug .= "\n\nHERE IS JSON_ENCODE OF DATA\n";
$debug .= json_encode($out, JSON_UNESCAPED_UNICODE) . "\n";
$filename = "logs/ContentApi-" . $_GET['scope'] . ".txt";
$fh = fopen($filename, 'w');
	fwrite($fh, $debug);
	fclose($fh);
	
//https://www.html5rocks.com/en/tutorials/cors/
//https://stackoverflow.com/questions/9631155/specify-multiple-subdomains-with-access-control-origin/9737907

// authorize for CORS
if(isset($_SERVER['HTTP_ORIGIN'])) {
  $origin = $_SERVER['HTTP_ORIGIN'];
  if($origin == 'http://edit.myfriends.network' 
    OR $origin == 'https://edit.myfriends.network' 
    OR $origin == 'http://192.168.56.1:8080' 
    OR $origin == 'http://192.168.43.204:8080' 
    OR $origin == 'http://localhost:8080' 
    OR $origin == 'http://prototype.hereslife.info') {
    header("Access-Control-Allow-Origin: $origin");
  }
}

header("Content-type: application/json");
echo json_encode($out, JSON_UNESCAPED_UNICODE);
die();
 
 
?>