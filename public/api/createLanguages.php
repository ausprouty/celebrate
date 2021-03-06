<?php

function createLanguages($p, $data){
    $p['debug'] = isset($p['debug']) ? $p['debug']:NULL;
    $p['debug'] .= $data['text']. "\n";
    $text = json_decode($data['text']);
    if (!isset($text->languages)){
        $out['body'] = '';
        return $out;
    }
     // replace placeholders in template
    $main_template = $book_template = file_get_contents(ROOT_EDIT .  'prototype/languages.html');
    $placeholders = array(
        '{{ choose_language }}', 
        '{{ more_languages }}', 
    );
    $choose = isset($text->choose_language) ? $text->choose_language: 'Choose Language';
    $more = isset($text->more_languages) ? $text->more_languages: 'More Languages';
    $replace = array(
       $choose,
       $more 
    );
    $main_template = str_replace($placeholders, $replace, $main_template);
    // get chapter template
    $sub_template = file_get_contents(ROOT_EDIT .  'prototype/language.html');
    $placeholders = array(
        '{{ link }}',
        '{{ language.name }}',
    );
    $temp = '';
    foreach ($text->languages as $language){
        if (isset($language->publish)){
            if ($language->publish){
                $replace = array(
                    '/'. $language->folder,
                     $language->name
                 );
                 $temp .= str_replace($placeholders, $replace, $sub_template);
                  //
                 // make sure Language directory exits? Do I need this????
                 //
                 $p['language_dir'] = ROOT_PROTOTYPE_CONTENT  . '/'. $language->folder .'/';
                 if (!file_exists($p['language_dir'])){
                     dirMake($p['language_dir']);
                 }
            }
        }
    }
   
    $out['body'] = str_replace('[[languages]]',$temp,  $main_template);
    return $out;

    // write file
    //
}