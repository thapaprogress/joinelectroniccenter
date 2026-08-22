<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$reviewsFile = __DIR__ . '/reviews.json';

// Initialize default seed reviews if empty
if (!file_exists($reviewsFile)) {
    $seedReviews = [
        [
            "id" => "rev_seed_1",
            "modelCode" => "ALL",
            "authorName" => "Bikash Shrestha",
            "location" => "Samakhushi, Kathmandu",
            "rating" => 5,
            "title" => "Genuine product with same day delivery",
            "comment" => "Bought this directly from the Samakhushi showroom. Received original brand warranty card and they delivered to my house within 3 hours. Great exchange price for my old TV too!",
            "createdAt" => "2026-02-15T10:30:00Z",
            "verified" => true
        ],
        [
            "id" => "rev_seed_2",
            "modelCode" => "ALL",
            "authorName" => "Anjali KC",
            "location" => "Baluwatar, Kathmandu",
            "rating" => 5,
            "title" => "Best price compared to Daraz",
            "comment" => "Saved over Rs 3,500 compared to online shopping platforms. Plus the staff demonstrated all features at the store before packing. Highly recommended for genuine home appliances.",
            "createdAt" => "2026-02-10T14:20:00Z",
            "verified" => true
        ],
        [
            "id" => "rev_seed_3",
            "modelCode" => "ALL",
            "authorName" => "Ramesh Maharjan",
            "location" => "Patan, Lalitpur",
            "rating" => 4,
            "title" => "Smooth 0% EMI process",
            "comment" => "Got this on 12-month credit card EMI through Nabil bank. Very helpful staff and transparent pricing without hidden fees.",
            "createdAt" => "2026-02-01T09:15:00Z",
            "verified" => true
        ]
    ];
    file_put_contents($reviewsFile, json_encode($seedReviews, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $modelCode = isset($_GET['modelCode']) ? trim($_GET['modelCode']) : '';
    $allReviews = json_decode(file_get_contents($reviewsFile), true) ?: [];

    if (!empty($modelCode)) {
        $filtered = array_values(array_filter($allReviews, function($r) use ($modelCode) {
            return $r['modelCode'] === 'ALL' || strcasecmp($r['modelCode'], $modelCode) === 0;
        }));
    } else {
        $filtered = $allReviews;
    }

    $count = count($filtered);
    $totalRating = array_reduce($filtered, function($acc, $item) { return $acc + $item['rating']; }, 0);
    $avg = $count > 0 ? round($totalRating / $count, 1) : 4.9;

    echo json_encode([
        "success" => true,
        "reviews" => $filtered,
        "count" => $count,
        "averageRating" => $avg
    ]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = file_get_contents("php://input");
    $data = json_decode($input, true);

    if (!$data) {
        $data = $_POST;
    }

    $authorName = isset($data['authorName']) ? trim($data['authorName']) : '';
    $modelCode = isset($data['modelCode']) ? trim($data['modelCode']) : 'GENERAL';
    $location = isset($data['location']) ? trim($data['location']) : 'Kathmandu';
    $rating = isset($data['rating']) ? intval($data['rating']) : 5;
    $comment = isset($data['comment']) ? trim($data['comment']) : '';

    if (empty($authorName) || empty($comment)) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Author name and comment are required."]);
        exit;
    }

    $newReview = [
        "id" => "rev_" . uniqid(),
        "modelCode" => $modelCode,
        "authorName" => $authorName,
        "location" => $location,
        "rating" => max(1, min(5, $rating)),
        "title" => "Verified Showroom Buyer",
        "comment" => $comment,
        "createdAt" => date("c"),
        "verified" => true
    ];

    $allReviews = json_decode(file_get_contents($reviewsFile), true) ?: [];
    array_unshift($allReviews, $newReview);
    file_put_contents($reviewsFile, json_encode($allReviews, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

    echo json_encode([
        "success" => true,
        "message" => "Review submitted successfully.",
        "review" => $newReview
    ]);
    exit;
}

http_response_code(405);
echo json_encode(["success" => false, "message" => "Method not allowed"]);
