<?php

require_once ('prototypeORpublish.php');
require_once ('getLatestContent.php');

/* returns bookmark values 

   requires: $p['recnum'] and $p['library_code];

   returns array $bookmark

*/
function bookmark ($p){
    $bm = [];
    $out['debug'] = '';
    $b['bookmark'] = null;
    $b['library_code'] =   isset($p['library_code']) ? $p['library_code'] : 'library';

    // be sure to add this in for library since you can not yet derive it.
    if (isset($p['recnum'])){
        $b['library_code'] =   $p['library_code'];
        $out['debug'] .= 'library_code ' . $b['library_code'] . "\n\n";
        // find other parameters for bookmark from recnum
        $out['debug'] .= 'recnum is ' . $p['recnum'] . "\n";
        $starting = objectFromRecnum($p['recnum']);
        $b['country_code'] = $starting->country_code;
        $out['debug'] .= 'b[country_code] is ' . $b['country_code'] . "\n";
        $b['language_iso'] = $starting->language_iso;
        $out['debug'] .= 'b[language_iso] is ' . $b['language_iso'] . "\n";
        $b['folder_name'] = $starting->folder_name;
        $out['debug'] .= 'b[folder_name] is ' . $b['folder_name'] . "\n";
        $b['filename'] = $starting->filename;
        $out['debug'] .= 'b[filename] ' . $b['filename'] . "\n\n";
    }
    else{
        $b['country_code'] = isset($p['country_code'])?$p['country_code']:null;
        $b['language_iso'] = isset($p['language_iso'])?$p['language_iso']:null;
        $b['folder_name'] = isset($p['folder_name'])?$p['folder_name']:null;
        $b['filename'] = isset($p['filename'])?$p['filename']:null;
    }
   
    if ($b['country_code']){
        $response = checkBookmarkCountry($b);
        $b['bookmark']['country'] = $response['content'];
        $out['debug'] .= $response['debug'] . "\n";

        if ($b['language_iso']){
            $response = checkBookmarkLanguage($b);
            $b ['bookmark'] ['language'] = $response['content'];
            $out['debug'] .=  $response['debug']. "\n";

            if (isset($b['library_code'])){
                $response = checkBookmarkLibrary($b);
                $b['bookmark']['library']  = $response['content'];
                $out['debug'] .=  $response['debug']. "\n";

                if ($b['folder_name']){
                    $response = checkBookmarkSeries($b);
                    $b['bookmark']['series'] = $response['content'];
                    $out['debug'] .=  $response['debug']. "\n";
                    $response = checkBookmarkBook($b);
                    $b['bookmark']['book'] = $response['content'];
                    $out['debug'] .=  $response['debug']. "\n";
                    
                    if ($b['filename']){
                        $response = checkBookmarkPage($b);
                        $b['bookmark']['page'] = $response['content'];
                        $out['debug'] .=  $response['debug'];
                    }
                }
            }
        }
    }
    $out['content'] = $b['bookmark'];
    return $out;
}
function checkBookmarkCountry($b){
    $out = [];
    $out['debug'] = null;
    $out['content'] = null;
    $b['scope'] = 'countries';
    $res = getLatestContent($b);
    $out['debug'] .= $res['debug'];
    $out['debug'] .= 'response is'.  $res['content']['text']."\n";
    $response = json_decode($res['content']['text']);
    foreach ($response as $country){
        if ($country->code == $b['country_code']){
            $out['content'] = $country;
        }
    }
    return $out;
}
function checkBookmarkLanguage($b){
    $out = [];
    $out['debug'] = null;
    $out['content'] = null;
    $b['scope'] = 'languages';
    $res = getLatestContent($b);
    //$out['debug'] .= $res['debug'];
   // $out['debug'] .= 'response is'.  $res['content']['text'] ."\n";
    $response = json_decode($res['content']['text']);
    if (isset($response->languages)){
        foreach ($response->languages as $language){
            if ($language->iso == $b['language_iso']){
                $out['content'] = $language;
            }
        }
    }else{
        $out['debug'] .= 'NO response for languages'.  "\n";
    }
    
    return $out;
}
// no longer used
function checkBookmarkLibraries($b){
    $out = [];
    $out['debug'] = null;
    $out['content'] = null;
    $b['scope'] = 'libraryNames';
    // find possible libraries with books
    $names = getLatestContent($b);
    foreach ($names as $name){
        if ($name !== 'index' && $name !== 'languages'){
            $b['library_code'] = $name;
            $b['scope'] = 'library';
            $res = getLatestContent($b);
            $out['debug'] .= $res['debug'];
            $out['debug'] .= 'response is'.  $res['content']['text'] ."\n";
            $response = json_decode($res['content']['text']);
            $books = $response->books;
            foreach($books as $book){
                $out['content'][] = $book;
            }
        }
    }
    return $out;
}
function checkBookmarkLibrary($b){
    $out = [];
    $out['debug'] = null;
    $out['content'] = null;
    $b['scope'] = 'library';
    $res = getLatestContent($b);
    $out['debug'] .= $res['debug'];
    $out['debug'] .= 'response is'.  $res['content']['text'] ."\n";
    $r = json_decode($res['content']['text']);
    // legacy data does not have ['books'] so move data there
    if (isset($r->books)){
        $response = $r;
    }
    else{
        $response = new stdClass();
        $response->books = $r;
    }
    $out['content'] = $response;
    return $out;
}
function checkBookmarkBook($b){
    $out = [];
    $out['debug'] = 'In check BookmarkBook' . "\n";
    $out['content'] = null;
    $this_book = $b['folder_name'];
    if ($this_book == 'pages'){
        $this_book = $b['filename'];
    }
    $out['debug'] .= 'This book is '.  $this_book . "\n";
    if (isset($b['bookmark']['library']->books)){ 
        $books = $b['bookmark']['library']->books;
        foreach ($books as $book){
            if (!isset($book->code)){
                $out['debug'] .= 'Book code is not set' . "\n";
                $code = isset($book->name) ? $book->name : NULL;
            }
            else{
                $code = $book->code;
            }
            if ($code == $this_book){
                $out['debug'] .= 'Found this code in book array' . "\n";
                $out['debug'] .= json_encode($book) . "\n";
                $out['content'] = $book;
            }
        }}
    return $out;
}
function checkBookmarkSeries($b){
    $out = [];
    $out['debug'] = null;
    $out['content'] = null;
    $b['scope'] = 'series';
    $res = getLatestContent($b);
    $out['debug'] .= $res['debug'];
    $out['debug'] .= 'response is'.  $res['content']['text'] ."\n";
    $response = json_decode($res['content']['text']);
    $out['content'] = $response;
    return $out;
}

function checkBookmarkPage($b){
    $out = [];
    $out['debug'] = null;
    $out['content'] = null;
    // is this part of a series?
    if (isset($b['bookmark']['series'])){
        // go through series bookmark to find chapter information
        if (isset($b['bookmark']['series']->chapters)){
           $chapters = $b['bookmark']['series']->chapters;
           foreach ($chapters as $chapter){
               if ($chapter->filename == $b['filename']){
                $out['content'] = $chapter;
               }
           }
        }
        // this should not happen
        else{
            $out['content'] =  $b['bookmark']['book'];
        }
    }
    // this is a basic page from the library and does not have any data?
    else{
        $out['content'] =  $b['bookmark']['book'];
    }
    return $out;
}