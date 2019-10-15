<?php

require_once ('prototypeORpublish.php');
require_once ('sql.php');

/* return latest content 
*/
function getLatestContent($p){
    $out = [];
    $out['debug'] ='In getLatestContent' . "\n";
    switch($p['scope']){
        case "countries":
            $out['debug'] .='Case is countries' . "\n";
            $sql = 'SELECT * FROM content 
                WHERE filename = "countries"
                ORDER BY recnum DESC LIMIT 1';
            break;
        case "languages":
        $out['debug'] .='Case is languages' . "\n";
            $sql = "SELECT * from content 
                WHERE country_code = '". $p['country_code'] . "'
                AND filename = 'languages' 
                AND folder_name = ''
                ORDER BY recnum DESC LIMIT 1";
            break;
        case "library":
            $out['debug'] .='Case is library' . "\n";
            $sql = "SELECT * from content 
                WHERE country_code = '". $p['country_code'] . "'
                AND language_iso = '" . $p['language_iso'] . "'
                AND folder_name = '' 
                AND filename = '" . $p['library_code'] . "'
                ORDER BY recnum DESC LIMIT 1";
            break;
        case "libraryNames":
            $out['debug'] .='Case is libraryNames' . "\n";
            $sql = "SELECT DISTINCT filename FROM content 
                WHERE country_code = '". $p['country_code'] . "'
                AND language_iso = '" . $p['language_iso'] . "'
                AND folder_name = '' 
                ORDER BY recnum DESC";
            break;
        case "libraryIndex":
            $out['debug'] .='Case is libraryIndex' . "\n";
            $sql = "SELECT * FROM content 
                WHERE country_code = '". $p['country_code'] . "'
                AND language_iso = '" . $p['language_iso'] . "'
                AND folder_name = '' 
                AND filename = 'index' 
                ORDER BY recnum DESC LIMIT 1";
            break;
        case "series":
            $out['debug'] .='Case is series' . "\n";
            $sql = "SELECT * from content 
                WHERE country_code = '". $p['country_code'] . "'
                AND language_iso = '" . $p['language_iso'] . "'
                AND folder_name  = '" . $p['folder_name'] . "'
                AND  filename = 'index'
                ORDER BY recnum DESC LIMIT 1";
            break;
        case "page":
            $out['debug'] .='Case is page' . "\n";
            $sql = "SELECT * from content 
                WHERE country_code = '". $p['country_code'] . "'
                AND language_iso = '" . $p['language_iso'] . "'
                AND folder_name = '" . $p['folder_name'] . "'
                AND  filename = '" . $p['filename'] . "'
                ORDER BY recnum DESC LIMIT 1";
            break;
        default:
            $sql = null;
            $out['debug'] .= "no match for  ". $p['scope'] . "\n";

    }
    $out['debug'] .= $sql . "\n";
    // execute query
    if ($sql){
        $out['content']= sqlArray($sql);
    }
    return $out;
}