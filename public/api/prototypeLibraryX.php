<?php
require_once ('prototypeORpublish.php');


function prototypeLibrary($p){
    /* Return a container for the books in these libraries. 
    This will be used to prototype these books by prototypeLibraryandBooks.
    */
    $p['books'] = []; 
    $p['selected_css'] = 'ZZ/styles/cardGLOBAL.css';
    $p['language_dir'] = ROOT_PROTOTYPE_CONTENT . $p['country_code'] . '/'. $p['language_iso'] .'/';
    $p['debug'] .= 'In prototypeLibrary '. "\n";
    $p = prototypeLanguageFooter($p);
    // get bookmark
    $b['recnum'] = $p['recnum'];
    $b['library_code'] = $p['library_code'];
    $bm = bookmark($b);
    $bookmark = $bm['content'];
   // $p['debug'] .= isset($bm['debug']) ? $bm['debug'] :null;
    //
    // select appropriate template
    $temp = 'bookTitled.html';
    if ($bookmark['language']->titles){
        $temp = 'bookImage.html';
        //$p['debug'] .= 'Using template for bookImage '. "\n";
    }
    $book_template = file_get_contents(ROOT_EDIT .  'prototype/' . $temp);
    //$p['debug'] .= $book_template . "\n";
    // find library names
    $sql = "SELECT DISTINCT filename  FROM content 
        WHERE  country_code = '" . $p['country_code'] . "' 
        AND language_iso = '" . $p['language_iso'] ."' AND folder_name = ''";
     //$p['debug'] .= $sql. "\n";
    $query = sqlArray($sql, 'query');
    if (!$query){
        $p['debug'] .= 'no libraries found'. "\n";
        return $p;
    }
    while($library = $query->fetch_array()){
        //$p['debug'] .= 'Library is '  . $library['filename']. "\n";
        $filename = $library['filename'];
        // you do not want to handle custom libraries in this routine
        if ($filename !== 'index'){
   
            $sql = "SELECT text FROM content 
                WHERE  country_code = '" . $p['country_code']. "'  
                AND language_iso = '". $p['language_iso'] ."' 
                AND folder_name = '' AND filename = '$filename' 
                ORDER BY recnum DESC LIMIT 1";
            //$p['debug'] .= $sql. "\n";
            $data = sqlArray($sql);
            $text = json_decode($data['text']);
            $body = file_get_contents(ROOT_EDIT .  'prototype/library.html');
            //$p['debug'] .= $body . "\n";
            if (isset($text->image)){
                $img =  '/content/'. $bookmark['language']->image_dir .'/' . $text->image;
                $body = str_replace('{{ library.image }}',$img, $body);
            }
            if (isset($text->text)){
                $body = str_replace('{{ library.text }}', $text->text, $body);
            }
            $country_index = '/content/' . $p['country_code'] .'/'. $p['language_iso'];
            $root_index = '/content/index.html';
            $placeholders = array(
                '{{ link }}',
                '{{ version }}',
                '{{ footer }}',
                '{{ language.rldir }}'
            );
            $replace = array(
                $root_index,
                $p['version'],
                $p['language_footer'],
                $bookmark['language']->rldir
            );
            $body = str_replace($placeholders, $replace, $body);
    
        // $p['debug'] .= $body . "\n";
            $books = '';
            $placeholders = array(
                '{{ link }}', 
                '{{ book.image }}', 
                '{{ book.title }}',
                '{{ language.rldir }}'
            );
            if (isset($text->books)){
                foreach ($text->books as $book){

                    // deal with legacy data
                    $code = '';
                    if (isset($book->code)){
                        $code = $book->code;
                    }
                    else if (isset($book->name)){
                        $code = $book->name;
                        $book->code = $code;
                    }
                    // you will need library code in bookmark
                    $book->library_code =  $library['filename'];
                    // deal with any duplicates
                    $p['books'][$code] = $book;
                    if ($book->format == 'series'){
                        $this_link =  $code . '/index.html';
                    }
                    else{
                        $this_link = 'pages/'. $code . '.html';
                    }
                    $replace = array(
                        $this_link,
                        '/content/'. $bookmark['language']->image_dir .'/' . $book->image,
                        $book->title,
                        $bookmark['language']->rldir
                    );
                    $books .= str_replace($placeholders, $replace, $book_template);
                }
            }
            $body = str_replace('[[books]]',$books, $body);

            // write file
            // if filename == 'library', switch to 'index' because it means there is no
            // LibraryIndex file
            if ($filename == 'library'){
                $filename = 'index';
            }
        
            $file = $p['language_dir'] . $filename . '.html';
            $p = prototypeWrite($p, $file, $body, STANDARD_CSS, $p['selected_css']);

        }
    }
        //
    // update records
    //
    $time = time();
    $sql = "UPDATE content 
        SET prototype_date = '$time', prototype_uid = '". $p['my_uid'] . "'
        WHERE country_code = '". $p['country_code']. "' 
        AND language_iso = '" . $p['language_iso'] ."' 
        AND folder_name = ''
        AND prototype_date IS NULL";
    //$p['debug'] .= $sql. "\n";
    sqlArray($sql,'update');
    return $p;
}
