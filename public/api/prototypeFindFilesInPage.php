<?php
/*
  I only want to list files that are in the edit directory and are not .html
*/

function  prototypeFindFilesInPage($text){
    $out['files_in_page'] = [];
    $find_begin = '"/content/';
    $find_end = '"';
    if (strpos($text, $find_begin)!== false){
        //$p['debug'] .= "Images found\n";
        while (strpos($text, $find_begin) !== false){
            $pos_begin = strpos($text, $find_begin);
            $text = substr($text, $pos_begin);
            $pos_end = strpos($text, $find_end, 2) -1;
            $filename = substr($text, 1, $pos_end);
            $mine = ROOT_EDIT . $filename;
            if (file_exists($mine)){
                if (!is_dir($mine) && strpos ($mine, '.html') === false){
                    $out['files_in_page'][$filename] = $filename;
                }
            }
            else{
                if (!isset($p['message'])){
                    $out['message'] = '';
                }
                $out['message'] .= "$mine not found in prototypeCopyImagesAndStyles \n";
                $out['error'] = true;

            }
            
            $text = substr($text, $pos_end);
           // $p['debug'] .= ' copied ' . $from . ' to '. $to . "\n";
        }
    }
    else{
        if (!isset($p['message'])){
            $out['message'] = '';
        }
        $out['message'] .= "no images found\n";
        $out['error'] = true;

    }
    return $out;
    
}