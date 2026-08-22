"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { BookOpen, ArrowRight, Clock, Tag, Sparkles } from "lucide-react";

interface BlogPost {
  slug: string;
  category: string;
  title: string;
  date: string;
  readMin: string;
  summary: string;
  image: string;
  priceHighlight: string;
  keywords: string[];
}

const FEATURED_POSTS: BlogPost[] = [
  {
    slug: "best-refrigerator-in-nepal-under-50000",
    category: "Refrigerator Guide",
    title: "Best Refrigerator in Nepal Under 50,000 (2026 Double Door & Single Door Top Picks)",
    date: "Aug 21, 2026",
    readMin: "7 min read",
    summary: "Discover the top energy-efficient refrigerators under Rs 50,000 in Nepal from Samsung, Whirlpool, and Himstar. Digital inverter power savings and Kathmandu exchange offers.",
    image: "/photos/Samsung/RT28C3022S8.webp",
    priceHighlight: "Single Door from Rs 29,990 | Double Door from Rs 44,900",
    keywords: ["Refrigerator price Nepal", "Best fridge under 50000", "Double door fridge Nepal"],
  },
  {
    slug: "front-load-vs-top-load-washing-machine-nepal",
    category: "Laundry Guide",
    title: "Front Load vs Top Load Washing Machine in Nepal: Which Saves More Water & Power?",
    date: "Aug 21, 2026",
    readMin: "8 min read",
    summary: "Complete comparison between front-load and top-load fully automatic washing machines for Kathmandu homes. Water pressure, steam wash, and 2026 price lists.",
    image: "/photos/Samsung/WW80T504DAX.webp",
    priceHighlight: "Top Load from Rs 34,900 | Front Load from Rs 54,900",
    keywords: ["Front load washing machine Nepal", "Washing machine price Kathmandu"],
  },
  {
    slug: "inverter-ac-price-in-nepal-2026-guide",
    category: "AC Buying Guide",
    title: "1.5 Ton Inverter AC Price in Nepal (2026 Guide): Electricity Units & Best Brands",
    date: "Aug 21, 2026",
    readMin: "7 min read",
    summary: "Calculations on monthly electricity consumption for 1 Ton vs 1.5 Ton dual inverter ACs in Kathmandu. Copper condenser durability and free installation offers.",
    image: "/photos/AURA/AU12FSWAC.webp",
    priceHighlight: "1 Ton from Rs 48,000 | 1.5 Ton from Rs 64,500",
    keywords: ["1.5 ton AC price Nepal", "Inverter AC Kathmandu", "Air conditioner 2026"],
  },
  {
    slug: "how-to-exchange-old-tv-fridge-kathmandu",
    category: "Exchange & Cashback",
    title: "How to Exchange Old CRT/LED TV & Fridge in Kathmandu for Up to Rs 8,000 Cashback",
    date: "Aug 21, 2026",
    readMin: "5 min read",
    summary: "Step-by-step guide to exchanging broken or working old televisions and refrigerators at Join Electronic Center with instant WhatsApp appraisal and doorstep collection.",
    image: "/images/exchange-banner.webp",
    priceHighlight: "Instant Cashback up to Rs 8,000",
    keywords: ["Old TV exchange in Nepal cashback", "Old refrigerator exchange Kathmandu"],
  },
  {
    slug: "tv-price-in-nepal-2026",
    category: "TV Buying Guide",
    title: "TV Price in Nepal 2026: 32, 43, 55 & 65 Inch Smart 4K TV Complete Price List",
    date: "Aug 15, 2026",
    readMin: "7 min read",
    summary: "Detailed 2026 price breakdown for 32\" to 65\" Smart Google TVs from Samsung, Skyworth, Himstar, and AURA with panel warranty and 0% EMI options in Kathmandu.",
    image: "/photos/Skyworth/55Q6500G.webp",
    priceHighlight: "32\" from Rs 19,990 | 55\" 4K from Rs 59,990",
    keywords: ["TV price in Nepal", "55 inch 4K TV", "Smart TV Nepal"],
  },
  {
    slug: "best-55-inch-4k-tv-nepal",
    category: "Top Picks",
    title: "Best 55 Inch 4K Smart TV in Nepal Under 1 Lakh (2026 Top Picks)",
    date: "Aug 15, 2026",
    readMin: "6 min read",
    summary: "Comparing the top 55-inch 4K QLED & WebOS TVs under Rs. 1,00,000 in Nepal. Display brightness, Dolby Audio, gaming lag, and Google TV OS benchmarked.",
    image: "/photos/Samsung/UA43DU7700.webp",
    priceHighlight: "Skyworth QLED Rs 84,900 | AURA WebOS Rs 69,990",
    keywords: ["Best 55 inch TV Nepal", "4K TV under 1 lakh", "Skyworth QLED"],
  },
];

export function BlogSection() {
  return (
    <section id="blog-guides" className="py-16 px-4 sm:px-6 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
        <div>
          <div className="flex items-center space-x-2 text-blue-400 font-semibold text-xs uppercase tracking-wider mb-2">
            <Sparkles className="w-4 h-4" />
            <span>Smart Buying Advice</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
            Home Appliance Guides &amp; Nepal Price Lists (2026)
          </h2>
          <p className="text-slate-400 text-sm mt-1 max-w-2xl">
            Read verified comparison benchmarks, electricity consumption math, and exchange cashback guides written by our Kathmandu showroom specialists.
          </p>
        </div>

        <Link
          href="/blog"
          className="inline-flex items-center space-x-2 text-sm font-semibold text-blue-400 hover:text-blue-300 transition shrink-0 group"
        >
          <BookOpen className="w-4 h-4" />
          <span>View All 22+ Buying Guides</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Featured Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {FEATURED_POSTS.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group flex flex-col justify-between bg-slate-900/80 hover:bg-slate-850 border border-slate-800 hover:border-blue-500/50 rounded-2xl p-5 shadow-xl hover:shadow-blue-500/10 transition-all duration-300 transform hover:-translate-y-1"
          >
            <div>
              {/* Image & Category Pill */}
              <div className="relative w-full h-48 rounded-xl overflow-hidden bg-slate-950 border border-slate-800 mb-4">
                <Image
                  src={post.image || "/images/hero-showroom.webp"}
                  alt={post.title}
                  fill
                  className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute top-3 left-3 bg-blue-600/90 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow">
                  {post.category}
                </div>
              </div>

              {/* Meta time & read */}
              <div className="flex items-center gap-3 text-xs text-slate-500 mb-2">
                <span>{post.date}</span>
                <span>&bull;</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {post.readMin}
                </span>
              </div>

              {/* Title */}
              <h3 className="text-base sm:text-lg font-bold text-slate-100 group-hover:text-blue-400 transition-colors line-clamp-2 mb-2 leading-snug">
                {post.title}
              </h3>

              {/* Summary */}
              <p className="text-slate-400 text-xs sm:text-sm line-clamp-3 leading-relaxed mb-4">
                {post.summary}
              </p>

              {/* Keywords Tag Cloud */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {post.keywords.map((kw) => (
                  <span
                    key={kw}
                    className="inline-flex items-center gap-1 text-[10px] font-medium text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700/50"
                  >
                    <Tag className="w-2.5 h-2.5 text-blue-400" />
                    {kw}
                  </span>
                ))}
              </div>
            </div>

            {/* Price Highlight & CTA Footer */}
            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between mt-2">
              <span className="text-xs font-bold text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded border border-emerald-800/40">
                {post.priceHighlight}
              </span>
              <span className="text-xs font-semibold text-blue-400 group-hover:text-blue-300 flex items-center gap-1">
                Read Guide <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
