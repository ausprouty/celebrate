<?php

require_once ('sql.php');

function deleteUser($params){
    $sql = 'DELETE FROM members WHERE username = "'. $params['member_username'] .
         '" AND uid = ' . $params['member_uid'] . ' LIMIT 1';
    sqlDelete($sql);
    $out['content'] = 'deleted';
    return $out;
}