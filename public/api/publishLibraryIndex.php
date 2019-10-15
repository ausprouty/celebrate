<?php

require_once ('prototypeORpublish.php');

function publishLibraryIndex($p){
    $p['debug'] = 'in prototypeLibraryIndex' . "\n";
    //$selected_css = '/content/AU/styles/AU-freeform.css';
     //
    //find country page from recnum
    //
    $sql = 'SELECT * FROM content  WHERE  recnum = "'.  $p['recnum'] . '"';
    //$p['debug'] .= $sql. "\n";
    $data = sqlArray($sql);
    if (!$data){return $p;}
    $text = json_decode($data['text']);
    $selected_css = $text->style;
    $footer = prototypeLanguageFooter($p);
    // replace placeholders
    $body = '<div class="content">'. "\n";
    $body .= $text->page . "\n";
    $body = str_replace('/preview/library', '/content', $body);
    $body = $body .  $footer  ;
    // set file name
    $language_dir = ROOT_PUBLISH_CONTENT . $p['country_code'] . '/'. $p['language_iso'];
    $fname = $language_dir . '/index.html';
    // write  file
    publishFiles( 'publish', $p, $fname, $body,   STANDARD_CSS,  $selected_css);
    // update records
    //
    $time = time();
    $sql = "UPDATE content 
        SET publish_date = '$time', publish_uid = '". $p['my_uid'] ."'
        WHERE  country_code = '" . $p['country_code'] ."' 
        AND folder_name = '' AND filename = 'index'
        AND prototype_date IS NOT NULL
        AND publish_date IS NULL";
    //$p['debug'] .= $sql. "\n";
    sqlArray($sql, 'update');
    return $p;
}