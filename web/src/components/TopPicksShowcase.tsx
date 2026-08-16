"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { 
  Trophy, 
  Tv, 
  Zap, 
  ShieldCheck, 
  Wind, 
  Droplets, 
  Snowflake, 
  CheckCircle2, 
  ChevronLeft, 
  ChevronRight, 
  MessageCircle, 
  Eye, 
  Sparkles,
  Flame,
  Star
} from "lucide-react";

interface TopPicksShowcaseProps {
  onSelectProduct: (product: any) => void;
  onOpenExchange: () => void;
}

const TOP_PICKS = [
  {
    id: "tv",
    badge: "👑 BEST SMART TV 2026",
    categoryTitle: "Best 4K Smart Television",
    icon: Tv,
    modelName: "Skyworth 55\" 4K UHD Google QLED Smart TV",
    modelCode: "55Q6500G",
    brand: "Skyworth",
    mrp: 84900,
    emi: 7782,
    warranty: "3 Years Full Panel & Parts Warranty",
    photo: "/photos/Skyworth/55Q6500G.webp",
    backupPhoto: "/images/hero-showroom.jpg",
    verdict: "Unbeatable color richness, Dolby Atmos audio, and seamless Google TV interface at Kathmandu's most competitive price point.",
    whyBest: [
      { title: "QLED Quantum Dot 4K", desc: "100% color volume with HDR10+ and Dolby Vision cinematic clarity." },
      { title: "Google TV & Far-Field Voice", desc: "Hands-free Google Assistant voice control without touching remote." },
      { title: "Dolby Atmos 24W Audio", desc: "Studio surround sound tuning designed for large Nepali living rooms." },
      { title: "Chameleon Extreme 2.0 AI", desc: "Intelligent AI engine upscales YouTube & DishHome SD content to crisp 4K." },
      { title: "3-Year Official Nepal Warranty", desc: "Authorized nationwide service centers with immediate repair support." },
    ],
  },
  {
    id: "fridge",
    badge: "❄️ BEST REFRIGERATOR 2026",
    categoryTitle: "Best Frost-Free Refrigerator",
    icon: Snowflake,
    modelName: "Whirlpool 263L Triple Door Frost-Free Refrigerator",
    modelCode: "263-D-Protton-Roy-Alpha-Steel",
    brand: "Whirlpool",
    mrp: 69900,
    emi: 6407,
    warranty: "10 Years Inverter Compressor Warranty",
    photo: "/photos/Whirlpool/263-D-Protton-Roy-Alpha-Steel.webp",
    backupPhoto: "/images/hero-showroom.jpg",
    verdict: "Zero odor mixing across 3 isolated compartments, superior 2x vegetable freshness retention, and ultra-quiet inverter efficiency.",
    whyBest: [
      { title: "ActiveFresh 3-Door Technology", desc: "Separate deli, cooling, and bottom freezer zones prevent odor cross-contamination." },
      { title: "MicroBlock™ Anti-Microbial Shield", desc: "Kills up to 99% bacterial growth inside vegetable crisper bins." },
      { title: "Custom Moisture Retention Crisper", desc: "Keeps leafy greens, apples, and vegetables fresh for up to 15 days." },
      { title: "IntelliSense Inverter Motor", desc: "Adapts cooling to internal load, saving up to 45% electricity." },
      { title: "Stabilizer-Free Operation (130V-300V)", desc: "Guards against Kathmandu voltage spikes and power fluctuations." },
    ],
  },
  {
    id: "wm",
    badge: "⚡ BEST WASHING MACHINE 2026",
    categoryTitle: "Best Front-Load Inverter Washer",
    icon: Droplets,
    modelName: "Skyworth 8.0 Kg Inverter Steam Front Load Washing Machine",
    modelCode: "WM-F8014DSDN",
    brand: "Skyworth",
    mrp: 62500,
    emi: 5729,
    warranty: "10 Years BLDC Motor Warranty",
    photo: "/photos/Skyworth/WM-F8014DSDN.webp",
    backupPhoto: "/images/hero-showroom.jpg",
    verdict: "Heavy-duty BLDC motor tackles heavy blankets and winter clothes easily while gentle 99.9% steam sanitizes baby clothes.",
    whyBest: [
      { title: "Direct BLDC Inverter Motor", desc: "Super silent operation (<52dB) with zero belt wear and 10-year warranty." },
      { title: "99.9% Steam Allergy Care & Sanitizer", desc: "In-built water heater eliminates bacteria, dust mites, and tough stains." },
      { title: "1400 RPM High Speed Spin", desc: "Extracts maximum water for rapid drying during Kathmandu monsoon & winter." },
      { title: "15-Min Quick Express Wash", desc: "Quick wash cycle for daily lightly soiled office & school wear." },
      { title: "Diamond Drum Fabric Protector", desc: "Gentle honeycomb embossed drum prevents snagging of delicate woolens." },
    ],
  },
  {
    id: "ac",
    badge: "🔥 BEST AIR CONDITIONER 2026",
    categoryTitle: "Best Dual Inverter Split AC",
    icon: Wind,
    modelName: "Skyworth 1.5 Ton Dual Inverter Split AC (Hot & Cold)",
    modelCode: "SMVH18B-R32",
    brand: "Skyworth",
    mrp: 78500,
    emi: 7195,
    warranty: "5 Years Compressor Warranty + 1 Yr Service",
    photo: "/photos/Skyworth/SMVH18B-R32.webp",
    backupPhoto: "/images/hero-showroom.jpg",
    verdict: "Dual cooling & heating for all 4 seasons in Kathmandu. 30-second rapid turbo cooling with Gold-Fin anti-rust protection.",
    whyBest: [
      { title: "All-Weather Hot & Cold Dual Mode", desc: "Instant heating in freezing winter mornings and ice-cool chill in summer." },
      { title: "100% Pure Copper with Gold Fin", desc: "Anti-corrosive gold hydrophilic fin protects coils from moisture and pollution." },
      { title: "Eco-Friendly R32 Gas", desc: "Zero ozone depletion with higher heat exchange efficiency and low wattage." },
      { title: "Self-Cleaning & Anti-Bacterial Filter", desc: "Auto-frosts and dries evaporator to prevent mold and stale room odors." },
      { title: "Low Voltage Startup (165V)", desc: "Starts smoothly without tripping circuit breakers on low voltage grids." },
    ],
  },
  {
    id: "cooler",
    badge: "💨 BEST AIR COOLER 2026",
    categoryTitle: "Best Heavy-Duty Desert Cooler",
    icon: Zap,
    modelName: "Himstar 105 Litre Mega Desert Air Cooler",
    modelCode: "HC-10526",
    brand: "Himstar",
    mrp: 22990,
    emi: 2108,
    warranty: "1 Year Motor & Pump Warranty",
    photo: "/photos/Himstar/HW-75FXQUTI-GZ.webp",
    backupPhoto: "/images/hero-showroom.jpg",
    verdict: "Massive 105L water reservoir with powerful 45-foot air throw. Perfect for large open living rooms, offices, and halls.",
    whyBest: [
      { title: "Massive 105L Tank Capacity", desc: "Runs for 24+ hours of continuous cool breeze on a single water refill." },
      { title: "3-Side High-Density Honeycomb Pads", desc: "Maximum water absorption surface gives noticeably cooler air output." },
      { title: "Dedicated Ice Chamber Box", desc: "Drop ice cubes on top for arctic-chilled air on scorching afternoons." },
      { title: "Inverter & Solar Generator Friendly", desc: "Draws under 200W — runs easily on home UPS inverter backup." },
      { title: "Heavy Duty 360° Castor Wheels", desc: "Smooth glide movement from bedroom to living room." },
    ],
  },
  {
    id: "freezer",
    badge: "🧊 BEST CHEST DEEP FREEZER",
    categoryTitle: "Best Commercial & Home Deep Freezer",
    icon: Snowflake,
    modelName: "Skyworth 360L Commercial Deep Chest Freezer",
    modelCode: "SCF 390",
    brand: "Skyworth",
    mrp: 67300,
    emi: 6169,
    warranty: "5 Years Heavy Duty Compressor Warranty",
    photo: "/photos/Skyworth/SCF-390.webp",
    backupPhoto: "/images/hero-showroom.jpg",
    verdict: "Super-fast deep freezing to -24°C with thick high-density polyurethane insulation holding sub-zero cold for up to 48 hours in power cuts.",
    whyBest: [
      { title: "Super Deep Freezing (-24°C)", desc: "Locks in meat, fish, and dairy freshness without ice crystal breakdown." },
      { title: "48-Hour Cold Retention Insulation", desc: "Thick cyclopentane insulated walls keep contents frozen during long power outages." },
      { title: "Dual Function (Fridge or Freezer)", desc: "Adjust thermostat dial to use as chiller refrigerator or sub-zero freezer." },
      { title: "Key Lock & Scratch-Resistant Body", desc: "Heavy duty zinc-coated steel with internal safety door lock." },
      { title: "Embossed Aluminum Inner Liner", desc: "Easy to clean, corrosion-resistant, and rapid thermal heat dissipation." },
    ],
  },
];

export function TopPicksShowcase({ onSelectProduct, onOpenExchange }: TopPicksShowcaseProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  // Auto-slide every 6 seconds
  useEffect(() => {
    if (!autoPlay) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % TOP_PICKS.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [autoPlay]);

  const current = TOP_PICKS[activeIndex];
  const IconComponent = current.icon;
  const whatsapp = "9779851045662";

  const nextSlide = () => {
    setAutoPlay(false);
    setActiveIndex((prev) => (prev + 1) % TOP_PICKS.length);
  };

  const prevSlide = () => {
    setAutoPlay(false);
    setActiveIndex((prev) => (prev - 1 + TOP_PICKS.length) % TOP_PICKS.length);
  };

  const quickMsg = `Namaste Join Electronic Center! I am viewing your Best in Category pick: ${current.modelName} (Model: ${current.modelCode}) priced at Rs ${current.mrp.toLocaleString("en-NP")}. Is this ready for delivery?`;

  return (
    <section id="top-picks" className="py-16 bg-slate-950 border-b border-slate-800 relative overflow-hidden">
      
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-2">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-amber-500/20 to-blue-500/20 border border-amber-500/30 px-3.5 py-1 rounded-full text-xs font-black text-amber-300 shadow-sm">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>KATHMANDU EXPERT PICKS & BENCHMARKS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            Best in Class <span className="text-gradient-gold">Appliances & Why They Win</span>
          </h2>
          <p className="text-slate-300 text-sm sm:text-base">
            Tested across 20+ years in Kathmandu homes for energy efficiency, voltage fluctuation durability, and genuine warranty value.
          </p>
        </div>

        {/* Category Tab Pills */}
        <div className="flex items-center justify-start md:justify-center space-x-2 overflow-x-auto pb-4 mb-8 custom-scrollbar">
          {TOP_PICKS.map((item, idx) => {
            const TabIcon = item.icon;
            const isSelected = idx === activeIndex;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setAutoPlay(false);
                  setActiveIndex(idx);
                }}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-2xl text-xs font-extrabold whitespace-nowrap transition-all duration-200 cursor-pointer border ${
                  isSelected
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 border-blue-400 text-white shadow-lg shadow-blue-600/30 scale-105"
                    : "glass-panel text-slate-300 hover:text-white hover:bg-slate-900 border-slate-800"
                }`}
              >
                <TabIcon className={`w-4 h-4 ${isSelected ? "text-white" : "text-slate-400"}`} />
                <span>{item.categoryTitle.replace("Best ", "")}</span>
              </button>
            );
          })}
        </div>

        {/* Main Interactive Showcase Slide Card */}
        <div className="glass-panel-glow rounded-3xl overflow-hidden p-6 sm:p-10 border border-slate-700/80 shadow-2xl relative">
          
          {/* Slide Progress indicator */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-slate-800">
            <div 
              className="h-full bg-gradient-to-r from-amber-400 to-blue-500 transition-all duration-500"
              style={{ width: `${((activeIndex + 1) / TOP_PICKS.length) * 100}%` }}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-2">
            
            {/* Left: Product Visual + Badges */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
              
              <div className="flex items-center justify-between">
                <span className="bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
                  {current.badge}
                </span>
                <span className="text-xs font-mono text-slate-400 font-bold">
                  {activeIndex + 1} of {TOP_PICKS.length}
                </span>
              </div>

              {/* Photo Box with 3D Float Hover */}
              <div className="relative h-72 sm:h-84 w-full rounded-2xl overflow-hidden bg-slate-900/90 border border-slate-800 p-4 flex items-center justify-center group shadow-inner">
                <Image
                  src={current.photo}
                  alt={current.modelName}
                  fill
                  className="object-contain p-4 group-hover:scale-105 group-hover:-translate-y-1 transition duration-500 ease-out"
                  sizes="(max-width: 768px) 100vw, 450px"
                  onError={(e: any) => {
                    e.currentTarget.src = current.backupPhoto;
                  }}
                />
                
                {/* Brand Overlay Tag */}
                <div className="absolute top-3 left-3 bg-slate-950/90 border border-slate-700 px-2.5 py-1 rounded-lg text-xs font-black text-white">
                  {current.brand}
                </div>

                {/* Rating Badge */}
                <div className="absolute bottom-3 right-3 bg-slate-950/90 border border-yellow-500/30 px-2.5 py-1 rounded-lg flex items-center space-x-1 text-xs font-bold text-yellow-400">
                  <Star className="w-3.5 h-3.5 fill-yellow-400" />
                  <span>5.0 Store Pick</span>
                </div>
              </div>

              {/* Warranty & Value Tag */}
              <div className="flex items-center space-x-2 bg-slate-900 border border-slate-800 p-3 rounded-xl text-xs text-slate-200">
                <ShieldCheck className="w-5 h-5 text-purple-400 flex-shrink-0" />
                <span>{current.warranty}</span>
              </div>

            </div>

            {/* Right: Technical Breakdown & "Why It's Best" */}
            <div className="lg:col-span-7 space-y-6 flex flex-col justify-between">
              
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-xs font-semibold text-blue-400">
                  <IconComponent className="w-4 h-4" />
                  <span>{current.categoryTitle}</span>
                  <span>•</span>
                  <span className="font-mono text-slate-400">Model: {current.modelCode}</span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                  {current.modelName}
                </h3>

                <p className="text-xs sm:text-sm text-slate-300 bg-slate-900/80 border-l-4 border-amber-400 p-3 rounded-r-xl italic">
                  &ldquo;{current.verdict}&rdquo;
                </p>

                {/* Why It's Best Checklist */}
                <div className="space-y-2 pt-2">
                  <h4 className="text-xs uppercase tracking-wider font-extrabold text-amber-300 flex items-center space-x-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>5 Reasons Why This Is The Top Pick in Nepal:</span>
                  </h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {current.whyBest.map((point, i) => (
                      <div key={i} className="flex items-start space-x-2 bg-slate-900/60 border border-slate-800 p-2.5 rounded-xl">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-bold text-white text-[12px]">{point.title}</p>
                          <p className="text-slate-400 text-[11px] mt-0.5 leading-snug">{point.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pricing & EMI */}
                <div className="flex items-baseline justify-between p-4 rounded-2xl bg-slate-900 border border-slate-800 mt-3">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Special Offer Price</span>
                    <p className="text-2xl sm:text-3xl font-black text-amber-400">
                      Rs {current.mrp.toLocaleString("en-NP")}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">EMI Installment</span>
                    <p className="text-base sm:text-lg font-extrabold text-emerald-400">
                      Rs {current.emi.toLocaleString("en-NP")}/mo
                    </p>
                  </div>
                </div>

              </div>

              {/* Action CTAs + Next/Prev Buttons */}
              <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
                
                {/* Primary WhatsApp Message Button */}
                <a
                  href={`https://wa.me/${whatsapp}?text=${encodeURIComponent(quickMsg)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-extrabold text-sm text-white bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 transition shadow-lg shadow-emerald-950/40 flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Send Message on WhatsApp</span>
                </a>

                {/* Slideshow Navigation Buttons */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={prevSlide}
                    className="p-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
                    title="Previous Category"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={nextSlide}
                    className="p-3 rounded-xl bg-blue-600 hover:bg-blue-500 border border-blue-400 text-white transition shadow-md shadow-blue-900/30 cursor-pointer"
                    title="Next Category"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>

              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
