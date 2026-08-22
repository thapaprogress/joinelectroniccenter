"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { trackEvent } from "@/lib/track-client";
import { Search, Filter, RefreshCw, ShoppingBag, Eye, MessageCircle, SlidersHorizontal, Check, Star } from "lucide-react";

interface CatalogSectionProps {
  selectedBrand: string;
  onSelectBrand: (brand: string) => void;
  onSelectProduct: (product: any) => void;
  onOpenExchange: () => void;
}

const CATEGORIES = [
  "All Categories",
  "Television",
  "Refrigerator",
  "Washing Machine",
  "Air Conditioner",
  "Air Cooler",
  "Chest Freezer",
  "Water Purifier",
  "Microwave & Kitchen",
];

export function CatalogSection({
  selectedBrand,
  onSelectBrand,
  onSelectProduct,
  onOpenExchange,
}: CatalogSectionProps) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [maxPrice, setMaxPrice] = useState(350000);
  const [sortBy, setSortBy] = useState("featured");
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  // Fetch products from Prisma API with fallback to static /data/catalog.json
  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (search) queryParams.set("search", search);
        if (selectedBrand) queryParams.set("brand", selectedBrand);
        if (selectedCategory && selectedCategory !== "All Categories") {
          queryParams.set("category", selectedCategory);
        }
        if (maxPrice < 350000) queryParams.set("maxPrice", String(maxPrice));
        if (sortBy) queryParams.set("sort", sortBy);
        queryParams.set("limit", "60");

        try {
          const res = await fetch(`/api/products?${queryParams.toString()}`);
          if (res.ok) {
            const data = await res.json();
            if (data.success && data.products?.length > 0) {
              setProducts(data.products || []);
              setTotalCount(data.total || 0);
              setLoading(false);
              return;
            }
          }
        } catch {
          // Fall through to static JSON fallback
        }

        // Static fallback for cPanel / DirectAdmin static export
        const staticRes = await fetch("/data/catalog.json");
        const allItems: any[] = await staticRes.json();
        
        let filtered = allItems.map((item, index) => {
          const rawPhoto = item.photo_path || item.photoPath || "";
          const cleanPhoto = rawPhoto ? rawPhoto.replace(/\\/g, "/") : "";
          const photoPath = cleanPhoto ? (cleanPhoto.startsWith("/") ? cleanPhoto : `/${cleanPhoto}`) : "";

          const brandName = typeof item.brand === "string" ? item.brand : (item.brand?.name || "Join Electronic");
          const catName = typeof item.category === "string" ? item.category : (item.category?.name || "Appliance");
          const mrp = Number(item.mrp_npr || item.mrpNpr || item.mrp || 0);

          return {
            id: item.id || item.slug || `prod-${index}`,
            name: item.product_name || item.name || `${brandName} ${catName}`,
            modelCode: item.model_code || item.modelCode || "JEC-ITEM",
            brand: { name: brandName, slug: brandName.toLowerCase() },
            category: { name: catName, slug: catName.toLowerCase() },
            mrpNpr: mrp,
            photoPath: photoPath,
            hasLocalPhoto: Boolean(item.has_local_photo || item.hasLocalPhoto || photoPath),
            imageUrl: photoPath || item.image_url || item.imageUrl || "/images/hero-showroom.jpg",
            shortDescription: item.short_description || item.shortDescription || "",
            detailedSpecs: item.detailed_specs || item.detailedSpecs || "",
            warranty: item.warranty || "1 Year Official Brand Warranty",
            specsList: Array.isArray(item.specs_list) ? item.specs_list : (Array.isArray(item.specs) ? item.specs : (item.specsList || [])),
            emiMonthly12: item.emi_monthly_12 || item.emiMonthly12 || (mrp > 0 ? Math.round((mrp / 12) * 1.08) : null),
            slug: item.slug || item.model_code || `product-${index}`,
          };
        });

        if (selectedBrand) {
          filtered = filtered.filter((p) => p.brand?.name?.toLowerCase() === selectedBrand.toLowerCase());
        }
        if (selectedCategory && selectedCategory !== "All Categories") {
          filtered = filtered.filter((p) => p.category?.name?.toLowerCase() === selectedCategory.toLowerCase());
        }
        if (search) {
          const s = search.toLowerCase();
          filtered = filtered.filter((p) => 
            p.name?.toLowerCase().includes(s) || 
            p.modelCode?.toLowerCase().includes(s) || 
            p.brand?.name?.toLowerCase().includes(s) ||
            p.category?.name?.toLowerCase().includes(s)
          );
        }
        if (maxPrice < 350000) {
          filtered = filtered.filter((p) => p.mrpNpr <= maxPrice);
        }

        if (sortBy === "price-asc") {
          filtered.sort((a, b) => a.mrpNpr - b.mrpNpr);
        } else if (sortBy === "price-desc") {
          filtered.sort((a, b) => b.mrpNpr - a.mrpNpr);
        } else if (sortBy === "name-asc") {
          filtered.sort((a, b) => a.name.localeCompare(b.name));
        }

        setProducts(filtered.slice(0, 80));
        setTotalCount(filtered.length);
      } catch (err) {
        console.error("Failed to load catalog:", err);
      } finally {
        setLoading(false);
      }
    }

    const timer = setTimeout(() => {
      fetchProducts();
    }, 250);

    return () => clearTimeout(timer);
  }, [search, selectedBrand, selectedCategory, maxPrice, sortBy]);

  const whatsapp = "9779851045662";

  return (
    <section id="catalog" className="py-16 bg-slate-950/95 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header with Search */}
        <div className="space-y-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2 text-blue-400 text-xs font-bold uppercase tracking-wider mb-1">
                <ShoppingBag className="w-4 h-4" />
                <span>Live Appliance Inventory ({totalCount} Available)</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-white">
                Browse Complete <span className="text-gradient-blue">Store Catalog</span>
              </h2>
            </div>

            {/* Quick stats / active filter badge */}
            <div className="flex items-center space-x-2">
              {(selectedBrand || selectedCategory !== "All Categories" || search) && (
                <button
                  onClick={() => {
                    setSearch("");
                    onSelectBrand("");
                    setSelectedCategory("All Categories");
                    setMaxPrice(350000);
                  }}
                  className="text-xs px-3 py-1.5 rounded-lg bg-red-500/20 text-red-300 hover:bg-red-500/30 transition border border-red-500/30 cursor-pointer"
                >
                  Reset All Filters
                </button>
              )}
            </div>
          </div>

          {/* Search Bar & Primary Controls */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-center">
            {/* Search Input */}
            <div className="lg:col-span-6 relative">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by model code (e.g. AU12NSWAC), name, or brand..."
                className="w-full bg-slate-900/90 border border-slate-700/80 rounded-2xl pl-12 pr-4 py-3.5 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition shadow-inner"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Sort Select */}
            <div className="lg:col-span-3">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-2xl px-4 py-3.5 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
              >
                <option value="featured">Featured / Newest</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name-asc">Name: A to Z</option>
              </select>
            </div>

            {/* Price Filter Summary */}
            <div className="lg:col-span-3 bg-slate-900 border border-slate-800 rounded-2xl px-4 py-2.5">
              <div className="flex justify-between items-center text-xs text-slate-400 mb-1">
                <span>Max Price:</span>
                <span className="font-bold text-white">Rs {maxPrice.toLocaleString("en-NP")}</span>
              </div>
              <input
                type="range"
                min={20000}
                max={350000}
                step={10000}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
            </div>
          </div>

          {/* Category Horizontal Pills */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-2 custom-scrollbar">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                    : "bg-slate-900/80 text-slate-300 hover:bg-slate-800 border border-slate-800"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="py-24 text-center space-y-3">
            <RefreshCw className="w-8 h-8 text-blue-400 animate-spin mx-auto" />
            <p className="text-slate-400 text-sm">Loading authentic appliance inventory...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="py-20 text-center glass-panel rounded-3xl p-8 space-y-4">
            <ShoppingBag className="w-12 h-12 text-slate-600 mx-auto" />
            <h3 className="text-xl font-bold text-white">No products found matching your search</h3>
            <p className="text-slate-400 text-xs max-w-md mx-auto">
              Try adjusting your search terms or resetting filters to browse our entire 378+ catalog.
            </p>
            <button
              onClick={() => {
                setSearch("");
                onSelectBrand("");
                setSelectedCategory("All Categories");
                setMaxPrice(350000);
              }}
              className="px-6 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs"
            >
              Show All Products
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {products.map((product) => {
              const imageSrc = product.hasLocalPhoto && product.photoPath
                ? `/${product.photoPath.startsWith("/") ? product.photoPath.slice(1) : product.photoPath}`
                : (product.imageUrl || "/images/hero-showroom.jpg");

              const quickMsg = `Namaste Join Electronic Center! I am interested in: ${product.name} (Model: ${product.modelCode}) priced at Rs ${product.mrpNpr?.toLocaleString("en-NP")}. Is this available?`;

              return (
                <div
                  key={product.id}
                  className="glass-panel glass-card-hover rounded-2xl overflow-hidden flex flex-col justify-between border border-slate-800/80 group"
                >
                  <div>
                    {/* Top Image Container */}
                    <div 
                      className="relative h-56 w-full bg-slate-900/90 overflow-hidden flex items-center justify-center p-3 cursor-pointer"
                      onClick={() => onSelectProduct(product)}
                    >
                      <Image
                        src={imageSrc}
                        alt={product.name}
                        fill
                        className="object-contain p-2 group-hover:scale-105 transition duration-300"
                        sizes="(max-width: 768px) 100vw, 300px"
                      />
                      
                      {/* Top Badges */}
                      <div className="absolute top-2.5 left-2.5 flex flex-col gap-1">
                        <span className="bg-slate-950/80 backdrop-blur-md border border-slate-700 text-white text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider">
                          {product.brand?.name || product.brand}
                        </span>
                        {product.hasLocalPhoto && (
                          <span className="bg-blue-600/90 text-white text-[9px] font-bold px-1.5 py-0.2 rounded-md">
                            Official Photo
                          </span>
                        )}
                      </div>

                      {/* Quick View Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectProduct(product);
                        }}
                        className="absolute bottom-2.5 right-2.5 opacity-0 group-hover:opacity-100 transition p-2 rounded-xl bg-slate-950/90 text-white hover:bg-blue-600 shadow-md"
                        title="Quick View"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Content */}
                    <div className="p-4 space-y-2.5">
                      <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                        <span className="truncate">{product.category?.name || product.category}</span>
                        <span className="text-blue-400 font-semibold">{product.modelCode}</span>
                      </div>

                      <h3
                        onClick={() => onSelectProduct(product)}
                        className="font-bold text-sm text-white line-clamp-2 hover:text-blue-300 transition cursor-pointer leading-snug"
                      >
                        {product.name}
                      </h3>

                      {/* Price & EMI */}
                      <div className="pt-1 flex items-baseline justify-between border-t border-slate-800/80">
                        <div>
                          <span className="text-[10px] text-slate-400 uppercase font-medium">Store Price</span>
                          <p className="text-lg font-black text-amber-400">
                            Rs {product.mrpNpr?.toLocaleString("en-NP")}
                          </p>
                        </div>
                        {product.emiMonthly12 && (
                          <div className="text-right">
                            <span className="text-[9px] text-slate-400 uppercase">EMI from</span>
                            <p className="text-xs font-extrabold text-emerald-400">
                              Rs {Math.round(product.emiMonthly12).toLocaleString("en-NP")}/mo
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions Footer */}
                  <div className="p-4 pt-0 grid grid-cols-2 gap-2">
                    <button
                      onClick={() => onSelectProduct(product)}
                      className="py-2.5 px-2 rounded-xl text-xs font-bold text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-700/80 flex items-center justify-center space-x-1 transition cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Details</span>
                    </button>

                    <a
                      href={`https://wa.me/${whatsapp}?text=${encodeURIComponent(quickMsg)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() =>
                        trackEvent("Contact", {
                          source: "catalog_card",
                          content_id: product.modelCode || product.id,
                          content_name: product.name,
                          value: product.mrpNpr || 0,
                          currency: "NPR",
                        })
                      }
                      className="py-2.5 px-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-md shadow-emerald-950/30 flex items-center justify-center space-x-1.5 transition"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>Send Message</span>
                    </a>
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
}
