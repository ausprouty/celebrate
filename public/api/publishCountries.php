<?php
require_once ('prototypeORpublish.php');

/* This should only show countries which have been authorized for publishing.
   
   The link should take you to one of two locations:
      
    if more than one language is authorized for publishing:   CountryCode/languages.html 
    if only one language is authorized for publishing:  CountryCode/LanguageIso/index.html
*/
function publishCountries($p){
    // declare variables
    $selected_css = STANDARD_CARD_CSS;

    $p['debug'] = 'in publisheCountries' . "\n";
     //
    //find country page from recnum
    //
    $sql = 'SELECT * FROM content  
        WHERE  recnum = "'.  $p['recnum'] . '"';
    $p['debug'] .= $sql. "\n";
    $data = sqlArray($sql);
    if (!$data){return $p;}
    // 
    // create page
    //
    // get main template and do some replacing
    $main_template = file_get_contents(ROOT_EDIT .  'prototype/countries.html');
    $placeholders = '{{ version }}';
    $replace = $p['version'];
    $main_template = str_replace($placeholders, $replace, $main_template);
    // get sub template and do some replacing
    $sub_template = file_get_contents(ROOT_EDIT .  'prototype/country.html');
    $p['debug'] .=  $sub_template . "\n";
    $countries = json_decode($data['text']);
    $country_template = ''; 
    foreach ($countries as $country){
        if ($country->publish){
            $p['debug'] .=  $country->code . "\n";
            $image = '/images/country/' . $country->image;
            $link = '/content/'. publishCountryLink($country->code);
            $placeholders = ['{{ link }}', '{{ country.image }}','{{ country.name }}','{{ country.english }}'];
            $replace = [ $link, $image , $country->name , $country->english];
            $country_template .= str_replace($placeholders, $replace, $sub_template);
        }
    }
    // add sub template content
    $p['debug'] .=  $country_template . "\n";
    $main_template = str_replace('[[countries]]', $country_template, $main_template);
   
    // write countries file
    $fname = ROOT_PUBLISH_CONTENT .'index.html';
    publishFiles( 'publish', $p, $fname, $main_template,   STANDARD_CSS,  $selected_css);
    
   // $fname = ROOT_PUBLISH  .'index.html';
   // publishFiles( 'prototype', $p, $fname, $main_template,   STANDARD_CSS,  $selected_css);
    
    //
    // update records
    //
    $time = time();
    $sql = "UPDATE content 
        SET publish_date = '$time', publish_uid = '". $p['my_uid'] ."'
        WHERE  filename = 'countries'
        AND prototype_date IS NOT NULL
        AND publish_date IS NULL
        ";
    //$p['debug'] .= $sql. "\n";
    sqlArray($sql, 'update');
    return $p;
}

function publishCountryLink($country_code){
    $sql = "SELECT text FROM content 
        WHERE  country_code = '". $country_code ."' 
        AND filename = 'languages' 
        AND prototype_date IS NOT NULL
        ORDER BY recnum DESC LIMIT 1";
    $data = sqlArray($sql);
    $languages = json_decode($data['text']);
    $link = null;
    $count = 0;
    foreach ($languages->languages as $language){
        if ($language->publish == true){
            $link = $language->folder . '/index.html';
            $count++;
        }   
    }
    if ($count != 1){
        $link = $country_code . '/languages.html';
    }
    return $link;
}