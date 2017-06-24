<?php
require_once __DIR__ . '/config.php';

$value = $_REQUEST['db'];

$pdo = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuser, $dbpass);

$sql = "INSERT INTO dbdata (val, dt) VALUES (?, UTC_TIMESTAMP())";
$req = $pdo->prepare($sql);
$req->execute(array($value));
