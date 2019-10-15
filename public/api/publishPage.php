<?php

require_once ('prototypeORpublish.php');
require_once('createPage.php');
require_once('prototypeFindFilesInPage.php');

function publishPage ($p){
    if (!isset($p['recnum'])){
        $p['debug'] .= 'FATAL ERROR IN PROTOTYPE PAGE.  No recnum' . "\n";
        return $p;
    }
    
    if (!$p['debug']){
        $p['debug'] = null;
    }
   // can you find record in database?
   if (isset($p['recnum'])) {
        $sql = 'SELECT * FROM content 
            WHERE  recnum  = '. $p['recnum'];
        //$p['debug'] .= $sql. "\n";
        $data = sqlArray($sql);
    }
    else{
        $p['debug'] .= 'FATAL ERROR. No recnum in PrototypPage'. "\n";
        return $p;
    }
    //
    // create page
    //
    $result = createPage($p, $data);
    $p = $result['p'];
    $text = $result['text'];
    //
    //find files in page for series json file
    //
    $result  = prototypeFindFilesInPage($text);
    $p['files_in_page'] = isset($result['files_in_page']) ? $result['files_in_page'] : [];
    $p['files_in_page'] = array_merge($p['files_in_page'], $result['files_in_page']);
   
    if (isset($result['message'])){
        $p['debug'] .= $result['message'];
    }
    // get bookmark
    $b['recnum'] =  $p['recnum'];
    $b['library_code'] = $p['library_code'];
    $bm = bookmark($b);   
    $bookmark = $bm['content'];
    $selected_css = isset($bookmark['book']->style)? $bookmark['book']->style: STANDARD_CSS;
   
   
    
    // write file
    
    $series_dir = ROOT_PUBLISH_CONTENT.  $data['country_code'] .'/'. 
        $data['language_iso'] .'/'. $data['folder_name'] .'/';
    $fname = $series_dir . $data['filename'] .'.html';
    publishFiles( 'publish', $p, $fname, $text,  STANDARD_CSS, $selected_css);
    //
    // update records
    //
    $time = time();
    $sql = "UPDATE content 
        SET publish_date = '$time', publish_uid = '". $p['my_uid']. "' 
        WHERE  country_code = '". $data['country_code'] ."' AND  
        language_iso = '" . $data['language_iso'] ."' 
        AND folder_name = '" . $data['folder_name'] ."' 
         AND filename = '". $data['filename'] . "' 
        AND publish_date IS NULL";
    //$p['debug'] .= $sql. "\n";
    sqlArray($sql, 'update');
    return $p;
}