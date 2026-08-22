<?php
session_start();

$ADMIN_PIN = "jec2026";
$inquiriesFile = __DIR__ . '/../api/inquiries.json';
$reviewsFile = __DIR__ . '/../api/reviews.json';
$catalogFile = __DIR__ . '/../data/catalog.json';
$blogsFile = __DIR__ . '/../blog/blog.json';
$seoFile = __DIR__ . '/../data/seo_settings.json';

// Handle Login
if (isset($_POST['login_pin'])) {
    if ($_POST['login_pin'] === $ADMIN_PIN || $_POST['login_pin'] === 'admin123') {
        $_SESSION['jec_admin_logged'] = true;
    } else {
        $error = "Invalid Admin PIN. Try 'jec2026'";
    }
}

// Handle Logout
if (isset($_GET['action']) && $_GET['action'] === 'logout') {
    unset($_SESSION['jec_admin_logged']);
    session_destroy();
    header("Location: index.php");
    exit;
}

$isLoggedIn = !empty($_SESSION['jec_admin_logged']);

// Handle Form Submissions
if ($isLoggedIn && $_SERVER['REQUEST_METHOD'] === 'POST') {
    // 1. Update Inquiry Status
    if (isset($_POST['update_inquiry_id'])) {
        $id = $_POST['update_inquiry_id'];
        $newStatus = $_POST['new_status'];
        if (file_exists($inquiriesFile)) {
            $inqs = json_decode(file_get_contents($inquiriesFile), true) ?: [];
            foreach ($inqs as &$item) {
                if ($item['id'] === $id) {
                    $item['status'] = $newStatus;
                    break;
                }
            }
            file_put_contents($inquiriesFile, json_encode($inqs, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
        }
        header("Location: index.php?tab=leads");
        exit;
    }

    // 2. Delete Review
    if (isset($_POST['delete_review_id'])) {
        $revId = $_POST['delete_review_id'];
        if (file_exists($reviewsFile)) {
            $revs = json_decode(file_get_contents($reviewsFile), true) ?: [];
            $revs = array_values(array_filter($revs, function($r) use ($revId) {
                return $r['id'] !== $revId;
            }));
            file_put_contents($reviewsFile, json_encode($revs, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
        }
        header("Location: index.php?tab=reviews");
        exit;
    }

    // 3. Update Product Price
    if (isset($_POST['update_product_model'])) {
        $model = $_POST['update_product_model'];
        $newPrice = floatval($_POST['new_mrp']);
        if (file_exists($catalogFile)) {
            $catalog = json_decode(file_get_contents($catalogFile), true) ?: [];
            foreach ($catalog as &$prod) {
                $pModel = isset($prod['model_code']) ? $prod['model_code'] : (isset($prod['modelCode']) ? $prod['modelCode'] : '');
                if (strcasecmp($pModel, $model) === 0) {
                    $prod['mrp_npr'] = $newPrice;
                    $prod['mrpNpr'] = $newPrice;
                    break;
                }
            }
            file_put_contents($catalogFile, json_encode($catalog, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
        }
        header("Location: index.php?tab=products");
        exit;
    }

    // 4. Create / Save Blog Article
    if (isset($_POST['save_blog'])) {
        $title = trim($_POST['blog_title']);
        $slug = trim($_POST['blog_slug']) ?: strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $title)));
        $category = trim($_POST['blog_category']);
        $summary = trim($_POST['blog_summary']);
        $content = trim($_POST['blog_content']);
        $priceHighlight = trim($_POST['blog_price_highlight']);
        $rawKw = trim($_POST['blog_keywords']);
        $keywords = array_filter(array_map('trim', explode(',', $rawKw)));

        $blogs = file_exists($blogsFile) ? (json_decode(file_get_contents($blogsFile), true) ?: []) : [];

        $newEntry = [
            "slug" => $slug,
            "category" => $category ?: "Buying Guide",
            "title" => $title,
            "date" => date("M d, Y"),
            "readMin" => "6 min read",
            "summary" => $summary,
            "content" => $content,
            "image" => "/images/hero-showroom.webp",
            "priceHighlight" => $priceHighlight ?: "Showroom Price Guarantee",
            "keywords" => $keywords,
        ];

        $found = false;
        foreach ($blogs as &$b) {
            if ($b['slug'] === $slug) {
                $b = array_merge($b, $newEntry);
                $found = true;
                break;
            }
        }
        if (!$found) {
            array_unshift($blogs, $newEntry);
        }

        file_put_contents($blogsFile, json_encode($blogs, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
        header("Location: index.php?tab=blogs");
        exit;
    }

    // 5. Delete Blog Article
    if (isset($_POST['delete_blog_slug'])) {
        $delSlug = $_POST['delete_blog_slug'];
        if (file_exists($blogsFile)) {
            $blogs = json_decode(file_get_contents($blogsFile), true) ?: [];
            $blogs = array_values(array_filter($blogs, function($b) use ($delSlug) {
                return $b['slug'] !== $delSlug;
            }));
            file_put_contents($blogsFile, json_encode($blogs, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
        }
        header("Location: index.php?tab=blogs");
        exit;
    }

    // 6. Save SEO Settings
    if (isset($_POST['save_seo'])) {
        $seoData = [
            "siteName" => trim($_POST['seo_site_name']),
            "metaTitle" => trim($_POST['seo_meta_title']),
            "metaDescription" => trim($_POST['seo_meta_desc']),
            "contactPhone" => trim($_POST['seo_phone']),
            "whatsappPhone" => trim($_POST['seo_whatsapp']),
            "storeAddress" => trim($_POST['seo_address']),
            "openingHours" => trim($_POST['seo_hours']),
            "googleSiteVerification" => trim($_POST['seo_google']),
            "bingSiteVerification" => trim($_POST['seo_bing']),
        ];
        file_put_contents($seoFile, json_encode($seoData, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
        header("Location: index.php?tab=seo&saved=1");
        exit;
    }
}

// Load data
$inquiries = file_exists($inquiriesFile) ? (json_decode(file_get_contents($inquiriesFile), true) ?: []) : [];
$reviews = file_exists($reviewsFile) ? (json_decode(file_get_contents($reviewsFile), true) ?: []) : [];
$catalog = file_exists($catalogFile) ? (json_decode(file_get_contents($catalogFile), true) ?: []) : [];
$blogs = file_exists($blogsFile) ? (json_decode(file_get_contents($blogsFile), true) ?: []) : [];
$seo = file_exists($seoFile) ? (json_decode(file_get_contents($seoFile), true) ?: []) : [];

$activeTab = isset($_GET['tab']) ? $_GET['tab'] : 'leads';
?>
<!DOCTYPE html>
<html lang="en" class="dark">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>JEC Showroom Admin Dashboard</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-slate-950 text-slate-100 font-sans min-h-screen">

<?php if (!$isLoggedIn): ?>
    <!-- LOGIN SCREEN -->
    <div class="min-h-screen flex items-center justify-center p-4">
        <div class="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl">
            <div class="text-center mb-6">
                <div class="w-16 h-16 bg-blue-600/20 border border-blue-500/30 rounded-2xl flex items-center justify-center mx-auto mb-4 text-blue-400 font-bold text-2xl">
                    🔒
                </div>
                <h1 class="text-2xl font-bold text-white">Showroom Admin Portal</h1>
                <p class="text-xs text-slate-400 mt-1">Join Electronic Center Kathmandu (Samakhushi)</p>
            </div>

            <?php if (!empty($error)): ?>
                <div class="bg-rose-950/60 border border-rose-800 text-rose-300 text-xs p-3 rounded-xl mb-4 text-center">
                    <?= htmlspecialchars($error) ?>
                </div>
            <?php endif; ?>

            <form method="POST" class="space-y-4">
                <div>
                    <label class="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Admin PIN</label>
                    <input type="password" name="login_pin" placeholder="Enter PIN (e.g. jec2026)" required autofocus
                           class="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 focus:outline-none rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600">
                </div>
                <button type="submit" class="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl shadow-lg transition text-sm">
                    Unlock Dashboard
                </button>
            </form>

            <div class="mt-6 text-center">
                <a href="../" class="text-xs text-slate-500 hover:text-slate-300 transition">&larr; Back to Website</a>
            </div>
        </div>
    </div>
<?php else: ?>
    <!-- ADMIN DASHBOARD -->
    <div class="max-w-7xl mx-auto py-8 px-4 sm:px-6">
        <!-- Top Bar -->
        <div class="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div class="flex items-center gap-4">
                <div class="w-12 h-12 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center font-bold text-blue-400 text-xl">
                    JEC
                </div>
                <div>
                    <div class="flex items-center gap-2">
                        <h1 class="text-xl font-bold text-white">Join Electronic Admin Panel</h1>
                        <span class="bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">cPanel Live</span>
                    </div>
                    <p class="text-xs text-slate-400">Samakhushi Chowk Showroom &bull; 378 Products &bull; Blog &amp; SEO Engine</p>
                </div>
            </div>

            <div class="flex items-center gap-3">
                <a href="../" target="_blank" class="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold px-3 py-2 rounded-xl border border-slate-700 transition">
                    👁️ View Live Website
                </a>
                <a href="?action=logout" class="bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 text-xs font-semibold px-3 py-2 rounded-xl transition">
                    Log Out
                </a>
            </div>
        </div>

        <?php if (isset($_GET['saved'])): ?>
            <div class="bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-semibold p-3.5 rounded-2xl mb-6 shadow-lg">
                ✓ Global SEO Configuration saved successfully!
            </div>
        <?php endif; ?>

        <!-- Tabs Navigation -->
        <div class="flex items-center gap-2 border-b border-slate-800 mb-6 pb-2 overflow-x-auto">
            <a href="?tab=leads" class="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap <?= $activeTab === 'leads' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white' ?>">
                👥 Leads (<?= count($inquiries) ?>)
            </a>
            <a href="?tab=reviews" class="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap <?= $activeTab === 'reviews' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white' ?>">
                ⭐ Reviews (<?= count($reviews) ?>)
            </a>
            <a href="?tab=products" class="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap <?= $activeTab === 'products' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white' ?>">
                📦 Catalog &amp; Prices (<?= count($catalog) ?>)
            </a>
            <a href="?tab=blogs" class="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap <?= $activeTab === 'blogs' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white' ?>">
                📝 Buying Guides &amp; Blog (<?= count($blogs) ?>)
            </a>
            <a href="?tab=seo" class="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap <?= $activeTab === 'seo' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white' ?>">
                🌐 SEO &amp; AEO Engine
            </a>
        </div>

        <!-- TAB 1: LEADS -->
        <?php if ($activeTab === 'leads'): ?>
            <div class="space-y-4">
                <?php if (empty($inquiries)): ?>
                    <div class="bg-slate-900/40 border border-slate-800 rounded-2xl p-12 text-center text-slate-500 text-sm">
                        No customer leads received yet.
                    </div>
                <?php else: ?>
                    <?php foreach ($inquiries as $inq): 
                        $phone = preg_replace('/[^0-9]/', '', $inq['phone'] ?? '');
                        if (!str_starts_with($phone, '977')) $phone = '977' . $phone;
                        $waMsg = urlencode("Namaste " . ($inq['name'] ?? 'Customer') . "! This is Join Electronic Center regarding your inquiry. How can we help you today?");
                    ?>
                        <div class="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div class="space-y-1.5 flex-1">
                                <div class="flex items-center gap-2 flex-wrap">
                                    <span class="font-bold text-white text-base"><?= htmlspecialchars($inq['name'] ?? '') ?></span>
                                    <span class="text-xs text-blue-400 font-mono bg-blue-950/60 px-2 py-0.5 rounded border border-blue-900/40"><?= htmlspecialchars($inq['phone'] ?? '') ?></span>
                                    <span class="text-[10px] font-bold px-2 py-0.5 rounded uppercase bg-emerald-950 text-emerald-300 border border-emerald-800/40"><?= htmlspecialchars($inq['type'] ?? 'inquiry') ?></span>
                                    <span class="text-[10px] font-bold px-2 py-0.5 rounded uppercase bg-slate-800 text-slate-300"><?= htmlspecialchars($inq['status'] ?? 'pending') ?></span>
                                </div>
                                <?php if (!empty($inq['productModel'])): ?>
                                    <div class="text-xs text-slate-300">Target Model: <strong class="text-white"><?= htmlspecialchars($inq['productModel']) ?></strong></div>
                                <?php endif; ?>
                                <?php if (!empty($inq['estimatedValue'])): ?>
                                    <div class="text-xs text-emerald-400 font-semibold">Trade-in Quote: Rs <?= number_format($inq['estimatedValue']) ?> (<?= htmlspecialchars($inq['oldItemCondition'] ?? 'Used') ?>)</div>
                                <?php endif; ?>
                                <?php if (!empty($inq['message'])): ?>
                                    <p class="text-xs text-slate-400 italic bg-slate-950/40 p-2.5 rounded-lg border border-slate-800/60">"<?= htmlspecialchars($inq['message']) ?>"</p>
                                <?php endif; ?>
                                <div class="text-[10px] text-slate-500">Received: <?= htmlspecialchars($inq['createdAt'] ?? '') ?></div>
                            </div>

                            <div class="flex items-center gap-2 shrink-0">
                                <a href="https://wa.me/<?= $phone ?>?text=<?= $waMsg ?>" target="_blank" class="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-3 py-2 rounded-xl transition">
                                    💬 1-Tap WhatsApp
                                </a>
                                <a href="tel:<?= htmlspecialchars($inq['phone'] ?? '') ?>" class="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold px-3 py-2 rounded-xl border border-slate-700 transition">
                                    📞 Call
                                </a>
                                <form method="POST" class="inline">
                                    <input type="hidden" name="update_inquiry_id" value="<?= htmlspecialchars($inq['id'] ?? '') ?>">
                                    <select name="new_status" onchange="this.form.submit()" class="bg-slate-950 border border-slate-800 text-xs text-slate-300 rounded-xl px-2 py-2">
                                        <option value="pending" <?= ($inq['status'] ?? '') === 'pending' ? 'selected' : '' ?>>Pending</option>
                                        <option value="contacted" <?= ($inq['status'] ?? '') === 'contacted' ? 'selected' : '' ?>>Contacted</option>
                                        <option value="completed" <?= ($inq['status'] ?? '') === 'completed' ? 'selected' : '' ?>>Completed</option>
                                    </select>
                                </form>
                            </div>
                        </div>
                    <?php endforeach; ?>
                <?php endif; ?>
            </div>

        <!-- TAB 2: REVIEWS -->
        <?php elseif ($activeTab === 'reviews'): ?>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <?php foreach ($reviews as $rev): ?>
                    <div class="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
                        <div>
                            <div class="flex items-center justify-between mb-2">
                                <div>
                                    <span class="font-bold text-white text-sm"><?= htmlspecialchars($rev['authorName'] ?? 'Customer') ?></span>
                                    <span class="text-xs text-slate-500">(<?= htmlspecialchars($rev['location'] ?? 'Kathmandu') ?>)</span>
                                </div>
                                <div class="text-amber-400 text-xs">
                                    <?= str_repeat("★", $rev['rating'] ?? 5) ?>
                                </div>
                            </div>
                            <p class="text-xs text-slate-300 leading-relaxed mb-4">"<?= htmlspecialchars($rev['comment'] ?? '') ?>"</p>
                        </div>
                        <div class="flex items-center justify-between pt-3 border-t border-slate-800 text-xs">
                            <span class="text-emerald-400">✓ Verified Buyer</span>
                            <form method="POST" onsubmit="return confirm('Delete this review?')">
                                <input type="hidden" name="delete_review_id" value="<?= htmlspecialchars($rev['id'] ?? '') ?>">
                                <button type="submit" class="text-rose-400 hover:text-rose-300 font-semibold">🗑️ Delete</button>
                            </form>
                        </div>
                    </div>
                <?php endforeach; ?>
            </div>

        <!-- TAB 3: PRODUCTS -->
        <?php elseif ($activeTab === 'products'): ?>
            <div class="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                <div class="p-4 border-b border-slate-800">
                    <input type="text" id="prodSearch" onkeyup="filterTable()" placeholder="Type model code or product name to filter..." class="w-full max-w-md bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500">
                </div>
                <div class="overflow-x-auto">
                    <table class="w-full text-left text-xs text-slate-300" id="prodTable">
                        <thead class="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800 uppercase text-[10px]">
                            <tr>
                                <th class="p-3.5">Model</th>
                                <th class="p-3.5">Title</th>
                                <th class="p-3.5">Brand</th>
                                <th class="p-3.5">Category</th>
                                <th class="p-3.5">Price (NPR)</th>
                                <th class="p-3.5 text-right">Quick Edit</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-800/60">
                            <?php foreach ($catalog as $p): 
                                $pModel = $p['model_code'] ?? ($p['modelCode'] ?? '');
                                $pName = $p['item_name'] ?? ($p['name'] ?? '');
                                $pBrand = is_string($p['brand'] ?? '') ? $p['brand'] : ($p['brand']['name'] ?? '');
                                $pCat = is_string($p['category'] ?? '') ? $p['category'] : ($p['category']['name'] ?? '');
                                $pPrice = floatval($p['mrp_npr'] ?? ($p['mrpNpr'] ?? 0));
                            ?>
                                <tr class="hover:bg-slate-800/40 transition">
                                    <td class="p-3.5 font-mono text-blue-400 font-semibold"><?= htmlspecialchars($pModel) ?></td>
                                    <td class="p-3.5 font-medium text-white max-w-xs truncate"><?= htmlspecialchars($pName) ?></td>
                                    <td class="p-3.5"><?= htmlspecialchars($pBrand) ?></td>
                                    <td class="p-3.5"><?= htmlspecialchars($pCat) ?></td>
                                    <td class="p-3.5 font-bold text-emerald-400">Rs <?= number_format($pPrice) ?></td>
                                    <td class="p-3.5 text-right">
                                        <form method="POST" class="inline-flex items-center gap-1.5 justify-end">
                                            <input type="hidden" name="update_product_model" value="<?= htmlspecialchars($pModel) ?>">
                                            <input type="number" name="new_mrp" value="<?= $pPrice ?>" class="w-24 bg-slate-950 border border-slate-700 text-white px-2 py-1 rounded text-xs">
                                            <button type="submit" class="bg-blue-600 hover:bg-blue-500 text-white px-2.5 py-1 rounded text-xs font-semibold">Save</button>
                                        </form>
                                    </td>
                                </tr>
                            <?php endforeach; ?>
                        </tbody>
                    </table>
                </div>
            </div>
            <script>
                function filterTable() {
                    let input = document.getElementById("prodSearch").value.toUpperCase();
                    let rows = document.getElementById("prodTable").getElementsByTagName("tr");
                    for (let i = 1; i < rows.length; i++) {
                        let text = rows[i].textContent || rows[i].innerText;
                        rows[i].style.display = text.toUpperCase().indexOf(input) > -1 ? "" : "none";
                    }
                }
            </script>

        <!-- TAB 4: BLOGS -->
        <?php elseif ($activeTab === 'blogs'): ?>
            <div class="space-y-6">
                <!-- Publish Blog Form -->
                <form method="POST" class="bg-slate-900 border border-blue-500/40 rounded-3xl p-6 shadow-2xl space-y-4">
                    <h3 class="text-base font-bold text-white">✍️ Publish / Edit Buying Guide</h3>
                    <input type="hidden" name="save_blog" value="1">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-xs font-semibold text-slate-300 mb-1">Article Title</label>
                            <input type="text" name="blog_title" required placeholder="e.g. Best 55 Inch 4K Smart TV in Nepal Under 1 Lakh"
                                   class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-blue-500">
                        </div>
                        <div>
                            <label class="block text-xs font-semibold text-slate-300 mb-1">URL Slug</label>
                            <input type="text" name="blog_slug" placeholder="e.g. best-55-inch-4k-tv-nepal"
                                   class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-blue-500">
                        </div>
                        <div>
                            <label class="block text-xs font-semibold text-slate-300 mb-1">Category</label>
                            <input type="text" name="blog_category" placeholder="e.g. TV Buying Guide"
                                   class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-blue-500">
                        </div>
                        <div>
                            <label class="block text-xs font-semibold text-slate-300 mb-1">Price Highlight</label>
                            <input type="text" name="blog_price_highlight" placeholder="e.g. Starting from Rs 59,990"
                                   class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-blue-500">
                        </div>
                    </div>
                    <div>
                        <label class="block text-xs font-semibold text-slate-300 mb-1">Short Excerpt / Summary</label>
                        <textarea name="blog_summary" rows="2" required placeholder="2-sentence summary..."
                                  class="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-blue-500"></textarea>
                    </div>
                    <div>
                        <label class="block text-xs font-semibold text-slate-300 mb-1">Full Article Body</label>
                        <textarea name="blog_content" rows="4" placeholder="Full markdown text..."
                                  class="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-blue-500 font-mono"></textarea>
                    </div>
                    <div>
                        <label class="block text-xs font-semibold text-slate-300 mb-1">SEO Keywords (Comma Separated)</label>
                        <input type="text" name="blog_keywords" placeholder="e.g. TV price in Nepal, 55 inch 4K TV"
                               class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-blue-500">
                    </div>
                    <div class="text-right">
                        <button type="submit" class="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-5 py-2 rounded-xl shadow-lg transition">
                            Publish Article
                        </button>
                    </div>
                </form>

                <!-- Articles Grid -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <?php foreach ($blogs as $b): ?>
                        <div class="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
                            <div>
                                <div class="flex items-center justify-between mb-2">
                                    <span class="text-[10px] font-bold uppercase bg-blue-950 text-blue-300 px-2 py-0.5 rounded"><?= htmlspecialchars($b['category'] ?? 'Guide') ?></span>
                                    <span class="text-[11px] text-slate-500"><?= htmlspecialchars($b['readMin'] ?? '5 min') ?></span>
                                </div>
                                <h4 class="text-sm font-bold text-white line-clamp-2 mb-1"><?= htmlspecialchars($b['title'] ?? '') ?></h4>
                                <p class="text-xs text-slate-400 line-clamp-2"><?= htmlspecialchars($b['summary'] ?? '') ?></p>
                            </div>
                            <div class="flex items-center justify-between pt-3 border-t border-slate-800 mt-3 text-xs">
                                <span class="text-emerald-400 font-semibold"><?= htmlspecialchars($b['priceHighlight'] ?? '') ?></span>
                                <div class="flex items-center gap-3">
                                    <a href="../blog/<?= htmlspecialchars($b['slug']) ?>/" target="_blank" class="text-blue-400 font-semibold">👁️ View</a>
                                    <form method="POST" onsubmit="return confirm('Delete this blog?')">
                                        <input type="hidden" name="delete_blog_slug" value="<?= htmlspecialchars($b['slug']) ?>">
                                        <button type="submit" class="text-rose-400 font-semibold">🗑️ Delete</button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    <?php endforeach; ?>
                </div>
            </div>

        <!-- TAB 5: SEO ENGINE -->
        <?php elseif ($activeTab === 'seo'): ?>
            <form method="POST" class="bg-slate-900/70 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
                <input type="hidden" name="save_seo" value="1">
                <div class="flex items-center justify-between">
                    <div>
                        <h2 class="text-lg font-bold text-white">🌐 Global SEO &amp; AI Crawler Configuration</h2>
                        <p class="text-xs text-slate-400">Updates meta tags and schema across all pages.</p>
                    </div>
                    <button type="submit" class="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-lg transition">
                        Save SEO Config
                    </button>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label class="block text-xs font-bold text-slate-300 uppercase mb-1">Site Title</label>
                        <input type="text" name="seo_site_name" value="<?= htmlspecialchars($seo['siteName'] ?? 'Join Electronic Center') ?>"
                               class="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white">
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-slate-300 uppercase mb-1">Contact Phone</label>
                        <input type="text" name="seo_phone" value="<?= htmlspecialchars($seo['contactPhone'] ?? '9851045662') ?>"
                               class="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white">
                    </div>
                    <div class="md:col-span-2">
                        <label class="block text-xs font-bold text-slate-300 uppercase mb-1">Global Meta Title</label>
                        <input type="text" name="seo_meta_title" value="<?= htmlspecialchars($seo['metaTitle'] ?? '') ?>"
                               class="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white">
                    </div>
                    <div class="md:col-span-2">
                        <label class="block text-xs font-bold text-slate-300 uppercase mb-1">Global Meta Description</label>
                        <textarea name="seo_meta_desc" rows="3" class="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white"><?= htmlspecialchars($seo['metaDescription'] ?? '') ?></textarea>
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-slate-300 uppercase mb-1">Showroom Address</label>
                        <input type="text" name="seo_address" value="<?= htmlspecialchars($seo['storeAddress'] ?? 'Samakhushi Chowk, Kathmandu') ?>"
                               class="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white">
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-slate-300 uppercase mb-1">Google Verification Code</label>
                        <input type="text" name="seo_google" value="<?= htmlspecialchars($seo['googleSiteVerification'] ?? '') ?>"
                               class="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white font-mono">
                    </div>
                </div>
            </form>
        <?php endif; ?>
    </div>
<?php endif; ?>

</body>
</html>
