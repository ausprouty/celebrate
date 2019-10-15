<?php

include_once('bookmark.php');

    
function _addHeader($p){
    $header = ROOT_EDIT. 'prototype/header.html';
    if (file_exists($header)){
        return file_get_contents ($header);
    }
    else{
        return '';
    }
}
function _addFooter($p){
    $footer = ROOT_EDIT. 'prototype/footer.html';
    if (file_exists($footer)){
        return file_get_contents ($footer);
    }
    else{
        return '';
    }
}
// $scope must be 'publish' or 'prototype'
function publishFiles( $scope , $p, $fname, $text, $standard_css, $selected_css){
    
    // start with header
    $output = _addHeader($p);
    //$p['debug'] .= "\n". 'publishFiles' . "\n";
    $out['debug'] = 'publishFiles : ' . $fname .  "\n";
    $placeholders = array(
        '{{ standard.css }}',
        '{{ selected.css }}', 
        '</html>',  
        '</body>');
    $replace = array( 
        $standard_css, 
        $selected_css, 
        '',
        '');
    $output = str_replace($placeholders, $replace,  $output);
    // insert text
    $output .= $text;
    // append footer
    $output .= _addFooter($p);
    // copy all images and styles to the prototype directory
    $response = prototypeCopyImagesAndStyles($output, $scope);
    if (isset($response['debug'])){
        $out['debug'] .= $response['debug'];
    }
    // make sure we have all the necessary directories
    dirMake($fname);
    // write the file
    $fh = fopen($fname, 'w');
    if ($fh){
        fwrite($fh, $output);
        fclose($fh);
    }
    else{
        $out['debug'] .= 'NOT able to write' .  $fname . "\n";
        $out['error'] = true;
    }
    return ($out);
}
function prototypeCopyDir($source, $destination){
    if (!file_exists($destination)){
        dirMake ($destination); 
    }
    copy_global($source, $destination);
    return $out;
}
// requires $p['recnum'] and $p['library_code']
function prototypeLanguageFooter($p){
    // get bookmark
    $b['recnum'] = $p['recnum'];
    $b['library_code'] = isset($p['library_code'])?$p['library_code']:'library';
    $bm = bookmark($b);
    $bookmark = $bm['content'];
    $p['debug'] .= isset($bm['debug'])? $bm['debug']:null;
    //
    $bookmark['country'] = $bookmark['country'];
    $url = isset($bookmark['country']->url) ?  $bookmark['country']->url: 'https://myfriends.life';
    $website = isset($bookmark['country']->website) ? $bookmark['country']->website : 'www.myfriends.life';
    if (!isset($p['debug'])){
        $p['debug'] = '';
    }
    if (!isset($p['language_iso'])){
        $p['language_iso'] = '';
    }
    $footer  = null;
    $p['debug'] .= 'Looking for Language Footer'. "\n";
    $sql = "SELECT * FROM content 
        WHERE  country_code = '". $p['country_code'] ."' 
        AND  language_iso = '". $p['language_iso'] ."' 
        AND folder_name = ''  AND filename = 'index' 
        ORDER BY recnum DESC LIMIT 1";
    $p['debug'] .= $sql. "\n";
    $data = sqlArray($sql);
    if ($data){
        $text = json_decode($data['text']);
        $footer  = isset($text->footer) ? $text->footer : '';
    }
    if (!$footer ){
        $footer  =  file_get_contents(ROOT_EDIT. 'prototype/languageFooter.html');
    }
    $placeholders = array(
        '{{ url }}', '{{ website }}'
    );
    $values = array(
        $url,
        $website
    );
    $footer  = str_replace( $placeholders, $values, $footer ) ;
    
   // $p['debug'] .=  'Country Footer:' . "\n"  .$footer  . "\n";
  //  $fh = fopen('logs/prototypeLanguageFooter' .   time(). '.txt', 'w');
   // fwrite($fh, $p['debug']);
   // fclose($fh);
//
    return $footer;
}

function prototypeCopyImagesAndStyles($text, $scope){
    $source_dir = ROOT_EDIT;
    switch ($scope){
        case 'prototype':
            $destination_dir = ROOT_PROTOTYPE;
            break;
        case 'publish':
            $destination_dir = ROOT_PUBLISH;
            break;
        default:
            return;
    }
    $out = [];
    $out['message'] = null;
    $out['debug'] = 'prototypeCopyImagesAndStyles' . "\n";
    $out['debug'] = $scope . "\n";
    $out['debug'] .= $text . "\n\n";
   
    $find_begin = '"/content/';
    $find_end = '"';
    if (strpos($text, $find_begin)!== false){
        //$p['debug'] .= "Images found\n";
        while (strpos($text, $find_begin) !== false){
            $pos_begin = strpos($text, $find_begin);
            $text = substr($text, $pos_begin);
            $pos_end = strpos($text, $find_end, 2) -1;
            $filename = substr($text, 1, $pos_end);
            $from = $source_dir. $filename;
            $out['debug'] .= $from . "\n";
            $to = $destination_dir. $filename;
            if (file_exists($from)){
                _prototypeCreateDirectory($to);
                // do not copy html files or you will overwrite current index page
                if (!is_dir($from) && strpos ($to, '.html') === false){
                    copy ($from, $to );
                    $out['debug'] .= ' copied ' . $from . ' to '. $to . "\n";
                }
            }
            else{
                
                $out['message'] .= "$from not found in prototypeCopyImagesAndStyles \n";
                $out['error'] = true;

            }
            
            $text = substr($text, $pos_end);
           
        }
    }
    else{
        
        $out['message'] .= "no images found\n";
        $out['error'] = true;

    }
    $fh = fopen('logs/prototypeCopyImagesAndStyles.txt', 'w');
    fwrite($fh, $out['debug']);
    fclose($fh);
    return $out;
    
}
/*  creates directories for copying files
*/

function _prototypeCreateDirectory($dir){
    $out = null;
    $parts = explode('/', $dir);
    $path = null;
    foreach ($parts as $part){
        $path .= $part .'/';
        if (strpos ($part, '.') === false){
            if (!file_exists($path)){
                mkdir($path);
            }
        }
    }
    
    return $out;
}