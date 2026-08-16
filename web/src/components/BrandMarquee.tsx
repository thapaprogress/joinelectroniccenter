"use client";

import React from "react";
import { Sparkles } from "lucide-react";

interface BrandMarqueeProps {
  selectedBrand: string;
  onSelectBrand: (brand: string) => void;
}

const BRANDS = [
  { name: "Samsung", count: 70, highlight: "QLED & Smart Inverter" },
  { name: "Skyworth", count: 72, highlight: "Google TV & Freezers" },
  { name: "Himstar", count: 65, highlight: "Nepali Household Trusted" },
  { name: "Whirlpool", count: 50, highlight: "6th Sense Appliances" },
  { name: "Videocon", count: 48, highlight: "Value Coolers & ACs" },
  { name: "Panasonic", count: 25, highlight: "Japanese Precision Tech" },
  { name: "Livpure", count: 22, highlight: "RO Purifiers & Coolers" },
  { name: "Hitachi", count: 12, highlight: "Luxury Japanese Fridges" },
  { name: "Galanz", count: 6, highlight: "Convection Microwaves" },
  { name: "AURA", count: 4, highlight: "Split Air Conditioners" },
  { name: "Miriza", count: 4, highlight: "Modern Smart Tech" },
];

export function BrandMarquee({ selectedBrand, onSelectBrand }: BrandMarqueeProps) {
  return (
    <section className="py-8 bg-slate-950/90 border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-4">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h2 className="text-sm uppercase tracking-widest text-slate-300 font-bold">
              Official Authorized Store For 11 Global Brands
            </h2>
          </div>
          {selectedBrand && (
            <button
              onClick={() => onSelectBrand("")}
              className="text-xs text-blue-400 hover:text-blue-300 underline font-medium cursor-pointer"
            >
              Reset brand filter (Showing {selectedBrand})
            </button>
          )}
        </div>

        {/* Brand Grid Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {BRANDS.map((brand) => {
            const isSelected = selectedBrand.toLowerCase() === brand.name.toLowerCase();
            return (
              <button
                key={brand.name}
                onClick={() => onSelectBrand(isSelected ? "" : brand.name)}
                className={`p-3 rounded-2xl border text-left transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? "bg-blue-600 border-blue-400 text-white shadow-lg shadow-blue-500/25 scale-[1.03]"
                    : "glass-panel text-slate-300 hover:text-white hover:border-slate-600 hover:bg-slate-900/80"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-base tracking-tight">{brand.name}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                    isSelected ? "bg-white/20 text-white" : "bg-slate-800 text-slate-400"
                  }`}>
                    {brand.count}
                  </span>
                </div>
                <p className={`text-[11px] mt-1 line-clamp-1 ${
                  isSelected ? "text-blue-100" : "text-slate-400"
                }`}>
                  {brand.highlight}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
