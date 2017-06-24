<?php
require_once __DIR__ . '/config.php';

$pdo = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuser, $dbpass);

$sql = "SELECT dt, val FROM dbdata ORDER BY id desc LIMIT 1";
$res = $pdo->query($sql);

$data = $res->fetch(PDO::FETCH_OBJ);

header('Content-type: application/json');
echo json_encode($data);
