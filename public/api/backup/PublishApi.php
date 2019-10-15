<?php
// with help from https://github.com/RobDWaller/ReallySimpleJWT
require_once ('vendor/autoload.php');
use ReallySimpleJWT\Token;
$secret = 'sec!ReT423*&';
$content_dir = '../prototype/content/';
$publish_dir = '../test/content';


$token = $_POST['token'];
$ok = false;
if ($token){
	$ok = Token::validate($token, $secret);
}
$debug = 'This is Publish Api'. "\n";
$debug_filename = $_GET['action'];
$out = array('error' => false);
if ($ok){
	$debug .= 'Authorized for ' . $_GET['action'] . "\n";
	$debug .= 'Rccnum: ' . $_POST['recnum'] . "\n";
	$recnum = $_POST['recnum'];
	
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
	// get content of lastest record
	$sql = "select * from content 
		WHERE recnum = $recnum
		ORDER BY recnum DESC LIMIT 1";
	$debug .= $sql . "\n";
	$query = $conn->query($sql);
	$content = $query->fetch_array();
	$debug .= 'Text: ' .$content['text'] . "\n";
	// set filename
	switch($_GET['action']){
		case 'publishCountries':
			// get Countries Template
			$filename = $publish_dir . 'index.html';
			$countries_template = file_get_contents($template_dir . 'countries.html');
			$this_template = str_replace('{{version}}', $version, $countries_template);
			// add Country Templates
			$country_template = file_get_contents($template_dir . 'country.html');
			$markers = array('{{link}}', '{{country.image}}','{{country.name}}','{{country.english}}' );
			$insert = '';
			$countries = json_decode($content['text']);
			foreach ($countries as $country){
				if ($country['publish'] == true){
					$link = '/content/'. $country['code'] . '/index.html';
					$image = '/images/country/'. $country['image'];
					$values = array($link, $image, $country['name'], $country['english']);
					$insert .= str_replace($markers, $values, $country_template);
				}
			}
			$this_template = str_replace('[[countries]]', $insert, $this_template);
			
			break;
		case 'publishLanguage':
			$filename =  $publish_dir . $content['country_iso'] . '/index.html';
			$languages_template = file_get_contents($template_dir . 'languages.html');
			$this_template = str_replace('{{version}}', $version, $languages_template);
			$language_template = file_get_contents($template_dir . 'language.html');
			$markers = array('{{link}}', '{{language.name}}');
			$insert = '';
			$languages = json_decode($content['text']);
			foreach (languages as $language){
				if ($language['publish'] == true){
					$link = '/content/'. $language['folder'] ;
					$values = array($link,  $language['name']);
					$insert .= str_replace($markers, $values, $language_template);
				}
			}
			$this_template = str_replace('[[languages]]', $insert, $this_template);
			
			break;
		case 'publishLibrary':
			$filename = $publish_dir .   $content['country_iso'] . '/'.  $content['language_iso']. '/index.html';
			// make Library Template
			$library_template = file_get_contents($template_dir . 'library.html');
			$link = 'content/' . $content['country_iso'] . '/'. $content['language_iso'] .'/index.html';
			$markers = array('{{link}}', '{{library.image}}','{{version}}');
			$values  = array( $link, '/images/library.png', $version);
			$this_template = str_replace('{{version}}', $version, $library_template);
			// add Books 
			$book_template = file_get_contents($template_dir . 'book.html');
			$markers = array('{{link}}', '{{book.image}}','{{book.title}}');
			$insert = '';
			$books = json_decode($content['text']);
			foreach ($books as $book){
				if ($book['publish'] == true){
					$link =  $book['folder'] . '/' . addHTML($book['index']);
					$image = $bookmark->language->image_dir . '/'. $book['image'];
					$title = $book['title'];
					$values = array($link, $image, $title);
					$insert .= str_replace($markers, $values, $country_template);
				}
			}
			$this_template = str_replace('[[books]]', $insert, $this_template);
			break;
		case 'publishSeries':
			$filename = $publish_dir .  $content['country_iso'] . '/'.  $content['language_iso']. '/' . $content['folder'] . '/' . addHTML($content['filename']);
			$series = json_decode($content['text']);
			// make Series Template
			$series_template = file_get_contents($template_dir . 'series.html');
			$markers = array('{{dir}}, {{book.style}}, {{link}}', '{{book.image}}','{{book.title}}','{{book.description }}','{{version}}');
			$dir = $bookmark->language->rldir;
			$style = $bookmark->book->style;
			$link = 'content/' . $content['country_iso'] . '/'.$content['language_iso'];
			$image = $bookmark->language->image_dir .'/'. $bookmark->book->image;
			$title = $bookmark->book->title;
			$description = $series['title'];
			$values  = array( $dir, $style, $link, $image, $title, $description, $version);
			$this_template = str_replace('{{version}}', $version, $library_template);
			// add Chapters 
			$chapter_template = file_get_contents($template_dir . 'chapter.html');
			$markers = array('{{link}}', '{{chapter.title}}', '{{chapter.description}}');
			$insert = '';
			foreach ($series['chapters'] as $chapter){
				if ($chapter['publish'] == true){
					$link =  $bookmark->language->folder . '/'.$bookmark->book->folder . '/' . addHTML($chapter['filename']);
					$title = $bookmark->book->title;
					if ($chapter['count']){
						$title = $chapter['count'] . '. '. $title;
					}
					$description = $chapter['description'];
					$values = array($link, $image, $title);
					$insert .= str_replace($markers, $values, $country_template);
				}
			}
			$this_template = str_replace('[[books]]', $insert, $this_template);
			break;
		case 'publishPage':
			$filename = $publish_dir .  $content['country_iso'] . '/' . $content['language_iso'] . '/' . $content['folder'] . '/' . addHTML($content['filename']);
			// make Page Template
			$page_template = file_get_contents($template_dir . 'page.html');
			$markers = array('{{dir}}', '{{book.style}}', '{{link}}', '{{book.image}}','{{book.title}}','{{page.title }}','{{page.text }}','{{version}}');
			$dir = $bookmark->language->rldir;
			$style = $bookmark->book->style;
			$link = 'content/' . $content['country_iso'] . '/' . $content['language_iso'] . '/' . $content['folder'] . '/' . addHTML($bookmark->book->index);
			$image = $bookmark->language->image_dir .'/'. $bookmark->book->image;
			$book_title = $bookmark->book->title;
			$page_title = $bookmark->page->title;
			$page_text = json_decode($content['text']);
			$values  = array( $dir, $style, $link, $image, $book_title, $page_title, $page_text, $version);
			$this_template = str_replace($markers, $values, $page_template);
			break;
		default:
			break;
	}
	//write file and  database in prototype

    $debug .=  "\n\n\n\n".'Filename: '. $filename . "\n";
	$success = writeFile($filename, $content['text']);
	if (!$success){
		$debug .= 'Not able to write file'. "\n";
	}
	if ($success){
		$debug .= 'Able to write file'. "\n";
		$debug .= updateDatabase($content, $conn);
	}
}
else{
	$debug .= 'NOT authorized for ' . $token . "\n";
}
$conn->close();
$debug .= "\n\nHERE IS JSON_ENCODE OF DATA\n";
$debug .= json_encode($out, JSON_UNESCAPED_UNICODE);
$debug_filename = $_GET['action'] . ".txt";
$fh = fopen('logs/' . $debug_filename, 'w');
fwrite($fh, $debug);
fclose($fh);


if(isset($_SERVER['HTTP_ORIGIN'])) {
  $origin = $_SERVER['HTTP_ORIGIN'];
    if($origin == 'http://edit.myfriends.network' OR $origin == 'https://edit.myfriends.network' OR $origin == 'http://192.168.56.1:8080' OR origin == 'http://prototype.hereslife.info') {
    header("Access-Control-Allow-Origin: $origin");
  }
}

header("Content-type: application/json");
echo json_encode($out, JSON_UNESCAPED_UNICODE);
die();

function addHTML($name){
	$name = str_replace('.json', '.html', $name);
	if (substr($name, -5) != '.html'){
		$name .= '.html';
	}
	return $name;
}

function updateDatabase($content, $conn){
	$debug = 'Entered UpdateDatabase'. "\n";
	//create variable names suitable to updating database
	foreach ($content as $param_name => $param_value) {
		$$param_name = $param_value;
		$debug .= $param_name . ' = ' . $param_value. "\n";
	}
	$debug .= "\n" . "\n". "\n";
	$publish_date = time();
	$publish_uid = $_POST['my_uid'];
	$sql = "update content SET publish_uid = $publish_uid,  publish_date = $publish_date
			WHERE country_iso = '$country_iso' AND language_iso =  '$language_iso'
			AND folder =  '$folder' AND filename =  '$filename'";
	$debug .= $sql . "\n";
	$query = $conn->query($sql);
	$debug .= ' Changed :' . $conn->affected_rows;
	return $debug;
}

function writeFile($filename, $text){
	$success = false;
	$fh = fopen($filename, 'w');
	if ($fh !== null && $text){
		$success = fwrite($fh, $text);
	}
	fclose($fh);
	
	return $success;
}

?>