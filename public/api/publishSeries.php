<?php

require_once ('prototypeORpublish.php');
require_once ('createSeries.php');

// returns $p[files_json] for use by prototypeSeriesandChapters
function publishSeries ($p){
    if (!isset($p['debug'])){
        $p['debug'] = null;
    }
    //
    //find series data
    //
    $sql = "SELECT * FROM content 
        WHERE  country_code = '". $p['country_code'] ."' 
        AND  language_iso = '". $p['language_iso'] ."' 
        AND folder_name = '" .$p['folder_name'] ."'  AND filename = 'index' 
        AND prototype_date IS NOT NULL
        ORDER BY recnum DESC LIMIT 1";
   // $p['debug'] .= $sql. "\n";
    $data = sqlArray($sql);
    //$p['debug'] .= $data['text'] . "\n"; 
    $text = json_decode($data['text']);
    if ($text){
        // create Series
        $result = createSeries($p, $data);
        $p = $result['p'];
        if ($result['text']){
              // find css
              $b['recnum'] = $p['recnum'];
              $b['library_code'] = $p['library_code'];
              $bm = bookmark($b);
              $bookmark = $bm['content'];
              $selected_css = isset($bookmark['book']->style) ? $bookmark['book']->style :STANDARD_CSS ;
              //
            $dir = ROOT_PUBLISH_CONTENT.  $p['country_code'] .'/'. $p['language_iso'] .'/'. $p['folder_name'] .'/';
            $fname = $dir . 'index.html';
            publishFiles( 'publish', $p, $fname, $result['text'],  STANDARD_CSS, $selected_css);
            $time = time();
            $sql = "UPDATE content 
                SET publish_date = '$time', publish_uid = '". $p['my_uid']. "' 
                WHERE  country_code = '". $p['country_code'] ."' AND  
                language_iso = '" . $p['language_iso'] ."' 
                AND folder_name = '" . $p['folder_name'] ."'  AND filename = 'index' 
                AND prototype_date IS NOT NULL
                AND publish_date IS NULL";
            //$p['debug'] .= $sql. "\n";
            sqlArray($sql, 'update');
        }
    }
    else{
        $p['debug'] .= 'No text found for the above query '.  "\n";
    
    }
    return $p;
}
