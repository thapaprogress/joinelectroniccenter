<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$logFile = __DIR__ . '/inquiries.json';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (file_exists($logFile)) {
        $data = json_decode(file_get_contents($logFile), true);
        echo json_encode(["success" => true, "inquiries" => $data ?: []]);
    } else {
        echo json_encode(["success" => true, "inquiries" => []]);
    }
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = file_get_contents("php://input");
    $data = json_decode($input, true);

    if (!$data) {
        $data = $_POST;
    }

    $name = isset($data['name']) ? trim($data['name']) : '';
    $phone = isset($data['phone']) ? trim($data['phone']) : '';
    $message = isset($data['message']) ? trim($data['message']) : '';
    $productModel = isset($data['productModel']) ? trim($data['productModel']) : '';
    $type = isset($data['type']) ? trim($data['type']) : 'general';
    $estimatedValue = isset($data['estimatedValue']) ? floatval($data['estimatedValue']) : 0;

    if (empty($name) || empty($phone)) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Name and phone number are required."]);
        exit;
    }

    $newEntry = [
        "id" => "inq_" . uniqid(),
        "name" => $name,
        "phone" => $phone,
        "message" => $message,
        "productModel" => $productModel,
        "type" => $type,
        "estimatedValue" => $estimatedValue,
        "createdAt" => date("c"),
        "status" => "pending"
    ];

    $currentEntries = [];
    if (file_exists($logFile)) {
        $currentEntries = json_decode(file_get_contents($logFile), true) ?: [];
    }

    array_unshift($currentEntries, $newEntry);
    file_put_contents($logFile, json_encode($currentEntries, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

    // Send email alert to showroom if mail() is enabled
    $to = "joinelectroniccenter@gmail.com";
    $subject = "🔥 New Lead: " . ucfirst($type) . " Inquiry from " . $name;
    $body = "New Inquiry Details:\n\n" .
            "Name: " . $name . "\n" .
            "Phone: " . $phone . "\n" .
            "Type: " . $type . "\n" .
            "Model: " . $productModel . "\n" .
            "Estimated Value: Rs " . number_format($estimatedValue) . "\n" .
            "Message: " . $message . "\n" .
            "Time: " . date("Y-m-d H:i:s") . "\n";
    $headers = "From: no-reply@joinelectroniccenter.com\r\n";
    @mail($to, $subject, $body, $headers);

    echo json_encode([
        "success" => true,
        "message" => "Inquiry received successfully. Showroom team will contact you shortly.",
        "inquiry" => $newEntry
    ]);
    exit;
}

http_response_code(405);
echo json_encode(["success" => false, "message" => "Method not allowed"]);
