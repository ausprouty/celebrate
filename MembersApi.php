<?php

 

$conn = new mysqli("localhost:8306", "vuejs", "ViewJs2019", "vuejs");
 
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
 
$out = array('error' => false);
 
$crud = 'read';
 
if(isset($_GET['crud'])){
	$crud = $_GET['crud'];
}
 
 
if($crud = 'read'){
	$sql = "select * from members";
	$query = $conn->query($sql);
	$members = array();
 
	while($row = $query->fetch_array()){
		array_push($members, $row);
	}
 
	$out['members'] = $members;
}

if($crud == 'create'){
 
	$firstname = $_POST['firstname'];
	$lastname = $_POST['lastname'];
 
	$sql = "insert into members (firstname, lastname) values ('$firstname', '$lastname')";
	$query = $conn->query($sql);
 
	if($query){
		$out['message'] = "Member Added Successfully";
	}
	else{
		$out['error'] = true;
		$out['message'] = "Could not add Member";
	}

	$filename = "c:\\Vue2019\\debug.txt";
	$content = 'I was here';
	$fh = fopen($filename, 'w');
	fwrite($fh, $content);
	fclose($fh);
 
}
 
$conn->close();

 
header("Content-type: application/json");
echo json_encode($out);
die();
 
 
?>