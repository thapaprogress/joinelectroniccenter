import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getAllCategories, getProductsByCategory } from "@/lib/products";
import { formatPriceNPR, getBrandName, calculateDarazDiscount } from "@/lib/formatters";
import { ArrowLeft, Star, ShoppingBag, ShieldCheck, RefreshCw, MessageCircle } from "lucide-react";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const categories = await getAllCategories();
  return categories.map((c) => ({
    slug: c.slug,
  }));
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const categories = await getAllCategories();
  const cat = categories.find((c) => c.slug.toLowerCase() === slug.toLowerCase());

  if (!cat) {
    return {
      title: "Category Not Found | Join Electronic Center Kathmandu",
    };
  }

  const title = `${cat.name} Price in Nepal 2026 - Best Deals & Exchange | Join Electronic Center`;
  const description = `Explore ${cat.count}+ certified ${cat.name} models in Kathmandu with official brand warranty. Lowest prices vs Daraz, 0% Credit Card EMI, Old Appliance Exchange up to Rs 8,000 off, and Free Valley Delivery at Samakhushi Chowk showroom.`;

  return {
    title,
    description,
    alternates: {
      canonical: `https://joinelectroniccenter.com/category/${cat.slug}`,
    },
    openGraph: {
      title,
      description,
      url: `https://joinelectroniccenter.com/category/${cat.slug}`,
      siteName: "Join Electronic Center Kathmandu",
      images: [
        {
          url: "/images/hero-showroom.jpg",
          width: 1200,
          height: 630,
          alt: `${cat.name} showroom Kathmandu`,
        },
      ],
      type: "website",
    },
  };
}

export default async function CategoryListingPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const categories = await getAllCategories();
  const cat = categories.find((c) => c.slug.toLowerCase() === slug.toLowerCase());

  if (!cat) {
    notFound();
  }

  const products = await getProductsByCategory(slug);

  // Schema.org ItemList JSON-LD
  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": `${cat.name} Catalog Kathmandu`,
    "description": `Browse ${products.length} models of ${cat.name} at Join Electronic Center Kathmandu.`,
    "numberOfItems": products.length,
    "itemListElement": products.slice(0, 30).map((p, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": p.name,
      "url": `https://joinelectroniccenter.com/product/${p.slug}`,
      "image": p.photoPath ? `https://joinelectroniccenter.com${p.photoPath}` : undefined,
    })),
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      {/* Inject ItemList Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />

      <div className="max-w-7xl mx-auto">
        {/* Navigation */}
        <nav className="flex items-center gap-2 text-sm text-slate-400 mb-6">
          <Link href="/" className="hover:text-white flex items-center gap-1 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Home
          </Link>
          <span>/</span>
          <span className="text-blue-400 font-medium">{cat.name}</span>
        </nav>

        {/* Header Banner */}
        <div className="bg-gradient-to-r from-blue-900/40 via-slate-900/60 to-slate-950 border border-slate-800 rounded-2xl p-6 sm:p-8 mb-8">
          <div className="max-w-3xl">
            <span className="text-xs font-bold text-blue-400 uppercase tracking-widest bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
              {cat.count} Available Showroom Models
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-3 mb-3">
              {cat.name} Price in Nepal
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Explore authentic {cat.name.toLowerCase()} from Samsung, Whirlpool, Skyworth, Himstar, Panasonic, and more. Enjoy guaranteed showroom discounts vs Daraz, old appliance exchange bonus, 0% EMI installments, and free door-to-door delivery inside Kathmandu Valley.
            </p>
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => {
            const brand = getBrandName(product.brand);
            const discount = calculateDarazDiscount(product.mrpNpr);

            return (
              <div
                key={product.id}
                className="bg-slate-900/70 border border-slate-800 rounded-2xl overflow-hidden flex flex-col justify-between hover:border-blue-500/40 transition-all duration-300 group hover:-translate-y-1 shadow-lg"
              >
                <div>
                  {/* Image Box */}
                  <Link href={`/product/${product.slug}`} className="block relative aspect-square bg-slate-950 p-4 overflow-hidden">
                    <span className="absolute top-3 left-3 z-10 bg-slate-800/90 text-white text-[11px] font-bold px-2 py-0.5 rounded-md border border-slate-700">
                      {brand}
                    </span>
                    <span className="absolute top-3 right-3 z-10 bg-emerald-500/20 text-emerald-300 text-[11px] font-bold px-2 py-0.5 rounded-md border border-emerald-500/30">
                      Save Rs {discount.savings.toLocaleString("en-IN")}
                    </span>

                    <Image
                      src={product.photoPath || "/images/placeholder-appliance.jpg"}
                      alt={product.name}
                      fill
                      className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    />
                  </Link>

                  {/* Body Info */}
                  <div className="p-4">
                    <span className="text-[11px] font-mono text-slate-400">Model: {product.modelCode}</span>
                    <Link href={`/product/${product.slug}`}>
                      <h3 className="text-sm font-bold text-white line-clamp-2 mt-1 mb-2 group-hover:text-blue-400 transition-colors">
                        {product.name}
                      </h3>
                    </Link>

                    {/* Price */}
                    <div className="flex items-baseline gap-2 mb-3">
                      <span className="text-lg font-extrabold text-white font-mono">
                        {formatPriceNPR(product.mrpNpr)}
                      </span>
                      <span className="text-xs text-slate-500 line-through font-mono">
                        {formatPriceNPR(discount.darazPrice)}
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mb-2">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{product.warranty || "1-Yr Warranty"} • Free Delivery</span>
                    </div>
                  </div>
                </div>

                {/* Card Bottom CTA */}
                <div className="p-4 pt-0">
                  <Link
                    href={`/product/${product.slug}`}
                    className="w-full flex items-center justify-center gap-1.5 bg-blue-600/90 hover:bg-blue-600 text-white text-xs font-bold py-2.5 rounded-xl transition-colors"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>View Showroom Details</span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
