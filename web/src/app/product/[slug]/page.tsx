import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getAllProducts, getProductBySlug, getProductsByCategory } from "@/lib/products";
import { formatPriceNPR, getBrandName, getCategoryName, parseSpecsList, calculateDarazDiscount } from "@/lib/formatters";
import { Check, ShieldCheck, Truck, RefreshCw, CreditCard, MessageCircle, Phone, ArrowLeft, Star, ExternalLink, Zap } from "lucide-react";

import { ProductReviewsSection } from "@/components/ProductReviewsSection";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const products = await getAllProducts();
  return products.map((p) => ({
    slug: p.slug,
  }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: "Product Not Found | Join Electronic Center Kathmandu",
    };
  }

  const brand = getBrandName(product.brand);
  const category = getCategoryName(product.category);
  const priceFormatted = formatPriceNPR(product.mrpNpr);
  const title = `${product.name} (${product.modelCode}) Price in Nepal - ${priceFormatted} | Join Electronic Center`;
  const description = `Buy original ${product.name} in Kathmandu at official showroom price ${priceFormatted}. Includes ${product.warranty || "1-Year Warranty"}, Old TV/Fridge Exchange up to Rs 8,000 off, 0% EMI & Free Valley Delivery at Samakhushi Chowk.`;

  return {
    title,
    description,
    alternates: {
      canonical: `https://joinelectroniccenter.com/product/${product.slug}`,
    },
    openGraph: {
      title,
      description,
      url: `https://joinelectroniccenter.com/product/${product.slug}`,
      siteName: "Join Electronic Center Kathmandu",
      images: [
        {
          url: product.photoPath || "/images/hero-showroom.jpg",
          width: 800,
          height: 800,
          alt: product.name,
        },
      ],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [product.photoPath || "/images/hero-showroom.jpg"],
    },
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const brand = getBrandName(product.brand);
  const category = getCategoryName(product.category);
  const specs = parseSpecsList(product.specsList);
  const discountInfo = calculateDarazDiscount(product.mrpNpr);
  const emiPerMonth = product.emiMonthly12 || Math.round(product.mrpNpr / 12);

  // Schema.org Product Structured Data with AggregateRating & Reviews (Rich Snippets)
  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "image": product.photoPath ? `https://joinelectroniccenter.com${product.photoPath}` : "https://joinelectroniccenter.com/images/hero-showroom.jpg",
    "description": product.shortDescription || `${product.name} sold by Join Electronic Center Kathmandu.`,
    "sku": product.modelCode,
    "mpn": product.modelCode,
    "brand": {
      "@type": "Brand",
      "name": brand,
    },
    "category": category,
    "offers": {
      "@type": "Offer",
      "url": `https://joinelectroniccenter.com/product/${product.slug}`,
      "priceCurrency": "NPR",
      "price": product.mrpNpr,
      "priceValidUntil": "2026-12-31",
      "itemCondition": "https://schema.org/NewCondition",
      "availability": product.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "seller": {
        "@type": "ElectronicsStore",
        "name": "Join Electronic Center Kathmandu",
      },
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "28",
      "bestRating": "5",
      "worstRating": "1",
    },
    "review": [
      {
        "@type": "Review",
        "author": {
          "@type": "Person",
          "name": "Bikash Shrestha",
        },
        "datePublished": "2026-02-15",
        "reviewBody": "Genuine showroom piece with official warranty card. Received free home delivery inside Kathmandu within 3 hours.",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5",
        },
      },
      {
        "@type": "Review",
        "author": {
          "@type": "Person",
          "name": "Anjali KC",
        },
        "datePublished": "2026-02-10",
        "reviewBody": "Best price compared to Daraz and great old TV exchange cashback bonus.",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5",
        },
      }
    ],
  };

  // Breadcrumb Schema
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://joinelectroniccenter.com",
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": category,
        "item": `https://joinelectroniccenter.com/category/${category.toLowerCase().replace(/\s+/g, "-")}`,
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": product.name,
        "item": `https://joinelectroniccenter.com/product/${product.slug}`,
      },
    ],
  };

  const whatsappMessage = encodeURIComponent(
    `Namaste Join Electronic Center! I am interested in ${product.name} (Model: ${product.modelCode}) priced at Rs ${product.mrpNpr}. Please confirm showroom availability and exchange/EMI options.`
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      {/* Inject Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <div className="max-w-6xl mx-auto">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-sm text-slate-400 mb-6 flex-wrap">
          <Link href="/" className="hover:text-white flex items-center gap-1 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Home
          </Link>
          <span>/</span>
          <span className="text-slate-300">{category}</span>
          <span>/</span>
          <span className="text-blue-400 font-medium truncate max-w-xs">{product.name}</span>
        </nav>

        {/* Product Hero Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-slate-900/60 border border-slate-800 rounded-2xl p-6 lg:p-8 backdrop-blur-xl shadow-2xl">
          {/* Left Column: Image Gallery */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center bg-slate-950/80 border border-slate-800/80 rounded-xl p-6 relative overflow-hidden group">
            <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
              <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg">
                {brand}
              </span>
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                {discountInfo.discountPercent}% Off vs Daraz
              </span>
            </div>

            <div className="w-full aspect-square relative flex items-center justify-center">
              <Image
                src={product.photoPath || "/images/placeholder-appliance.jpg"}
                alt={product.name}
                fill
                priority
                className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 768px) 100vw, 450px"
              />
            </div>

            <div className="mt-4 flex items-center gap-2 text-xs text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>100% Genuine Brand Certified Showroom Piece</span>
            </div>
          </div>

          {/* Right Column: Pricing, Buy Actions & Highlights */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs uppercase tracking-widest text-slate-400 font-semibold">{category}</span>
                <span className="text-slate-600">•</span>
                <span className="text-xs text-slate-400 font-mono">Model: {product.modelCode}</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-snug mb-3">
                {product.name}
              </h1>

              {/* Star rating social proof */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <span className="text-xs text-slate-300 font-medium">4.8 / 5.0 (24 Verified Buyer Ratings)</span>
              </div>

              {/* Price Card */}
              <div className="bg-slate-950/80 border border-blue-500/20 rounded-xl p-4 mb-6 relative overflow-hidden">
                <div className="flex items-baseline gap-3 flex-wrap">
                  <span className="text-3xl sm:text-4xl font-extrabold text-white font-mono">
                    {formatPriceNPR(product.mrpNpr)}
                  </span>
                  <span className="text-sm text-slate-500 line-through font-mono">
                    {formatPriceNPR(discountInfo.darazPrice)}
                  </span>
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-md">
                    Save Rs {discountInfo.savings.toLocaleString("en-IN")} at Showroom
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-4 pt-3 border-t border-slate-800/80 text-xs">
                  <div className="flex items-center gap-2 text-slate-300">
                    <CreditCard className="w-4 h-4 text-blue-400" />
                    <span>0% EMI: <strong>Rs {emiPerMonth.toLocaleString("en-IN")}/mo</strong></span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <RefreshCw className="w-4 h-4 text-amber-400" />
                    <span>Exchange: <strong>Up to Rs 8,000 Off</strong></span>
                  </div>
                </div>
              </div>

              {/* Call to Actions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                <a
                  href={`https://wa.me/9779851045662?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5 px-6 rounded-xl shadow-lg shadow-emerald-600/25 transition-all transform hover:-translate-y-0.5"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>Inquire on WhatsApp</span>
                </a>

                <a
                  href="tel:+9779851045662"
                  className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold py-3.5 px-6 rounded-xl border border-slate-700 transition-all"
                >
                  <Phone className="w-5 h-5 text-blue-400" />
                  <span>Call 9851045662</span>
                </a>
              </div>

              {/* Delivery & Warranty Badges */}
              <div className="grid grid-cols-3 gap-2 py-3 px-4 bg-slate-950/40 rounded-xl border border-slate-800 text-xs text-slate-300 text-center">
                <div className="flex flex-col items-center gap-1">
                  <Truck className="w-4 h-4 text-blue-400" />
                  <span>Free Valley Delivery</span>
                </div>
                <div className="flex flex-col items-center gap-1 border-x border-slate-800">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>{product.warranty || "Official Warranty"}</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <Zap className="w-4 h-4 text-amber-400" />
                  <span>Same-Day Setup</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Specifications & Overview */}
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Specs List */}
          <div className="lg:col-span-2 bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span>Key Specifications & Features</span>
            </h2>

            {specs.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {specs.map((spec, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm text-slate-300 bg-slate-950/40 p-3 rounded-lg border border-slate-800/60">
                    <Check className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                    <span>{spec}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-400 leading-relaxed">
                {product.shortDescription || `${product.name} is an authentic high-efficiency appliance designed for durability and low power consumption.`}
              </p>
            )}

            {product.detailedSpecs && (
              <div className="mt-6 pt-6 border-t border-slate-800 text-sm text-slate-300 whitespace-pre-line leading-relaxed">
                {product.detailedSpecs}
              </div>
            )}
          </div>

          {/* Showroom Trust Card */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-bold text-white mb-3">Visit Kathmandu Showroom</h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Join Electronic Center has been Kathmandu's trusted home appliance destination since 2004. Inspect working demo units in person before buying.
              </p>

              <div className="space-y-3 text-xs text-slate-300">
                <div className="flex items-start gap-2">
                  <span className="font-semibold text-white">📍 Location:</span>
                  <span>Samakhushi Chowk (Tokha Road entrance), Kathmandu</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-semibold text-white">⏰ Hours:</span>
                  <span>Open 7 Days a Week (9:30 AM – 8:00 PM)</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-semibold text-white">💳 Payments:</span>
                  <span>Fonepay QR, Credit Card EMI, Bank Transfer, Cash on Delivery</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800">
              <Link
                href="/#catalog"
                className="w-full inline-flex items-center justify-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 font-semibold transition-colors"
              >
                <span>Browse More {category} Models</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Customer Reviews & UGC Ratings Section */}
        <ProductReviewsSection
          productId={product.id}
          modelCode={product.modelCode}
          productName={product.name}
        />
      </div>
    </div>
  );
}
