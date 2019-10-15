<?php

require_once ('sql.php');

function getUser($params){
    $sql = 'SELECT * FROM members WHERE uid = ' . $params['uid'];
    $member = sqlArray($sql);
    $json = '';
    $json .= '{ "firstname": "'. $member['firstname'] . '",';
    $json .= ' "lastname": "'. $member['lastname'] . '",';
    $json .= ' "countries": "'. $member['countries'] . '",';
    $json .= ' "username": "'. $member['username'] . '",';
    $json .= ' "uid": "'. $member['uid'] . '"}';
     $out['content'] = $json;
    return $out;
}
