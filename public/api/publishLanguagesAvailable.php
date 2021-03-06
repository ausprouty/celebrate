<?php
require_once ('prototypeORpublish.php');

function publishLanguagesAvailable($p){
    $available = [];
    $p['debug'] .= "\n\n\n\n\n". ' publishLanguagesAvailable '. "\n";
    $selected_css = 'ZZ/styles/cardGLOBAL.css';
    $p['country_dir'] = ROOT_PUBLISH_CONTENT . $p['country_code'] . '/';
    $footer  = '';
    // flags
    $sql = "SELECT * FROM content 
                WHERE filename = 'countries'  
                AND publish_date != '' 
                ORDER BY recnum DESC LIMIT 1";
    $data = sqlArray($sql);
    $p['debug'] .= $sql . "\n";
    $p['debug'] .= 'Data for Country Flags' . "\n";
    $p['debug'] .= $data['text']. "\n\n";
    $countries_array = json_decode($data['text']);
   // $footer = prototypeLanguageFooter($p);
    // get main template
     $main_template = $book_template = file_get_contents(ROOT_EDIT .  'prototype/languagesAvailable.html');
    //
    //find prototype countries data
    //
    $sql = "SELECT distinct country_code FROM content 
        WHERE  publish_date != ''
        AND country_code != '' ";
    $query = sqlMany($sql);
    while($country = $query->fetch_array()){
        $p['debug'] .= ' Looking for published languages for: ' .$country['country_code']. "\n";
        // get published languages from each published country
        $sql = "SELECT * FROM content 
            WHERE  country_code = '". $country['country_code'] ."' 
            AND filename = 'languages'  AND publish_date != '' 
            ORDER BY recnum DESC LIMIT 1";
        $p['debug'] .= $sql. "\n";
        $data = sqlArray($sql);
        $p['debug'] .= $data['text']. "\n";
        $text = json_decode($data['text']);
        if (!isset($text->languages)){
            $p['debug'] .= '$text->languages not found for ' . $country['country_code']. "\n";
            $p['error'] = true;
            return $p;
        }
        // look for flag

        $flag = 'unknown';
        foreach ($countries_array as $country_object){
            if ($country_object->code == $country['country_code']){
                $flag = '../images/country/'. $country_object->image;
            }
        }
        $p['debug'] .= "$flag is flag for " .  $country['country_code']. " \n";

        foreach ($text->languages as $language){
            if (isset($language->publish)){
                if ($language->publish){
                    $available [] = array(
                        'language_iso'=> $language->iso,
                        'language_name'=> $language->name,
                        'country_name' => $country['country_code'],
                        'folder'=> $language->folder,
                        'flag'=> $flag
                    );
                }
            }
        }
        usort($available, function($a, $b) {
            return $a['language_iso'] <=> $b['language_iso'];
        });

    }
    // get language template
    $sub_template = file_get_contents(ROOT_EDIT .  'prototype/languageAvailable.html');
    $placeholders = array(
        '{{ link }}',
        '{{ country.image }}',
        '{{ language.name }}',
    );
    $temp = '';
    foreach ($available  as $show){
            $replace = array(
               '/content/'. $show['folder'],
               $show['flag'],
                $show['language_name']
            );
            $temp .= str_replace($placeholders, $replace, $sub_template);
            
        
    }
   
   
    $body = str_replace('[[languages]]',$temp,  $main_template);

    // write file
    //
    $fname = ROOT_PUBLISH_CONTENT. 'languages.html';
    $p['debug'] .= "Copied Languages available to $fname \n";
    publishFiles( 'publish', $p, $fname, $body, STANDARD_CSS, $selected_css);
    return $p;
}

function _flag($country_code){
    $flag = '';
    $sql = "SELECT * FROM content 
            AND filename = 'countries'  AND publish_date != '' 
            ORDER BY recnum DESC LIMIT 1";
    $countries = sqlArray($sql);
    foreach ($countries as $country){
        if ($country['code'] == $country_code){
            $flag = '../images/country/'. $country['image'];
        }
    }
    return $flag;
}
