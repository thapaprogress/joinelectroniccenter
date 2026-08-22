<?php
$slug = isset($_GET['slug']) ? trim($_GET['slug']) : '';
$blogsFile = __DIR__ . '/blog/blog.json';

if (empty($slug)) {
    header("Location: /blog/");
    exit;
}

$blogs = file_exists($blogsFile) ? (json_decode(file_get_contents($blogsFile), true) ?: []) : [];

$matchedBlog = null;
foreach ($blogs as $b) {
    if (strcasecmp($b['slug'], $slug) === 0) {
        $matchedBlog = $b;
        break;
    }
}

if (!$matchedBlog) {
    http_response_code(404);
    echo "<h1>404 - Buying Guide Not Found</h1><p><a href='/blog/'>&larr; Back to Buying Guides</a></p>";
    exit;
}

$title = htmlspecialchars($matchedBlog['title']);
$category = htmlspecialchars($matchedBlog['category'] ?? 'Buying Guide');
$summary = htmlspecialchars($matchedBlog['summary'] ?? '');
$content = nl2br(htmlspecialchars($matchedBlog['content'] ?? $summary));
$image = htmlspecialchars($matchedBlog['image'] ?? '/images/hero-showroom.webp');
$readMin = htmlspecialchars($matchedBlog['readMin'] ?? '5 min read');
$priceHighlight = htmlspecialchars($matchedBlog['priceHighlight'] ?? 'Showroom Deal');
$date = htmlspecialchars($matchedBlog['date'] ?? date("M d, Y"));
$keywords = is_array($matchedBlog['keywords'] ?? null) ? $matchedBlog['keywords'] : [];

$whatsappMsg = urlencode("Namaste Join Electronic Center! I just read your article '{$matchedBlog['title']}'. Please share current showroom prices and available stock.");
?>
<!DOCTYPE html>
<html lang="en" class="dark">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= $title ?> | Join Electronic Center Kathmandu</title>
    <meta name="description" content="<?= $summary ?>">
    <script src="https://cdn.tailwindcss.com"></script>
    <!-- Schema.org JSON-LD -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": "<?= addslashes($matchedBlog['title']) ?>",
      "description": "<?= addslashes($summary) ?>",
      "image": "https://joinelectroniccenter.com<?= $image ?>",
      "publisher": {
        "@type": "Organization",
        "name": "Join Electronic Center Kathmandu",
        "url": "https://joinelectroniccenter.com"
      }
    }
    </script>
</head>
<body class="bg-slate-950 text-slate-100 font-sans min-h-screen py-8 px-4 sm:px-6 lg:px-8">
    <div class="max-w-4xl mx-auto">
        <!-- Navigation -->
        <nav class="flex items-center gap-2 text-xs sm:text-sm text-slate-400 mb-6 flex-wrap">
            <a href="/" class="hover:text-white transition">&larr; Home</a>
            <span>/</span>
            <a href="/blog/" class="hover:text-white transition">Buying Guides</a>
            <span>/</span>
            <span class="text-blue-400 font-medium truncate max-w-xs"><?= $category ?></span>
        </nav>

        <!-- Article Card -->
        <article class="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-10 backdrop-blur-xl shadow-2xl overflow-hidden">
            <div class="flex items-center gap-3 mb-4 flex-wrap">
                <span class="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    <?= $category ?>
                </span>
                <span class="text-xs text-slate-400">📅 <?= $date ?></span>
                <span class="text-xs text-slate-400">⏱️ <?= $readMin ?></span>
            </div>

            <h1 class="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight mb-4">
                <?= $title ?>
            </h1>

            <?php if (!empty($priceHighlight)): ?>
                <div class="inline-flex items-center gap-2 bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 text-xs sm:text-sm font-semibold px-4 py-2 rounded-xl mb-6">
                    ✨ <?= $priceHighlight ?>
                </div>
            <?php endif; ?>

            <?php if (!empty($image)): ?>
                <div class="relative aspect-[16/9] w-full rounded-2xl overflow-hidden mb-8 border border-slate-800 bg-slate-950 flex items-center justify-center p-4">
                    <img src="<?= $image ?>" alt="<?= $title ?>" class="max-h-full max-w-full object-contain">
                </div>
            <?php endif; ?>

            <!-- Author info -->
            <div class="flex items-center justify-between py-4 border-y border-slate-800/80 mb-8 text-xs text-slate-400 flex-wrap gap-4">
                <div class="flex items-center gap-2.5">
                    <div class="w-9 h-9 rounded-full bg-blue-600/20 border border-blue-500/40 flex items-center justify-center font-bold text-blue-400 text-sm">
                        JEC
                    </div>
                    <div>
                        <span class="font-bold text-white block">Join Electronic Center Editorial</span>
                        <span>Samakhushi Chowk, Ring Road, Kathmandu (Estd. 2004)</span>
                    </div>
                </div>

                <a href="https://wa.me/9779851045662?text=<?= $whatsappMsg ?>" target="_blank" class="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-3.5 py-1.5 rounded-xl transition text-xs flex items-center gap-1.5 shadow">
                    💬 Inquire on WhatsApp
                </a>
            </div>

            <!-- Content Body -->
            <div class="text-slate-300 text-sm sm:text-base leading-relaxed space-y-5">
                <p class="text-base sm:text-lg font-medium text-slate-200 border-l-4 border-blue-500 pl-4 py-1 bg-slate-950/40 rounded-r-xl">
                    <?= $summary ?>
                </p>
                <div class="font-normal text-slate-300 space-y-4">
                    <?= $content ?>
                </div>
            </div>

            <!-- Keywords Tag Cloud -->
            <?php if (!empty($keywords)): ?>
                <div class="mt-8 pt-6 border-t border-slate-800">
                    <span class="text-xs font-semibold text-slate-400 block mb-2">Related Topics:</span>
                    <div class="flex flex-wrap gap-2">
                        <?php foreach ($keywords as $kw): ?>
                            <span class="text-xs text-slate-300 bg-slate-950 px-3 py-1 rounded-lg border border-slate-800">
                                🏷️ <?= htmlspecialchars($kw) ?>
                            </span>
                        <?php endforeach; ?>
                    </div>
                </div>
            <?php endif; ?>

            <!-- Showroom CTA Box -->
            <div class="mt-10 p-6 bg-gradient-to-r from-blue-900/40 via-slate-900 to-slate-950 border border-blue-500/30 rounded-2xl">
                <h3 class="text-lg font-bold text-white mb-2">Visit Join Electronic Center Kathmandu</h3>
                <p class="text-xs sm:text-sm text-slate-300 mb-4">
                    Visit our showroom at Samakhushi Chowk to inspect live demo units, claim up to <strong>Rs 8,000 old appliance exchange cashback</strong>, and enjoy <strong>0% EMI installments</strong> with free door-to-door delivery inside Kathmandu Valley.
                </p>
                <div class="flex flex-wrap gap-3">
                    <a href="https://wa.me/9779851045662?text=<?= $whatsappMsg ?>" target="_blank" class="bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold py-3 px-6 rounded-xl shadow-lg transition">
                        💬 WhatsApp Us (9851045662)
                    </a>
                    <a href="/#catalog" class="bg-slate-800 hover:bg-slate-700 text-white text-xs sm:text-sm font-semibold py-3 px-6 rounded-xl border border-slate-700 transition">
                        📦 Browse 378+ Live Products
                    </a>
                </div>
            </div>
        </article>
    </div>
</body>
</html>
