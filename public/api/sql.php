<?php
 define("HOST", "localhost");
 define("USER", "journey2018");
 define("PASS", "ugWwRPb5ljRFeubJ");
 define("DATABASE_CONTENT", "new_journey");
 define("DATABASE_BIBLE", "new_dbm_common");
 define("DATABASE_PORT", 9306);
 
 function sqlBible($sql){
    $conn = new mysqli(HOST, USER, PASS, DATABASE_BIBLE, DATABASE_PORT;
    if ($conn->connect_error) {
        die("Connection has failed: " . $conn->connect_error);
    }
    $query = $conn->query($sql);
    if ($query){
        $output =  $query->fetch_array();
         $conn->close();
         return $output;
    }
 }
 function sqlBibleMany($sql){
    $conn = new mysqli(HOST, USER, PASS, DATABASE_BIBLE, DATABASE_PORT);
    if ($conn->connect_error) {
        die("Connection has failed: " . $conn->connect_error);
    }
    $query = $conn->query($sql);
    $output =  $query;
    $conn->close();
    return $output;
 }

function sqlArray($sql, $update = NULL){
    $conn = new mysqli(HOST, USER, PASS, DATABASE_CONTENT, DATABASE_PORT);
    if ($conn->connect_error) {
        die("Connection has failed: " . $conn->connect_error);
    }
    $query = $conn->query($sql);
   
    if (!$update){
        if ($query){
           $output =  $query->fetch_array();
            $conn->close();
            return $output;
        }
        else{
            $conn->close();
            return null;
        }
    }
    else{
       $output =  $query; 
       $conn->close();
       return $output;
    }
}
function sqlDelete($sql){
    $conn = new mysqli(HOST, USER, PASS, DATABASE_CONTENT, DATABASE_PORT);
    if ($conn->connect_error) {
        die("Connection has failed: " . $conn->connect_error);
    }
    $query = $conn->query($sql);
    $conn->close();
    return;
}
function sqlInsert($sql){
    $conn = new mysqli(HOST, USER, PASS, DATABASE_CONTENT, DATABASE_PORT);
    if ($conn->connect_error) {
        die("Connection has failed: " . $conn->connect_error);
    }
    $query = $conn->query($sql);
    $conn->close();
    return;
}
function sqlMany($sql){
    $conn = new mysqli(HOST, USER, PASS, DATABASE_CONTENT, DATABASE_PORT);
    if ($conn->connect_error) {
        die("Connection has failed: " . $conn->connect_error);
    }
    $query = $conn->query($sql);
    $output =  $query;
    $conn->close();
    return $output;
}
function sqlText($sql, $update = NULL){
    $conn = new mysqli(HOST, USER, PASS, DATABASE_CONTENT, DATABASE_PORT);
    if ($conn->connect_error) {
        die("Connection has failed: " . $conn->connect_error);
    }
    $query = $conn->query($sql);
    $conn->close();
    if (!$update){
        if ($query){
            return  $query->fetch_array();
        }
        else{
            return null;
        }
    }
    else{
       return $query; 
    }
}
function jsonDecodedFromTextByRecnum($recnum){
    $sql = "SELECT * FROM content 
        WHERE  recnum = '$recnum'  LIMIT 1";
    $data = sqlArray($sql);
    $text = json_decode($data['text']);
    return $text;
}
function objectFromRecnum($recnum){
    $output = null;
    if ($recnum){
        $sql = "SELECT * FROM content 
            WHERE  recnum = $recnum  LIMIT 1";
        $conn = new mysqli(HOST, USER, PASS, DATABASE_CONTENT, DATABASE_PORT);
        if ($conn->connect_error) {
            die("Connection has failed: " . $conn->connect_error);
        }
        $query = $conn->query($sql);
        if ($query){
            $output =  $query->fetch_object();
        }
        else{
            $output = null;
        }
        $conn->close();
    }
    return $output;
}