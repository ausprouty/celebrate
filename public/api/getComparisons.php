<?php

function getComparisons($p){
    $out['debug'] = 'getFoldersContent'. "\n";
    $out['content']['countries'] = getCountries($p);
    $out['content']['languages'] = getLanguages($p);
    $out['content']['books'] = getBooks($p);
    $out['content']['chapters'] = getChapters($p);
    $out['content']['versions'] = getVersions($p);
    return $out;

}

function getCountries($p){
    $out = [];
    $output = [];
    $output['country'] = 'I did not find it';
    $sql = 'SELECT * FROM content  
        WHERE  filename = "countries"
        ORDER BY recnum DESC
        LIMIT 1';
    $data = sqlArray($sql);
    $countries = json_decode($data['text']);
    foreach ($countries as $country){
        if ($country->english){
            $name = $country->english;
        }
        else{
            $name = $country->name;
        }
        if ($country->code == $p['country_code'] ){
            $output['country'] = $name;
        }
        
      //  $details->country_code = $country->code;
      //  $details->country_name = $name;
        $out[$name] = (object) array('country_code' => $country->code, 'country_name' => $name);
    }
    asort($out);
    $output['countries'] = [];
    foreach ($out as $o){
        $output['countries'][] = $o;
    }
    return $output;
}
function getLanguages($p){
    $out = [];
    $output = [];
    $output['language'] = 'I did not find it';
    $sql = 'SELECT * FROM content  
        WHERE  filename = "languages"
        AND country_code ="' . $p['country_code'] . '"
        ORDER BY recnum DESC
        LIMIT 1';
    $data = sqlArray($sql);
    $text = json_decode($data['text']);
    foreach ($text->languages as $language){
        if ($language->iso == $p['language_iso'] ){
            $output['language'] = $language->name;
        }
        $output['languages'][] = (object) array('language_name' => $language->name, 'language_iso' => $language->iso);
    }
    return $output;
}
function getBooks($p){
    $out = [];
    $output = [];
    $output['book'] = 'I did not find it';
    // what libraries do we have?
    $sql = 'SELECT DISTINCT filename FROM content  
        WHERE  country_code ="' . $p['country_code'] . '"
        AND language_iso = "' . $p['language_iso'] . '"
        AND folder_name = ""';
    $query = sqlMany($sql);
    while($library = $query->fetch_array()){
        $sql = 'SELECT * FROM content  
            WHERE  country_code ="' . $p['country_code'] . '"
            AND language_iso = "' . $p['language_iso'] . '"
            AND filename = "' . $library['filename'] . '"
            AND folder_name = ""
            ORDER BY recnum DESC
            LIMIT 1';
        $data = sqlArray($sql);
        $text = json_decode($data['text']);
        if (isset($text->books)){
            foreach ($text->books as $book){
                if ($book->name == $p['folder_name'] ){
                    $output['book'] = $book->title;
                }
                $output['books'][] = (object) array('book_title' => $book->title, 'book_name' => $book->name);
            }
        }
    }
    return $output;
}

function getChapters($p){
    $out = [];
    $output = [];
    $output['chapter'] = 'I did not find it';
    $sql = 'SELECT * FROM content  
        WHERE  country_code ="' . $p['country_code'] . '"
        AND language_iso = "' . $p['language_iso'] . '"
        AND folder_name =  "' . $p['folder_name'] . '"
        AND filename = "index"
        ORDER BY recnum DESC
        LIMIT 1';
    $data = sqlArray($sql);
    $text = json_decode($data['text']);
    $output['text'][] =  $text;
    if (isset($text->chapters)){
        foreach ($text->chapters as $chapter){
            $title = $chapter->count . '. '. $chapter->title;
            if ($chapter->filename == $p['filename'] ){
                $output['chapter'] = $title;
            }
            $output['chapters'][] = (object) array('chapter_title' => $title, 'chapter_filename' => $chapter->filename);
        }
    }
    return $output;
}
function getVersions($p){
    $out = [];
    $output = [];
    $sql = 'SELECT recnum, edit_date FROM content  
        WHERE  country_code ="' . $p['country_code'] . '"
        AND language_iso = "' . $p['language_iso'] . '"
        AND folder_name =  "' . $p['folder_name'] . '"
        AND filename = "' . $p['filename'] . '"
        ORDER BY recnum DESC';
    $query = sqlMany($sql);
    while($data = $query->fetch_array()){
        $title = date('Y-m-d H:i:s', $data['edit_date']);
        if (isset($p['recnum'])){
            if ($data['edit_date'] == $p['version'] ){
                $output['version'] = $title;
            }
        }
        else{
            if (!isset( $output['version'])){
                $output['version'] = $title;
            }
        }
        $output['versions'][] = (object) array('version_title' => $title, 'version_recnum' => $data['recnum']);
    }
    return $output;
}