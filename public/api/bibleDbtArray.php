<?php
 /* requires $p['language_iso'] 
 and $p['entry'] in form of 'Zephaniah 1:2-3'

 returns array:
     $dbt = array(
         'entry' => 'Zephaniah 1:2-3'
          'bookId' => 'Zeph',  
          'chapterId' => 1, 
          'verseStart' => 2, 
          'verseEnd' => 3,
         'collection_code' => 'OT' ,
     );
 */     

function createBibleDbtArrayFromPassage($p){
    $out = [];
    $language_iso = $p['language_iso'];
    $passage = trim($p['entry']);
    $parts = explode(' ', $passage);
    $book = $parts[0];
    if ($book == 1 || $book == 2 || $book == 3){
        $book .= ' '. $parts[1];
    }
    // get valid bookId
    $conn = new mysqli(HOST, USER, PASS, DATABASE_BIBLE);
    $conn->set_charset("utf8");
    $sql = "SELECT book_id, testament FROM hl_online_bible_book 
        WHERE  $language_iso  = '$book' LIMIT 1";
    $query = $conn->query($sql);
    if ($query){
        $data = $query->fetch_object();
    }
    if (!isset($data->book_id)){
        // try English if language_iso does not work
        $sql = "SELECT book_id, testament FROM hl_online_bible_book 
        WHERE  eng  = '$book' LIMIT 1";
        $query = $conn->query($sql);
        $data = $query->fetch_object();
        if (!isset($data->book_id)){
            $out['content'] = null;
            $out['error'] = true;
            $out['debug'] =  'Book ID not found' . "\n";
            return $out;
        }
    }
    // pull apart chapter
    $pass = str_replace($book, '', $passage);
    $pass = str_replace(' ' , '', $pass);
    $i = strpos($pass, ':');
    if ($i !== FALSE){
        $chapterId = substr($pass, 0, $i);
        $verses = substr($pass, $i+1);
        $i = strpos ($verses, '-');
        if ($i !== FALSE){
            $verseStart = substr($verses, 0, $i);
            $verseEnd = substr($verses, $i+1);
        }
        else{
            $verseStart = $verses;
            $verseEnd = $verses;
        }
    }
    else{
        $chapterId = $p;
        $verseStart = 1; 
        $verseEnd = 200;
    }
    $dbt_array = array(
        'entry' => $passage,
        'bookId' => $data->book_id,
        'chapterId' => $chapterId, 
        'verseStart' => $verseStart, 
        'verseEnd' => $verseEnd,
        'collection_code' => $data->testament,
    );
    $out['error'] = false;
    $out['content'] = $dbt_array;
    return $out;
}
