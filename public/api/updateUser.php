<?php

require_once ('sql.php');

function updateUser($params){
    $hash = password_hash($params['password'], PASSWORD_DEFAULT);
    $sql = 'UPDATE members SET 
        firstname = "'. $params['firstname'] . '",' .
        'lastname = "'. $params['lastname'] . '",' .
        'username = "'. $params['username'] . '",' .
        'password = "'.$hash. '",' .
        'countries = "'. $params['countries'] . '"' .
        ' WHERE  uid = ' . $params['member_uid'] . ' LIMIT 1';
    sqlArray($sql, 'update');
    $out['content'] = 'updated';
    return $out;
}