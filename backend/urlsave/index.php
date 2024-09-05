<?php
header('Content-Type: application/json');

$data = $_POST["url"];
$json = array();
$json['url'] = $_POST["url"];
$json['result'] = $_POST["result"];
$json['fecha'] = $_POST["date"];

$inp = file_get_contents('urls.json');
$tempArray = json_decode($inp, true);
array_push($tempArray, $json);
$jsonData = json_encode($tempArray);
file_put_contents('urls.json', $jsonData);

$ret = [
    'result' => 'ok',
];
print json_encode($ret);
