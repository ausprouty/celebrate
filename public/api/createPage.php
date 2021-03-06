<?php
require_once ('bookmark.php');

function createPage($p, $data){
    
    // get bookmark
    $b['recnum'] =  $p['recnum'];
    $b['library_code'] = $p['library_code'];
    $bm = bookmark($b);   
    $bookmark = $bm['content'];
    $p['selected_css'] = isset($bookmark['book']->style)? $bookmark['book']->style: STANDARD_CSS;
    if (!isset($bookmark['book']->format)){
       $debug = 'Bookmark[book]->format not set for  recnum ' . $b['recnum'] .' in prototype page with library code ' . $b['library_code'] ."\n";
       $debug .= json_encode($out);
        $fh = fopen('logs/bookmarkError' . time() . rand(1, 1000000) .'.txt', 'w');
        fwrite($fh, $debug);
        fclose($fh);
    }
    if ($bookmark['book']->format == 'series'){
        $p['debug'] .= 'This is a series' . "\n";
        $this_template = file_get_contents(ROOT_EDIT .  'prototype/pageInSeries.html');
        // insert nav bar and set ribbon value and link value
        $nav = file_get_contents(ROOT_EDIT .  'prototype/navRibbon.html');
        $this_template = str_replace('[[nav]]', $nav, $this_template);
        $ribbon = isset($bookmark['library']->format->back_button) ? $bookmark['library']->format->back_button->image : DEFAULT_BACK_RIBBON;
        $link_value =  '/content/'. $bookmark['language']->folder . '/'. $data['folder_name'].'/index.html';
        // compute $page_title_and_image for series
        if (isset($bookmark['page']->image)){
            if ($bookmark['page']->image){
                $page_image = $bookmark['page']->image;
                $page_title_and_image_value  = '<img  src ="'. $page_image  .  '"/>';
            }
        }
        // you do not have an image to insert
        if (!isset($page_title_and_image_value)){
            $title = $bookmark['page']->title;
            if (isset($bookmark['page']->count)){
                if ($bookmark['page']->count != ''){
                    $page_title_and_image_value = 
                    '<div class="block {{ dir }}">
                        <div class="chapter_number {{ dir }}"><h1>'. $bookmark['page']->count .'.'. '</h1></div>
                        <div class="chapter_title {{ dir }}"><h1>'  . $title . '</h1></div>
                    </div>';
                }
                else{
                    $page_title_and_image_value  = '<h1>' . $title . '</h1>';
                }
            }
            else{
                $page_title_and_image_value  = '<h1>' . $title . '</h1>';
            }
           
        }
    }
    // values for page that is not part of a series
    if ($bookmark['book']->format == 'page'){
        $p['debug'] .= 'This is a page' . "\n";
        $this_template = file_get_contents(ROOT_EDIT .  'prototype/page.html');
         // insert nav bar
         $nav = file_get_contents(ROOT_EDIT .  'prototype/navRibbon.html');
         $this_template = str_replace('[[nav]]', $nav, $this_template);
         $ribbon = isset($bookmark['library']->format->back_button->image) ? $bookmark['library']->format->back_button->image : DEFAULT_BACK_RIBBON;
       
        // this will work if there is no special library index.
        $index = 'index.html';
        if ($p['library_code'] != 'library'){
            $index = $p['library_code'] . '.html';
        }
        $link_value =  '/content/'. $bookmark['language']->folder .  '/'.$index;
        $page_text_value = $data['text']; 
        // compute $page_title_and_image_value
        if (isset($bookmark['book']->image->image)){
            $page_image = $bookmark['book']->image->image;
        }
        else{ // legacy data
            $page_image = $bookmark['book']->image;
        }
    
       
        $img =  $page_image;
        $page_title_and_image_value  = '<img  src ="'. $img  .  '"/>';
        $page_title_and_image_value .= '<h1>'. $bookmark['book']->title . '</h1>';
    }   
    if (!isset($this_template)){
        $p['debug'] .= 'FATAL ERROR. No Page Template for recnum'. $p['recnum'] . "\n";
        return $p;
    }
    $dir_value = $bookmark['language']->rldir;
    $card_style_value = '/content/ZZ/styles/cardGLOBAL.css';
    $book_style_value  =  $bookmark['book']->style;
    $page_text_value = $data['text']; 
    $version_value = $p['version'];
     // get language footer
     $footer = prototypeLanguageFooter($p); // returns  $footer 
     // define placeholders
     $placeholders = array(
        '{{ dir }}',
        '{{ card.style }}',
        '{{ book.style }}',
        '{{ link }}', 
        '{{ ribbon }}', 
        '{{ page.title_and_image }}',
        '{{ page.text }}', 
        '{{ version }}',
        '{{ footer }}'
    ); //
    $replace = array(
        $dir_value,
        $card_style_value,
        $book_style_value,
        $link_value, 
        $ribbon,
        $page_title_and_image_value, 
        $page_text_value, 
        $version_value,
        $footer 
    );
    $text = str_replace($placeholders, $replace, $this_template);
    $out['text'] = str_replace('{{ dir }}',  $dir_value, $text); // because dir is inside of page_title_and_image_value
    $out['p'] = $p;
    return $out;
}