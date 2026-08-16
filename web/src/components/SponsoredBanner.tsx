"use client";

import React from "react";
import Image from "next/image";
import { Sparkles, ArrowRight, ShieldCheck, Star } from "lucide-react";

interface SponsoredBannerProps {
  onSelectBrand: (brand: string) => void;
}

export function SponsoredBanner({ onSelectBrand }: SponsoredBannerProps) {
  return (
    <section className="py-6 bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel-glow rounded-3xl p-6 sm:p-8 relative overflow-hidden border border-amber-500/30 bg-gradient-to-r from-slate-950 via-blue-950/40 to-slate-950">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            
            {/* Left Info */}
            <div className="lg:col-span-8 space-y-3">
              <div className="flex items-center space-x-2">
                <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow">
                  ★ OFFICIAL BRAND PARTNER SPOTLIGHT
                </span>
                <span className="text-xs text-amber-300 font-semibold flex items-center space-x-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Exclusive Festival Pricing</span>
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-black text-white">
                Skyworth Nepal — 4K Google QLED TVs & Inverter Refrigerators
              </h3>

              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                Experience world-class Chameleon Extreme AI picture processing, 3-Year comprehensive panel warranty, and German TÜV certified eye-care displays directly from Kathmandu&apos;s authorized showroom.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-1">
                <button
                  onClick={() => onSelectBrand("Skyworth")}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center space-x-2 shadow-md shadow-blue-900/40 transition cursor-pointer"
                >
                  <span>Browse 72 Skyworth Products</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <span className="text-xs text-slate-400 flex items-center space-x-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>100% Genuine Authorized Warranty</span>
                </span>
              </div>
            </div>

            {/* Right Mini Showcase Thumbnail */}
            <div className="lg:col-span-4 flex items-center justify-center">
              <div className="relative h-44 w-full rounded-2xl overflow-hidden bg-slate-900/80 border border-slate-800 p-2 flex items-center justify-center">
                <Image
                  src="/photos/Skyworth/55Q6500G.webp"
                  alt="Skyworth 4K Google TV"
                  fill
                  className="object-contain p-2 hover:scale-105 transition duration-300"
                  sizes="(max-width: 768px) 100vw, 300px"
                  onError={(e: any) => {
                    e.currentTarget.src = "/images/hero-showroom.jpg";
                  }}
                />
                <div className="absolute bottom-2 right-2 bg-slate-950/90 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded border border-amber-500/20">
                  Featured Model: 55Q6500G
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
