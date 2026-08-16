"use client";

import React from "react";
import { BookOpen, ArrowRight, Clock, ShieldCheck, Tag, Sparkles } from "lucide-react";

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
  {
    slug: "refrigerator-price-nepal-2026",
    category: "Refrigerator Guide",
    title: "Refrigerator & Fridge Price in Nepal (2026): Single, Double Door & Side-by-Side Guide",
    date: "Aug 15, 2026",
    readMin: "8 min read",
    summary: "Capacity guide for Nepali households from 170L to 700L. Inverter compressor power savings, 10-20 year warranties, and old fridge exchange cashback.",
    image: "/photos/Himstar/HR-17D71.webp",
    priceHighlight: "Single Door Rs 30,990 | Frost-Free Rs 54,900",
    keywords: ["Fridge price in Nepal", "Double door refrigerator", "Himstar fridge"],
  },
  {
    slug: "washing-machine-price-nepal-2026",
    category: "Laundry Guide",
    title: "Washing Machine Price in Nepal 2026: Semi-Auto, Top Load & Front Load Inverter Guide",
    date: "Aug 15, 2026",
    readMin: "6 min read",
    summary: "Choosing between semi-automatic, top-loading, and front-loading washing machines. Digital Inverter motor longevity, steam hygiene, and water pressure requirements.",
    image: "/photos/Samsung/WT70C3000RR.webp",
    priceHighlight: "Semi-Auto Rs 25,990 | Front Load Steam Rs 55,500",
    keywords: ["Washing machine price Nepal", "Front load washer", "Samsung washing machine"],
  },
  {
    slug: "second-hand-tv-fridge-exchange-nepal",
    category: "Trade-In & Offers",
    title: "Old TV & Fridge Exchange in Kathmandu: Get Up to Rs 8,000 Instant Cashback Bonus",
    date: "Aug 15, 2026",
    readMin: "5 min read",
    summary: "How Join Electronic Center's hassle-free trade-in works: send photos on WhatsApp, receive an instant appraisal, and upgrade to any brand-new appliance.",
    image: "/photos/AURA/AU12FSWAC.webp",
    priceHighlight: "Up to Rs 8,000 Exchange Bonus",
    keywords: ["Appliance exchange Nepal", "Old TV trade in", "Kathmandu second hand exchange"],
  },
];

export function BlogSection() {
  return (
    <section id="blog-guides" className="py-16 px-4 sm:px-6 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/80 border border-blue-800/60 text-blue-400 text-xs font-bold uppercase tracking-wider mb-3">
            <BookOpen className="w-3.5 h-3.5" />
            2026 Appliance Buying & Price Guides
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Smart Buyer Guides & <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Official Price Lists</span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-2xl">
            Researched buying guides with real verified NPR prices, brand warranty terms, energy efficiency ratings, and expert recommendations for Kathmandu Valley buyers.
          </p>
        </div>
        <a
          href="/blog.html"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-sm font-semibold border border-slate-700 transition-all shrink-0 self-start md:self-auto"
        >
          View All 18 Articles <ArrowRight className="w-4 h-4 text-blue-400" />
        </a>
      </div>

      {/* Featured Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {FEATURED_POSTS.map((post, idx) => (
          <a
            key={post.slug}
            href={`/blog.html?post=${post.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col justify-between bg-slate-900/80 hover:bg-slate-850 border border-slate-800 hover:border-blue-500/50 rounded-2xl p-5 shadow-xl hover:shadow-blue-500/10 transition-all duration-300 transform hover:-translate-y-1"
          >
            <div>
              {/* Image & Category Pill */}
              <div className="relative w-full h-48 rounded-xl overflow-hidden bg-slate-950 border border-slate-800 mb-4">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                  onError={(e: any) => {
                    e.target.src = "/photos/AURA/AU12FSWAC.webp";
                  }}
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
          </a>
        ))}
      </div>
    </section>
  );
}
