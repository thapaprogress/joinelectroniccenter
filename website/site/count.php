<?php
header('Content-Type: application/json');
header('Cache-Control: no-store, max-age=0');
$dir = __DIR__ . '/data';
$file = $dir . '/visits.json';
if (!is_dir($dir)) { @mkdir($dir, 0755, true); }
$n = 0;
if (file_exists($file)) {
    $j = @json_decode(@file_get_contents($file), true);
    $n = (is_array($j) && isset($j['count'])) ? (int)$j['count'] : 0;
}
$n++;
@file_put_contents($file, json_encode(array('count' => $n)));
echo json_encode(array('value' => $n));