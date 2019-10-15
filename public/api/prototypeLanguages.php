<?php
require_once ('prototypeORpublish.php');
require_once ('prototypeLanguagesAvailable.php');
require_once ('createLanguages.php');

function prototypeLanguages($p){
    $p['debug'] .= 'prototypeLanguages '. "\n";
    $selected_css = 'ZZ/styles/cardGLOBAL.css';
    $p['country_dir'] = ROOT_PROTOTYPE_CONTENT . $p['country_code'] . '/';
    // get footer
    $footer = prototypeLanguageFooter($p);
    //
    //find series data
    //
    $sql = "SELECT * FROM content 
        WHERE  country_code = '". $p['country_code'] ."' 
         AND filename = 'languages' 
        ORDER BY recnum DESC LIMIT 1";
    $p['debug'] .= $sql. "\n";
    $data = sqlArray($sql);
    //
    // create page
    //
    $result = createLanguages($p, $data);
    if (isset($result['body'])){
        $fname = $p['country_dir']. 'languages.html';
        $p['debug'] .= $fname. "\n";
        publishFiles( 'prototype', $p, $fname, $result['body'], STANDARD_CSS, STANDARD_CARD_CSS);  
        //
        // update records
        //
        $time = time();
        $sql = "UPDATE content 
            SET prototype_date = '$time', prototype_uid = '". $p['my_uid'] . "'
            WHERE country_code = '". $p['country_code']. "' 
            AND filename = 'languages'
            AND prototype_date IS NULL";
        //$p['debug'] .= $sql. "\n";
        sqlArray($sql,'update');

        // now update languages Available
        $p = prototypeLanguagesAvailable($p);
    }
    return $p;
}
