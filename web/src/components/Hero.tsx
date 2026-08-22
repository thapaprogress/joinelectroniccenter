"use client";

import React from "react";
import Image from "next/image";
import { ArrowRight, RefreshCw, ShieldCheck, Truck, Percent, Star, CheckCircle2, MessageCircle } from "lucide-react";
import { trackEvent } from "@/lib/track-client";

interface HeroProps {
  onScrollToCatalog: () => void;
  onOpenExchange: () => void;
}

export function Hero({ onScrollToCatalog, onOpenExchange }: HeroProps) {
  const whatsapp = "9779851045662";

  return (
    <section className="relative min-h-[620px] flex items-center justify-center overflow-hidden bg-slate-950 py-12 md:py-20 border-b border-slate-800/80">
      {/* Background Showroom Visual with Gradient Mesh */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero-showroom.jpg"
          alt="Join Electronic Center Luxury Showroom Samakhushi Kathmandu"
          fill
          priority
          className="object-cover object-center opacity-30 scale-105 transform hover:scale-100 transition duration-1000 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/85 to-slate-950/60" />
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-slate-950/60 to-slate-950" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center md:text-left">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Sales Copy & CTAs */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Trust Pill */}
            <div className="inline-flex items-center space-x-2 bg-blue-950/70 border border-blue-500/30 px-3.5 py-1.5 rounded-full text-xs font-semibold text-blue-300 backdrop-blur-md shadow-sm">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              <span>Samakhushi Chowk, Tokha Road • Serving Kathmandu Since 2004</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1]">
              Smart Home Appliances in Kathmandu with <span className="text-gradient-gold">Honest Pricing & Warranty</span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl font-normal leading-relaxed">
              Explore <strong>378+ certified televisions, refrigerators, washing machines & air conditioners</strong> from Samsung, Whirlpool, Skyworth, Panasonic & Himstar. Free valley delivery, instant EMI & old appliance trade-in.
            </p>

            {/* Value Checkpoints Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-sm text-slate-200">
              <div className="flex items-center space-x-2 bg-slate-900/60 border border-slate-800 p-2.5 rounded-xl">
                <RefreshCw className="w-5 h-5 text-amber-400 flex-shrink-0" />
                <span><strong>Old TV / Fridge Swap:</strong> Up to Rs 8,000 Bonus</span>
              </div>
              <div className="flex items-center space-x-2 bg-slate-900/60 border border-slate-800 p-2.5 rounded-xl">
                <Percent className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <span><strong>Easy Monthly EMI:</strong> Starting from Rs 1,500/mo</span>
              </div>
              <div className="flex items-center space-x-2 bg-slate-900/60 border border-slate-800 p-2.5 rounded-xl">
                <Truck className="w-5 h-5 text-blue-400 flex-shrink-0" />
                <span><strong>Free Valley Delivery:</strong> Same-day professional setup</span>
              </div>
              <div className="flex items-center space-x-2 bg-slate-900/60 border border-slate-800 p-2.5 rounded-xl">
                <ShieldCheck className="w-5 h-5 text-purple-400 flex-shrink-0" />
                <span><strong>100% Genuine Warranty:</strong> Official brand authorized</span>
              </div>
            </div>

            {/* Dual CTAs */}
            <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
              <button
                onClick={onScrollToCatalog}
                className="w-full sm:w-auto px-7 py-4 rounded-xl text-base font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-lg shadow-blue-500/25 border border-blue-400/30 flex items-center justify-center space-x-2.5 transition transform hover:-translate-y-0.5 cursor-pointer"
              >
                <span>Browse 378+ Catalog Items</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <button
                onClick={onOpenExchange}
                className="w-full sm:w-auto px-6 py-4 rounded-xl text-base font-bold text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/40 flex items-center justify-center space-x-2.5 transition transform hover:-translate-y-0.5 cursor-pointer shadow-sm"
              >
                <RefreshCw className="w-5 h-5 text-amber-400" />
                <span>Calculate Old Item Exchange</span>
              </button>
            </div>
          </div>

          {/* Right Column: Promotional Exchange Card Preview */}
          <div className="lg:col-span-5">
            <div className="glass-panel-glow p-6 sm:p-7 rounded-3xl relative overflow-hidden group">
              <div className="absolute -top-12 -right-12 w-48 h-48 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

              <div className="relative z-10 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
                      Special Festival Offer
                    </span>
                    <h3 className="text-2xl font-black text-white mt-2">Old TV & Fridge Trade-In</h3>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-400">Cashback up to</span>
                    <p className="text-2xl font-extrabold text-amber-400">Rs 8,000</p>
                  </div>
                </div>

                <div className="relative h-44 w-full rounded-2xl overflow-hidden border border-slate-700/60">
                  <Image
                    src="/images/exchange-banner.jpg"
                    alt="Trade in your old appliances in Kathmandu"
                    fill
                    className="object-cover group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent flex items-end p-3">
                    <p className="text-xs text-amber-200 font-semibold">Any working or non-working old appliance accepted!</p>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  Upgrade your old bulky CRT or damaged TV/refrigerator to a brand new 4K Smart OLED or Inverter Refrigerator today. We collect from your doorstep in Kathmandu Valley!
                </p>

                <div className="pt-2">
                  <a
                    href={`https://wa.me/${whatsapp}?text=${encodeURIComponent("Namaste Join Electronic! I have an old TV / appliance I want to exchange. Please give me an exchange quote.")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackEvent("Contact", { source: "hero_exchange_quote" })}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-bold text-sm flex items-center justify-center space-x-2 transition shadow-md shadow-emerald-950/40"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Send Photo on WhatsApp for Instant Quote</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Live Metrics Ticker Bar */}
        <div className="mt-12 pt-8 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6 text-center">
          <div className="space-y-1">
            <p className="text-2xl sm:text-3xl font-extrabold text-white">378+</p>
            <p className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Live Inventory</p>
          </div>
          <div className="space-y-1">
            <p className="text-2xl sm:text-3xl font-extrabold text-blue-400">11</p>
            <p className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Authorized Brands</p>
          </div>
          <div className="space-y-1">
            <p className="text-2xl sm:text-3xl font-extrabold text-emerald-400">1,420+</p>
            <p className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Live Store Visits</p>
          </div>
          <div className="space-y-1">
            <p className="text-2xl sm:text-3xl font-extrabold text-amber-400">20+ Years</p>
            <p className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Since 2004</p>
          </div>
          <div className="space-y-1 col-span-2 sm:col-span-1">
            <div className="flex items-center justify-center space-x-1 text-yellow-400 text-2xl font-extrabold">
              <span>4.9</span>
              <Star className="w-4 h-4 fill-yellow-400" />
            </div>
            <p className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Google & FB Reviews</p>
          </div>
        </div>

      </div>
    </section>
  );
}
