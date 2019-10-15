<?php
function prototypeCountry($post, $root_edit, $conn){
    
    $params = [];
    $p['debug'] = 'in prototypeCountry' . "\n";
    $p['root_prototype'] = '../prototype/content/';
    // read all parameters
	foreach ($post as $param_name => $param_value) {
		if ($param_value == 'null'){
			$param_value = '';
		}
		$$param_name = $param_value;
    }
    //
    // make sure Country directories are current
    //
    $root_edit .= 'content/';
    $country_dir = $p['root_prototype'] . $countryCODE;
    if (!file_exists($country_dir)){
        mkdir($country_dir);
    }
	prototypeCopyDir($root_edit . $countryCODE . '/images/', $country_dir . '/images/');
    prototypeCopyDir($root_edit . $countryCODE . '/styles/', $country_dir . '/styles/');
    //
    // make sure Language directories are current
    //
    $p['language_dir'] = $country_dir . '/'. $languageISO .'/';
    if (!file_exists($p['language_dir'])){
        mkdir($p['language_dir']);
    }
    prototypeCopyDir($root_edit . $countryCODE .'/'. $languageISO. '/images/', $p['language_dir'] . '/images/');
    prototypeCopyDir($root_edit . $countryCODE .'/'. $languageISO. '/styles/', $p['language_dir'] . '/styles/');
    //
    //find country page
    //
    $sql = "SELECT * FROM content 
        WHERE  country_iso = '$countryCODE' 
        AND folder = '' AND filename = 'index' 
        ORDER BY recnum DESC LIMIT 1";
    $p['debug'] .= $sql. "\n";
    $query = $conn->query($sql);
    if (!$query){return;}
    $data = $query->fetch_array();
    $text = json_decode($data['text']);
    $p['country_footer'] = $text->footer;
    // replace placeholders
    $body = '<div class="content">'. "\n";
    $body .= $text->page . "\n";
    $body = str_replace('/preview/library', '/content', $body);
    $body = $body .  $p['country_footer'] ;
    $body .= '</div>'. "\n";
    $file = $country_dir . '/index.html';
    $p['standard_css'] = 'ZZ/styles/myfriends.css';
    $p['selected_css'] = 'AU/styles/AU-freeform.css';
    // write coutnry file
    prototypeWrite($file, $body,   $p['standard_css'],  $p['selected_css']);
    $file = $p['language_dir'] . '/index.html';
    prototypeWrite($file, $body, $p['standard_css'], $p['selected_css']);
    // prepare for library
    $p['countryCODE'] = $countryCODE;
    $p['languageISO'] = $languageISO;
    $p['bookmark'] = json_decode($bookmark);
    //
    // update records
    //
    $time = time();
    $sql = "UPDATE content 
        SET prototype_date = '$time', prototype_uid = '$my_uid'
        WHERE  country_iso = '$countryCODE' 
        AND folder = '' AND filename = 'index'
        AND prototype_date IS NULL";
    $p['debug'] .= $sql. "\n";
    $query = $conn->query($sql);
    
    return $p;
}
function prototypeLibrary($post, $root_edit, $conn){
    $p = prototypeCountry($post, $root_edit, $conn);
    $p['debug'] .= 'In prototypeLibrary '. "\n";
    $bookmark_language = $p['bookmark']->language;
    $countryCODE = $p['countryCODE'];
    $languageISO =  $p['languageISO'];
    // select appropriate template
    $temp = 'bookTitled.html';
    if ($bookmark_language->titles){
        $temp = 'bookImage.html';
    }
    $book_template = file_get_contents('../edit/publish/' . $temp);
    $p['debug'] .= $book_template . "\n";
    // find library names
    $sql = "SELECT DISTINCT filename  FROM content 
        WHERE  country_iso = '$countryCODE' AND language_iso = '$languageISO' 
        AND folder = ''";
     $p['debug'] .= $sql. "\n";
    $query = $conn->query($sql);
    if (!$query){
        $p['debug'] .= 'no libraries found'. "\n";
        return $p;
    }
    while($library = $query->fetch_array()){
        $p['debug'] .= 'Library is '  . $library['filename']. "\n";
        $filename = $library['filename'];
        $sql = "SELECT text FROM content 
            WHERE  country_iso = '$countryCODE'  AND language_iso = '$languageISO' 
            AND folder = '' AND filename = '$filename' 
            ORDER BY recnum DESC LIMIT 1";
        $p['debug'] .= $sql. "\n";
        $q = $conn->query($sql);
        if (!$q){
            $p['debug'] .= "library $filename not found \n";
            return $params;
        }
        $data = $q->fetch_array();
        $text = json_decode($data['text']);
        $body = file_get_contents('../edit/publish/library.html');
        $p['debug'] .= $body . "\n";
        if (isset($text->image)){
            $img =  '/content/'. $bookmark_language->image_dir .'/' . $text->image;
            $body = str_replace('{{ library.image }}',$img, $body);
        }
        if (isset($text->text)){
            $body = str_replace('{{ library.text }}', $text->text, $body);
        }
        $country_index = '/content/' . $p['countryCODE'] .'/'. $p['languageISO'];
        $body = str_replace('{{ link }}', $country_index, $body);
        $body = str_replace('{{ footer }}', $p['country_footer'] , $body);
        $p['debug'] .= $body . "\n";
        $books = '';
        $placeholders = array('{{ link }}', '{{ book.image }}', '{{ book.title }}');
        if (isset($text->books)){
            foreach ($text->books as $book){
                if ($book->format == 'series'){
                    $this_link =  $book->name . '/index.html';
                }
                else{
                    $this_link = '../'. $book->name . '.html';
                }
                $replace = array(
                    $this_link,
                    '/content/'. $bookmark_language->image_dir .'/' . $book->image,
                    $book->title
                );
                $books .= str_replace($placeholders, $replace, $book_template);
            }
        }
        $body = str_replace('[[books]]',$books, $body);
       
        $p['debug'] .= $filename . "\n";
        $file = $p['language_dir'] . $filename . '.html';
        prototypeWrite($file, $body, $p['standard_css'], $p['selected_css']);

    }
    //
    // update records
    //
    $time = time();
    $sql = "UPDATE content 
        SET prototype_date = '$time', prototype_uid = '$my_uid'
        WHERE  country_iso = '$countryCODE' AND language_iso = '$languageISO' 
        AND folder = ''
        AND prototype_date IS NULL";
    $p['debug'] .= $sql. "\n";
    $query = $conn->query($sql);
    return $p;

}
function prototypeSeries ($post, $root_edit, $conn){
    // get all parameters
   $p =  prototypeLibrary($post, $root_edit, $conn);
   $p['series_dir'] = '/content/'. $countryCODE .'/'. $languageISO .'/'. $folderNAME .'/';
    //
    //find series data
    //
    $sql = "SELECT * FROM content 
        WHERE  country_iso = '$countryCODE' AND  language_iso = '$languageISO' 
        AND folder = '$folderNAME'  AND filename = 'index' 
        ORDER BY recnum DESC LIMIT 1";
    $p['debug'] .= $sql. "\n";
    $query = $conn->query($sql);
    if (!$query){return;}
    $data = $query->fetch_array();
    $text = json_decode($data['text']);
    // replace placeholders in template
    $this_template = file_get_contents('../edit/publish/series.html');
    $placeholders = array(
        '{{ link }}', 
        '{{ book.image }}', 
        '{{ download_ready }}',
        '{{ book.title }}', 
        '{{ book.description }}', 
        '{{ download_now }}', 
        '{{ version }}'
    );
    $replace = array(
        '/content/'. $countryCODE .'/'. $languageISO .'/'. $libraryCODE . '/index.html',
        '/content/'. $bookmark_language->image_dir .'/' . $bookmark->book->image,
        $text->download_ready,
        $bookmark->book->title,
        $text->description, 
        $text->download_now , 
        '{{ version }}'
    );
    $this_template = str_replace($placeholders, $replace, $this_template);
    // get chapter template
    $chapterText_template = file_get_contents('../edit/publish/chapterText.html');
    $chapterImage_template = file_get_contents('../edit/publish/chapterImage.html');
    $placeholders = array(
        '{{ link }}',
        '{{ chapter.title }}',
        '{{ chapter.description }}',
        '{{ chapter.image }}'
    );
    $chapters_text = '';
    foreach ($text->chapters as $chapter){
        $replace == array(
            $chapter->filename,
            $chapter->title,
            $chapter->description ,
            $chapter->image 
        );
        if (isset($chapter->image)){
            $chapters_text .= str_replace($placeholders, $replace, $chapterImage_template );
        }
        else{
            $chapters_text .= str_replace($placeholders, $replace, $chapterText_template );
        }
    }
    $text = str_replace('[[chapters]]', $chapters_text, $this_template);
    $text .= $p['country_footer'] ;

    
    $file = $p['series_dir'] . 'index.html';
    prototypeWrite($file, $text,  $p['standard_css'], $p['selected_css']);
    //
    // update records
    //
    $time = time();
    $sql = "UPDATE content 
        SET prototype_date = '$time', prototype_uid = '$my_uid'
        WHERE  country_iso = '$countryCODE' AND  language_iso = '$languageISO' 
        AND folder = '$folderNAME'  AND filename = 'index' 
        AND prototype_date IS NULL";
    $p['debug'] .= $sql. "\n";
    $query = $conn->query($sql);
    return $p;

    return $p;
}
    
    
    
function prototypeHeader(){
    return file_get_contents ('../edit/publish/header.html');
}
function prototypeFooter(){
    return file_get_contents ('../edit/publish/footer.html');
}
function prototypeWrite($file, $text, $standard_css, $selected_css){
    $output = prototypeHeader();
    $placeholders = array('{{ standard.css }}','{{ selected.css }}', '</html>','</body>');
    $replace = array('/content/'. $standard_css,'/content/'. $selected_css, '','');
    $output = str_replace($placeholders, $replace,  $output);
    $output .= $text;
    $output .= prototypeFooter();
    $fh = fopen($file, 'w');
    fwrite($fh, $output);
    fclose($fh);
}
function prototypeCopyDir($source,$destination){
    if (!file_exists($destination)){
        mkdir ($destination); 
    }
    copy_global($source, $destination);
}
