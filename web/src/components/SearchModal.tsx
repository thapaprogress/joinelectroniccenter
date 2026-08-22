"use client";

import React, { useState, useEffect, useRef } from "react";
import { Search, X, Tag, ArrowRight, Zap, Sparkles } from "lucide-react";
import { trackEvent } from "@/lib/track-client";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct: (product: any) => void;
}

export function SearchModal({ isOpen, onClose, onSelectProduct }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [catalog, setCatalog] = useState<any[]>([]);
  const [results, setResults] = useState<any[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((data) => {
        if (data.products && data.products.length > 0) {
          setCatalog(data.products);
        } else {
          throw new Error("No products in API");
        }
      })
      .catch(() => {
        fetch("/data/catalog.json")
          .then((r) => r.json())
          .then((data) => {
            if (Array.isArray(data)) {
              setCatalog(
                data.map((item, index) => {
                  const rawPhoto = item.photo_path || item.photoPath || "";
                  const cleanPhoto = rawPhoto ? rawPhoto.replace(/\\/g, "/") : "";
                  const photoPath = cleanPhoto ? (cleanPhoto.startsWith("/") ? cleanPhoto : `/${cleanPhoto}`) : "";
                  const brandName = typeof item.brand === "string" ? item.brand : (item.brand?.name || "Brand");
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
                    specsList: Array.isArray(item.specs_list) ? item.specs_list : (Array.isArray(item.specs) ? item.specs : []),
                    emiMonthly12: item.emi_monthly_12 || (mrp > 0 ? Math.round((mrp / 12) * 1.08) : null),
                    slug: item.slug || item.model_code || `product-${index}`,
                  };
                })
              );
            }
          })
          .catch(() => {});
      });
  }, []);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
    const matches = catalog.filter((p) => {
      const text = `${p.name || ""} ${p.modelCode || ""} ${p.brand?.name || ""} ${p.category?.name || ""}`.toLowerCase();
      return terms.every((t) => text.includes(t));
    }).slice(0, 8);

    setResults(matches);

    const timer = setTimeout(() => {
      trackEvent("Search", { search_string: query.trim(), results_count: matches.length });
    }, 700);
    return () => clearTimeout(timer);
  }, [query, catalog]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-start justify-center p-4 sm:p-6 pt-16 sm:pt-24 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Search Input */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-800 bg-slate-900/90">
          <Search className="w-5 h-5 text-blue-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search 378+ TVs, Fridges, Washers, ACs, Brands, Model codes..."
            className="w-full bg-transparent text-slate-100 placeholder-slate-500 text-base focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="p-1 text-slate-400 hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <span className="hidden sm:inline-block text-xs font-semibold px-2 py-1 bg-slate-800 text-slate-400 rounded-md border border-slate-700">
            ESC
          </span>
        </div>

        {/* Results List or Popular Keywords */}
        <div className="max-h-96 overflow-y-auto p-3 space-y-2">
          {!query ? (
            <div className="p-4 space-y-3">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Popular Buyer Searches
              </div>
              <div className="flex flex-wrap gap-2">
                {[
                  "Skyworth 55 Inch 4K",
                  "Samsung Crystal UHD",
                  "Himstar Refrigerator",
                  "Front Load Washing Machine",
                  "1 Ton Inverter AC",
                  "Exchange Old TV",
                ].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setQuery(tag)}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-blue-600 hover:text-white text-slate-300 text-xs font-medium transition-all"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          ) : results.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-sm">
              No appliances found matching &ldquo;<b>{query}</b>&rdquo;. Try searching by brand, size, or category.
            </div>
          ) : (
            results.map((product) => {
              const saveAmount = Math.round(product.mrpNpr * 0.08);
              return (
                <div
                  key={product.id}
                  onClick={() => {
                    onSelectProduct(product);
                    onClose();
                  }}
                  className="flex items-center gap-3.5 p-2.5 rounded-xl bg-slate-850 hover:bg-slate-800 border border-slate-800/60 hover:border-blue-500/50 cursor-pointer transition-all group"
                >
                  <img
                    src={product.photoPath ? `/${product.photoPath.replace(/\\/g, "/")}` : "/photos/AURA/AU12FSWAC.webp"}
                    alt={product.name}
                    className="w-12 h-12 object-contain bg-slate-900 rounded-lg p-1 border border-slate-800 shrink-0"
                    onError={(e: any) => {
                      e.target.src = "/photos/AURA/AU12FSWAC.webp";
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-extrabold uppercase tracking-wide text-blue-400 bg-blue-950/60 px-1.5 py-0.5 rounded border border-blue-800/40">
                        {product.brand?.name}
                      </span>
                      <span className="text-xs text-slate-400 font-mono truncate">
                        {product.modelCode}
                      </span>
                    </div>
                    <div className="text-sm font-semibold text-slate-200 truncate group-hover:text-blue-300 transition-colors">
                      {product.name}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs font-bold text-emerald-400">
                        रु. {product.mrpNpr?.toLocaleString("en-NP")}
                      </span>
                      {saveAmount > 500 && (
                        <span className="text-[10px] font-semibold text-emerald-300 bg-emerald-950/80 px-1.5 py-0.2 rounded border border-emerald-800/50">
                          Save रु. {saveAmount.toLocaleString("en-NP")}
                        </span>
                      )}
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all shrink-0 mr-1" />
                </div>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2.5 bg-slate-950/60 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <span>Official MRP &bull; Free Kathmandu Valley Doorstep Delivery</span>
          <span className="text-blue-400 font-medium">Click item to view specs & EMI</span>
        </div>
      </div>
    </div>
  );
}
