<?php
require_once ('prototypeORpublish.php');
require_once ('bookmark.php');

function createSeries($p, $data){
    $text = json_decode($data['text']);
    // $p['debug'] .= "\n\n In prototypeSeries\n";
    $footer = prototypeLanguageFooter($p); // returns $footer  
    $b['recnum'] = $p['recnum'];
    $b['library_code'] = $p['library_code'];
    $bm = bookmark($b);
    $bookmark = $bm['content'];
    $selected_css = isset($bookmark['book']->style) ? $bookmark['book']->style :STANDARD_CSS ;
    $json_dir =  '/content/'. $bookmark['language']->folder .'/'.$p['folder_name'] .'/'; // for files.json
    //$p['debug'] .= isset($bm['debug']) ? $bm['debug'] : null;
    //$p['debug'] .= 'Bookmark is '.  json_encode($bookmark) . "\n";
    // replace placeholders in template
    $this_template = file_get_contents(ROOT_EDIT .  'prototype/series.html');
    // insert nav bar
    $nav = file_get_contents(ROOT_EDIT .  'prototype/navRibbon.html');
    $this_template = str_replace('[[nav]]', $nav, $this_template);
    //set placeholders
    $placeholders = array(
        '{{ language.rldir }}',
        '{{ book.style }}',
        '{{ link }}', 
        '{{ ribbon }}',
        '{{ book.image }}', 
        '{{ download_ready }}',
        '{{ book.title }}', 
        '{{ book.description }}', 
        '{{ json }}',
        '{{ download_now }}', 
        '{{ version }}',
        '{{ footer }}'
    );
    $link =   '/content/'. $bookmark['language']->folder .'/';
    if ( $p['library_code'] !='library'){
        $link .= $p['library_code'] . '.html';
    }
    else{
        $link .= 'index.html';
    }
    $download_ready = isset($text->download_ready )? $text->download_ready : 'Ready for Offline Use';
    $download_now = isset($bookmark['language']->download)? $bookmark['language']->download : 'Download for Offline Use';
    $description = isset($text->description) ? $text->description : NULL;
    $ribbon = isset($bookmark['library']->format->back_button) ? $bookmark['library']->format->back_button->image : DEFAULT_BACK_RIBBON;
        
    $language_dir = '/content/'. $data['country_code'] .'/'. $data['language_iso'] .'/'. $data['folder_name'] .'/';
    $json = $language_dir . 'files.json';
    $p['files_json'] = '[{"url":"'.  $json .'"},' ."\n"; // rest to be filled in with chapters
    // dealing with legacy data
    if (isset($bookmark['book']->image->image)){
        $book_image = $bookmark['book']->image->image;
    }
    else{
        $book_image =  '/content/'. $bookmark['language']->image_dir .'/' . $bookmark['book']->image ;
    }
    // get language footer
    $footer = prototypeLanguageFooter($p); // returns  $footer 
    //
    $replace = array(
        $bookmark['language']->rldir,
        $bookmark['book']->style,
        $link,
        $ribbon,
        $book_image,
        $download_ready,
        $bookmark['book']->title,
        $description, 
        $json,
        $download_now , 
        $p['version'],
        $footer 
    );
    $this_template = str_replace($placeholders, $replace, $this_template);
    //
    // get chapter template
    //
    $chapterText_template = file_get_contents(ROOT_EDIT .  'prototype/chapterText.html');
    $chapterImage_template = file_get_contents(ROOT_EDIT .  'prototype/chapterImage.html');
    $placeholders = array(
        '{{ link }}',
        '{{ language.rldir }}',
        '{{ chapter.title }}',
        '{{ chapter.description }}',
        '{{ chapter.image }}',
        '{{ language.rldir }}'
    );
    //
    // replace for each chapter
    //
    
    $chapters_text = '';
    if (isset($text->chapters)){
        foreach ($text->chapters as $chapter){
            if ($chapter->publish){  // we only want to publish those with this as true
                $p['files_json'] .= '{"url":"'. $json_dir . $chapter->filename . '.html"},' ."\n";
                $image = null;
                if (isset($chapter->image)){
                    if ($chapter->image != ''){
                        $image = '/content/' . $bookmark['language']->folder 
                            .'/' . $bookmark['book']->code .'/'. $chapter->image;
                    }
                }
                $description = isset($chapter->description) ? $chapter->description :null;
                $title = $chapter->title;
                if ($chapter->count){
                // $title = $chapter->count . '. '. $chapter->title;
                $title = '<div class="block {{ language.rldir }}">
                        <div class="chapter_number series {{ language.rldir }}">'.  $chapter->count .'.'. '</div>
                        <div class="chapter_title series {{ language.rldir }}">'  . $chapter->title . '</div>
                    </div>';
                }
                $replace = array(
                    $chapter->filename . '.html',
                    $bookmark['language']->rldir,
                    $title,
                    $description ,
                    $image,
                    $bookmark['language']->rldir, 
                );
                if ($image){
                    $chapters_text .= str_replace($placeholders, $replace, $chapterImage_template );
                }
                else{
                    $chapters_text .= str_replace($placeholders, $replace, $chapterText_template );
                }
            }
        }
    }
    $out['text'] = str_replace('[[chapters]]', $chapters_text, $this_template);
    $out['p'] = $p;
    return $out;
}
