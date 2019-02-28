<?php

$host = "localhost";    /* Host name */
$user = "vuejs";         /* User */
$password = "ViewJs2019";         /* Password */
$dbname = "vuejs";   /* Database name */

// Create connection
$con = mysqli_connect($host, $user, $password,$dbname);

// Check connection
if (!$con) {
    die("Connection failed: " . mysqli_connect_error());
}
