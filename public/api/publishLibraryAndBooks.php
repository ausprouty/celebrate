<?php
require_once ('prototypeORpublish.php');
require_once('publishLibrary.php');
require_once('publishSeriesAndChapters.php');

function publishLibraryAndBooks($p){
    /* Prototype Library and receive an array of book objects
    */
    $p['debug'] .= "\n\n publishLibraryAndBooks\n";
    $p['debug'] .= json_encode($p) . "\n";
    $p = publishLibrary($p);
    $p['debug'] .= "\n\n Books Parameter AFTER publishtypeLibrary\n";
    $p['debug'] .= json_encode($p['books']) . "\n";
    $count = 0;
    foreach ($p['books'] as $book){
        $count++;
        $p['debug'] .= "count is $count" . "\n";
       
        if ($book->format == 'series'){
            //deal with legacy dagta
            if (isset($book->code)){
                $code = $book->code;
            }
            else if (isset($book->name)){
                $code = $book->name;
            }
            $sql = "SELECT recnum FROM content 
                WHERE  country_code = '" . $p['country_code']. "'  
                AND language_iso = '". $p['language_iso'] ."' 
                AND folder_name = '". $code ."' AND filename = 'index'
                AND prototype_date IS NOT NULL 
                ORDER BY recnum DESC LIMIT 1";
            //$p['debug'] .= $sql . "\n";
             $data = sqlArray($sql); 
             $p['recnum'] = isset($data['recnum']) ? $data['recnum'] : null;
             if ($p['recnum']){
                $p['folder_name'] = $code;
                $out = publishSeriesAndChapters($p);
             }
        }
        if ($book->format == 'page'){
            $sql = "SELECT recnum FROM content 
            WHERE  country_code = '" . $p['country_code']. "'  
            AND language_iso = '". $p['language_iso'] ."' 
            AND folder_name = 'pages' AND filename = '". $book->code . "'
            AND prototype_date IS NOT NULL 
            ORDER BY recnum DESC LIMIT 1";
         $data = sqlArray($sql); 
         $p['recnum'] = isset($data['recnum']) ? $data['recnum'] : null;
         if ($p['recnum']){
             $p['library_code'] = $book->library_code;
             $p = publishPage($p);
         }
        }
        
    }
    return $p;
}