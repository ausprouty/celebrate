<?php
require_once('sql.php');

function bibleGetPassage($p){
    //$out['debug'] = 'I came into  bibleGetPassage' . "\n";
    $sql = "SELECT * FROM dbm_bible WHERE bid = " . $p['bid'];
    //$out['debug'] = $sql . "\n";
    $data = sqlBible($sql);
    if ($data['right_to_left'] != 't'){
        $p['rldir'] = 'ltr';
    }
    else{
        $p['rldir'] = 'rtl';
    }
   
    //$out['debug'] = $data['source']  . "\n";
    if ($data['source'] == 'bible_gateway'){
        require_once ('bibleGetPassageBiblegateway.php');
        $p['version_code'] = $data['version_code'];
        $out = bibleGetPassageBiblegateway($p);
        return $out;
    }
    if ($data['source']  == 'dbt'){
        require_once('bibleGetPassageDBT.php');
        $out = bibleGetPassageDBT($p);
        return $out;
    }
    return $out;
}