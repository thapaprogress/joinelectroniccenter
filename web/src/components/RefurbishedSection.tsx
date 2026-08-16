"use client";

import React from "react";
import Image from "next/image";
import { ShieldCheck, Tag, Sparkles, MessageCircle, CheckCircle2, RefreshCw, Flame } from "lucide-react";

interface RefurbishedSectionProps {
  onOpenExchange: () => void;
}

const REFURBISHED_ITEMS = [
  {
    id: "ref-1",
    name: "Samsung 32\" Smart Full HD LED TV (Certified Pre-Owned)",
    model: "UA32-REF",
    brand: "Samsung",
    originalMrp: 28500,
    clearancePrice: 11900,
    discount: "58% OFF",
    condition: "Grade A (Flawless Screen)",
    warranty: "30-Day Complete Testing & Repair Warranty",
    photo: "/photos/Samsung/101742262-NP-1022496195.webp",
    backupPhoto: "/images/hero-showroom.jpg",
    specs: ["YouTube & Netflix Ready", "Crystal Clear Display", "Original Remote Included", "HDMI & USB Ports Tested"],
  },
  {
    id: "ref-2",
    name: "Whirlpool 190L Direct Cool Refrigerator (Serviced & Cleaned)",
    model: "WP190-REF",
    brand: "Whirlpool",
    originalMrp: 32000,
    clearancePrice: 13500,
    discount: "57% OFF",
    condition: "Grade A+ (Ice Cold Cooling)",
    warranty: "30-Day Motor & Cooling Guarantee",
    photo: "/photos/Whirlpool/200-IMPC-GREY-NEP.webp",
    backupPhoto: "/images/hero-showroom.jpg",
    specs: ["Super Fast Ice Freezing", "100% Gas Pressure Verified", "Deep Cleaned & Sanitized", "Rust-Free Gasket Seal"],
  },
  {
    id: "ref-3",
    name: "Skyworth 43\" 4K UHD Smart Android TV (Showroom Demo Unit)",
    model: "43UHD-REF",
    brand: "Skyworth",
    originalMrp: 46000,
    clearancePrice: 22500,
    discount: "51% OFF",
    condition: "Like-New Showroom Demo",
    warranty: "60-Day Extended Store Warranty",
    photo: "/photos/Skyworth/32STD2000.webp",
    backupPhoto: "/images/hero-showroom.jpg",
    specs: ["4K Ultra HD HDR Screen", "Google Play Store & Chromecast", "Box & Stand Complete", "Zero Dead Pixels"],
  },
  {
    id: "ref-4",
    name: "Videocon 7.5 Kg Heavy Semi-Automatic Washer (Serviced)",
    model: "VD75-REF",
    brand: "Videocon",
    originalMrp: 24500,
    clearancePrice: 9900,
    discount: "60% OFF",
    condition: "100% Tested Working",
    warranty: "30-Day Motor Guarantee",
    photo: "/photos/Videocon/VWM-8-0SAR.webp",
    backupPhoto: "/images/hero-showroom.jpg",
    specs: ["High-Torque Spin Dryer", "Heavy Blanket Washing Tub", "New Pulsator Installed", "Low Power Consumption"],
  },
];

export function RefurbishedSection({ onOpenExchange }: RefurbishedSectionProps) {
  const whatsapp = "9779851045662";

  return (
    <section id="clearance" className="py-16 bg-slate-950/95 border-b border-slate-800 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-red-500/20 to-amber-500/20 border border-red-500/30 px-3.5 py-1 rounded-full text-xs font-black text-amber-300 mb-2">
              <Flame className="w-4 h-4 text-red-400" />
              <span>CERTIFIED SECOND-HAND & TRADE-IN CLEARANCE</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white">
              Refurbished Appliance <span className="text-gradient-gold">Steal Deals (40-60% OFF)</span>
            </h2>
            <p className="text-slate-300 text-sm mt-1">
              Quality-tested second-hand units received from our trade-in program. Serviced, cleaned, and sold with our 30-day store warranty.
            </p>
          </div>

          <button
            onClick={onOpenExchange}
            className="px-5 py-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold flex items-center space-x-2 transition cursor-pointer self-start md:self-auto shadow-sm"
          >
            <RefreshCw className="w-4 h-4 text-amber-400" />
            <span>Have an Old Device? Exchange for Cash</span>
          </button>
        </div>

        {/* Clearance Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {REFURBISHED_ITEMS.map((item) => {
            const quickMsg = `Namaste Join Electronic Center! I am interested in the Certified Refurbished Deal: ${item.name} (${item.model}) priced at Rs ${item.clearancePrice.toLocaleString("en-NP")}. Is this unit still in stock at Samakhushi?`;

            return (
              <div
                key={item.id}
                className="glass-panel rounded-3xl overflow-hidden border border-slate-800 flex flex-col justify-between hover:border-amber-500/40 transition duration-300 group"
              >
                <div>
                  {/* Image with Clearance Badges */}
                  <div className="relative h-56 w-full bg-slate-900 overflow-hidden flex items-center justify-center p-4">
                    <Image
                      src={item.photo}
                      alt={item.name}
                      fill
                      className="object-contain p-3 group-hover:scale-105 transition duration-300"
                      sizes="(max-width: 768px) 100vw, 300px"
                      onError={(e: any) => {
                        e.currentTarget.src = item.backupPhoto;
                      }}
                    />
                    
                    <div className="absolute top-3 left-3 flex flex-col gap-1">
                      <span className="bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider shadow">
                        {item.discount}
                      </span>
                      <span className="bg-slate-950/90 text-amber-300 border border-amber-500/30 text-[9px] font-bold px-1.5 py-0.5 rounded">
                        {item.condition}
                      </span>
                    </div>

                    <div className="absolute bottom-2.5 right-2.5 bg-slate-950/80 text-[10px] text-slate-300 px-2 py-0.5 rounded border border-slate-700">
                      {item.brand}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4 space-y-2.5">
                    <h3 className="font-extrabold text-sm text-white line-clamp-2 leading-snug">
                      {item.name}
                    </h3>

                    {/* Specs check */}
                    <div className="space-y-1 pt-1 text-[11px] text-slate-300">
                      {item.specs.map((s, idx) => (
                        <div key={idx} className="flex items-center space-x-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                          <span className="line-clamp-1">{s}</span>
                        </div>
                      ))}
                    </div>

                    {/* Pricing */}
                    <div className="pt-2 border-t border-slate-800/80 flex items-baseline justify-between">
                      <div>
                        <span className="text-[10px] text-slate-500 line-through mr-1">
                          Rs {item.originalMrp.toLocaleString("en-NP")}
                        </span>
                        <p className="text-xl font-black text-gradient-gold">
                          Rs {item.clearancePrice.toLocaleString("en-NP")}
                        </p>
                      </div>
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-bold">
                        Verified Tested
                      </span>
                    </div>
                  </div>
                </div>

                {/* WhatsApp Action Button */}
                <div className="p-4 pt-0">
                  <a
                    href={`https://wa.me/${whatsapp}?text=${encodeURIComponent(quickMsg)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-bold text-xs flex items-center justify-center space-x-1.5 transition shadow-md shadow-emerald-950/30 cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Send Message for Pre-Owned</span>
                  </a>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
