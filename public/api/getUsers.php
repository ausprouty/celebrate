<?php

require_once ('sql.php');

function getUsers($params){
    $sql = 'SELECT * FROM members ORDER BY firstname ASC';
    $query = sqlMany($sql);
    $json = '[';
    while($member = $query->fetch_array()){
        $json .= '{ "firstname": "'. $member['firstname'] . '",';
        $json .= ' "lastname": "'. $member['lastname'] . '",';
        $json .= ' "countries": "'. $member['countries'] . '",';
        $json .= ' "uid": "'. $member['uid'] . '"},';
     }
     $json = substr($json, 0, -1) . ']';
     $out['content'] = $json;
    return $out;
}
