<?php
require_once ('prototypeORpublish.php');
require_once('prototypeLibrary.php');
require_once('prototypeSeriesAndChapters.php');

function prototypeLibraryAndBooks($p){
    /* Prototype Library and receive an array of book objects
    */
    $p['debug'] .= "\n\n prototypeLibraryAndBooks\n";
    $p['debug'] .= json_encode($p) . "\n";
    $p = prototypeLibrary($p);
    $p['debug'] .= "\n\n Books Parameter AFTER prototypeLibrary\n";
    $p['debug'] .= json_encode($p['books']) . "\n";
    $count = 0;
    foreach ($p['books'] as $book){
        $count++;
        $p['debug'] .= "count is $count" . "\n";
        //deal with legacy dagta
        if (isset($book->code)){
            $code = $book->code;
        }
        else if (isset($book->name)){
            $code = $book->name;
        }
        if ($book->format == 'series'){
            
            $sql = "SELECT recnum FROM content 
                WHERE  country_code = '" . $p['country_code']. "'  
                AND language_iso = '". $p['language_iso'] ."' 
                AND folder_name = '". $code ."' AND filename = 'index' 
                ORDER BY recnum DESC LIMIT 1";
            //$p['debug'] .= $sql . "\n";
             $data = sqlArray($sql); 
             $p['recnum'] = isset($data['recnum']) ? $data['recnum'] : null;
             if ($p['recnum']){
                $p['folder_name'] = $code;
                //$p['debug'] .= "\n\n Parameters for prototypeSeriesAndChapters\n";
               // $p['debug'] .= json_encode($p) . "\n";
                $out = prototypeSeriesAndChapters($p);
                //$p['debug'] .= $out['debug'];
                //$p['debug'] .= "\n\n Parameters AFTER prototypeSeriesAndChapters\n";
               // $p['debug'] .= json_encode($p) . "\n";
               //return $p;
               
             }
        }
        if ($book->format == 'page'){
            $sql = "SELECT recnum FROM content 
            WHERE  country_code = '" . $p['country_code']. "'  
            AND language_iso = '". $p['language_iso'] ."' 
            AND folder_name = 'pages' AND filename = '". $code . "' 
            ORDER BY recnum DESC LIMIT 1";
         $data = sqlArray($sql); 
         $p['recnum'] = isset($data['recnum']) ? $data['recnum'] : null;
         if ($p['recnum']){
             $p['library_code'] = $book->library_code;
             $p = prototypePage($p);
         }
        }
        
    }
    return $p;
}