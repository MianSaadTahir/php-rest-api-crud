<?php
// config.php
// Database + common settings
$db_host = '127.0.0.1';
$db_name = 'product_management';
$db_user = 'root';
$db_pass = 'Saad03342241980-'; // set your password

// PDO DSN
$dsn = "mysql:host=$db_host;dbname=$db_name;charset=utf8mb4";

$options = [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
];
