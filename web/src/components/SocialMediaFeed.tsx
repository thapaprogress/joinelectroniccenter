"use client";

import React, { useState } from "react";
import { 
  ThumbsUp, 
  Share2, 
  MessageCircle, 
  ExternalLink, 
  Video, 
  MapPin, 
  Star, 
  Sparkles,
  Calendar,
  CheckCircle2
} from "lucide-react";

const SOCIAL_PLATFORMS = [
  {
    name: "Facebook",
    handle: "Join Electronic Center",
    followers: "7.2K+ Followers",
    url: "https://www.facebook.com/joinelectroniccenter",
    color: "from-blue-600 to-blue-700",
    border: "border-blue-500/30",
    badge: "Official Page",
    icon: "f",
  },
  {
    name: "TikTok",
    handle: "@joinelectronicscentre",
    followers: "Reels & Flash Deals",
    url: "https://www.tiktok.com/@joinelectronicscentre",
    color: "from-pink-600 via-rose-600 to-slate-900",
    border: "border-pink-500/30",
    badge: "Stock Videos",
    icon: "t",
  },
  {
    name: "Google Business (GMB)",
    handle: "Join Electronic Center - Samakhushi",
    followers: "4.9 ★ Verified Reviews",
    url: "https://g.page/r/CRBpNA834DU9EBM/review",
    color: "from-amber-600 to-orange-600",
    border: "border-amber-500/30",
    badge: "Verified Local Store",
    icon: "G",
  },
  {
    name: "Instagram",
    handle: "@joinelectronic",
    followers: "Photos & Stories",
    url: "https://www.instagram.com/joinelectronic",
    color: "from-purple-600 to-pink-600",
    border: "border-purple-500/30",
    badge: "Appliance Gallery",
    icon: "i",
  },
];

const SOCIAL_POSTS = [
  {
    id: "recondition-viral-1",
    platform: "TikTok",
    iconBg: "bg-rose-600",
    date: "August 2026",
    tag: "🔥 Sasto Purano Fridge",
    title: "Sasto Ma Purano Fridge & Recondition Showroom Tour at Samakhusi",
    body: "Kathmandu ma sasto ma purano fridge khojdai hunuhunchha? Join Electronic Center (Samakhusi Chowk) ma certified single door & double door reconditioned refrigerators starting at Rs. 11,500! 100% gas pressure tested, 30-day warranty, ra purano fridge exchange ma up to Rs. 8,000 cashback.",
    url: "https://www.tiktok.com/@joinelectronicscentre",
    ctaText: "Watch on TikTok",
    metrics: "24.8K Views • 1.9K Likes • 240 Shares",
    hashtags: "#PuranoFridge #SecondHandFridgeNepal #SamakhusiElectronics #ReconditionFridgeKtm #SastoFridge #KathmanduSecondHand #ApplianceExchangeNepal #RingRoadElectronics",
  },
  {
    id: "fb-recondition-1",
    platform: "Facebook",
    iconBg: "bg-blue-600",
    date: "August 2026",
    tag: "♻️ Exchange & Recondition Offer",
    title: "Purano Samana Sata Pata (Exchange Offer) — Instant Cash Discount",
    body: "Bring your old CRT/Smart TV, old Single/Double door refrigerator, or washing machine to our Samakhusi Chowk showroom. Get instant evaluation from Rs 2,000 to Rs 8,000 cashback applied directly to your new or recondition purchase. Free Valley doorstep pickup available!",
    url: "https://www.facebook.com/joinelectroniccenter",
    ctaText: "View on Facebook",
    metrics: "310 Likes • 64 Comments • 45 Shares",
    hashtags: "#ApplianceExchangeNepal #SamakhusiElectronics #PuranoFridge #RingRoadElectronics",
  },
  {
    id: "gmb-1",
    platform: "Google Business (GMB)",
    iconBg: "bg-amber-600",
    date: "August 2026",
    tag: "📍 Verified Local Store",
    title: "Serving Kathmandu for 20+ Years — Near Tokha Road & Ring Road",
    body: "Join Electronic Center at Samakhushi Chowk, Tokha Road is open 7 days a week (9:30 AM – 8:00 PM). Shop 378+ verified smart appliances with official brand warranties, 0% EMI installments, and certified recondition units.",
    url: "https://maps.google.com/?q=Join+Electronic+Center+Samakhushi+Kathmandu",
    ctaText: "View on Google Maps",
    metrics: "4.9 ★ Rating • 250+ Customer Reviews",
    hashtags: "#SamakhusiElectronics #KathmanduSecondHand",
  },
  {
    id: "tiktok-1",
    platform: "TikTok",
    iconBg: "bg-rose-600",
    date: "August 2026",
    tag: "🎬 Viral Stock Video",
    title: "Stock Clearance: Inverter Washing Machines at Rs 35,000",
    body: "Unboxing heavy-duty 7.0kg, 7.5kg and 8.0kg front-load inverter washers with 99.9% steam sanitization and ultra-silent BLDC motors. Tested and verified in our Samakhushi showroom. Limited units available!",
    url: "https://www.tiktok.com/@joinelectronicscentre",
    ctaText: "Watch on TikTok",
    metrics: "12.4K Views • 850 Likes • 94 Shares",
    hashtags: "#ReconditionFridgeKtm #SastoFridge",
  },
];

export function SocialMediaFeed() {
  const [activeTab, setActiveTab] = useState("all");

  const filteredPosts = activeTab === "all" 
    ? SOCIAL_POSTS 
    : SOCIAL_POSTS.filter((p) => p.platform.toLowerCase().includes(activeTab));

  const whatsapp = "9779851045662";

  return (
    <section id="social" className="py-16 bg-slate-950/90 border-b border-slate-800 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-2">
          <div className="inline-flex items-center space-x-2 bg-blue-500/10 border border-blue-500/30 px-3.5 py-1 rounded-full text-xs font-bold text-blue-400">
            <Share2 className="w-4 h-4" />
            <span>LIVE SOCIAL CHANNELS & COMMUNITY UPDATES</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Follow Join Electronic Center on <span className="text-gradient-blue">TikTok, FB & Google</span>
          </h2>
          <p className="text-slate-300 text-sm">
            Check our latest showroom unboxings, clearance video reels, flash festival discounts, and verified customer reviews.
          </p>
        </div>

        {/* Top 4 Social Channel Connect Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {SOCIAL_PLATFORMS.map((platform) => (
            <a
              key={platform.name}
              href={platform.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`glass-panel p-5 rounded-2xl border ${platform.border} hover:scale-[1.02] transition-all duration-200 flex items-center justify-between group shadow-sm`}
            >
              <div className="flex items-center space-x-3.5">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${platform.color} flex items-center justify-center font-black text-xl text-white shadow-md flex-shrink-0`}>
                  {platform.icon}
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-white group-hover:text-blue-300 transition">
                    {platform.name}
                  </h3>
                  <p className="text-xs text-slate-400 font-medium mt-0.5">{platform.followers}</p>
                </div>
              </div>

              <div className="p-2 rounded-lg bg-slate-900 text-slate-400 group-hover:text-white group-hover:bg-slate-800 transition">
                <ExternalLink className="w-4 h-4" />
              </div>
            </a>
          ))}
        </div>

        {/* Filter Filter Tabs */}
        <div className="flex items-center justify-center space-x-2 mb-8">
          {[
            { id: "all", label: "All Updates" },
            { id: "facebook", label: "Facebook Posts" },
            { id: "tiktok", label: "TikTok Deals" },
            { id: "google", label: "Google Business (GMB)" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition cursor-pointer border ${
                activeTab === tab.id
                  ? "bg-blue-600 border-blue-400 text-white shadow-md"
                  : "glass-panel text-slate-300 hover:bg-slate-900 border-slate-800"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Social Posts Stream Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredPosts.map((post) => (
            <div
              key={post.id}
              className="glass-panel p-6 sm:p-7 rounded-3xl border border-slate-800/90 flex flex-col justify-between space-y-4 hover:border-slate-600 transition duration-300"
            >
              <div className="space-y-3">
                
                {/* Post Top Meta */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <span className={`${post.iconBg} text-white text-xs font-black px-2.5 py-1 rounded-lg flex items-center space-x-1`}>
                      <span>{post.platform}</span>
                    </span>
                    <span className="text-[11px] font-bold text-amber-300 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-md">
                      {post.tag}
                    </span>
                  </div>
                  <span className="text-xs text-slate-400">{post.date}</span>
                </div>

                {/* Post Headline */}
                <h3 className="font-extrabold text-base sm:text-lg text-white leading-snug">
                  {post.title}
                </h3>

                {/* Post Body */}
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {post.body}
                </p>

              </div>

              {/* Post Footer Actions */}
              <div className="pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <span className="text-[11px] font-semibold text-slate-400">
                  {post.metrics}
                </span>

                <div className="flex items-center space-x-2">
                  <a
                    href={`https://wa.me/${whatsapp}?text=${encodeURIComponent(`Namaste Join Electronic Center! I saw your post regarding: "${post.title}". Please send me current price and availability.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2 px-3 rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-600 hover:text-white font-bold text-[11px] flex items-center space-x-1.5 transition"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Send Message</span>
                  </a>

                  <a
                    href={post.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-bold text-[11px] flex items-center space-x-1 transition"
                  >
                    <span>{post.ctaText}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

            </div>
          ))}
        </div>

        {/* Strategy Toolkit for Social Bios & Hamrobazaar Listings */}
        <div className="mt-12 p-6 sm:p-8 rounded-3xl glass-panel border border-slate-800 bg-slate-900/60 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <span className="text-[11px] font-black uppercase tracking-wider text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-md">
                Local Organic Reach Toolkit
              </span>
              <h3 className="text-xl font-black text-white mt-1">
                Social Bio, Viral Hashtags & Hamrobazaar Copy Templates
              </h3>
            </div>
            <span className="text-xs text-slate-400">Capture local Kathmandu & Ring Road buyers</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* 1. Social Bio Card */}
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2.5 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-blue-400 uppercase tracking-wide">1. Optimized Social Bio</span>
                <p className="text-[11px] text-slate-400">Set for Facebook Page, TikTok Bio & Instagram Profile:</p>
                <div className="p-3 mt-2 rounded-xl bg-slate-900 border border-slate-800 font-mono text-xs text-amber-300 select-all">
                  "Recondition & New Home Appliances in Samakhusi | Exchange Available"
                </div>
              </div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText("Recondition & New Home Appliances in Samakhusi | Exchange Available");
                  alert("Copied Social Bio to clipboard!");
                }}
                className="w-full py-2 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 text-xs font-bold transition cursor-pointer"
              >
                Copy Social Bio
              </button>
            </div>

            {/* 2. Viral Hashtags Card */}
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2.5 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-rose-400 uppercase tracking-wide">2. Algorithm Hashtag Set</span>
                <p className="text-[11px] text-slate-400">Add to TikTok reels, Facebook reels & YouTube shorts:</p>
                <div className="p-3 mt-2 rounded-xl bg-slate-900 border border-slate-800 font-mono text-[11px] text-rose-300 select-all leading-relaxed">
                  #PuranoFridge #SecondHandFridgeNepal #SamakhusiElectronics #ReconditionFridgeKtm #SastoFridge #KathmanduSecondHand #ApplianceExchangeNepal #RingRoadElectronics
                </div>
              </div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText("#PuranoFridge #SecondHandFridgeNepal #SamakhusiElectronics #ReconditionFridgeKtm #SastoFridge #KathmanduSecondHand #ApplianceExchangeNepal #RingRoadElectronics");
                  alert("Copied Hashtag Set to clipboard!");
                }}
                className="w-full py-2 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 text-xs font-bold transition cursor-pointer"
              >
                Copy Hashtag Set
              </button>
            </div>

            {/* 3. Hamrobazaar Copy Card */}
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2.5 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wide">3. Hamrobazaar Listing Template</span>
                <p className="text-[11px] text-slate-400">Tag under Samakhusi / Tokha Location:</p>
                <div className="p-3 mt-2 rounded-xl bg-slate-900 border border-slate-800 font-mono text-[11px] text-emerald-300 select-all leading-relaxed">
                  <strong>Title:</strong> Recondition Single/Double Door Fridge - Exchange Available (Samakhusi)<br />
                  <strong>Location:</strong> Samakhusi Chowk, Tokha Road (Near Ring Road)
                </div>
              </div>
              <button
                onClick={() => {
                  const adText = `Title: Recondition Single/Double Door Fridge - Exchange Available (Samakhusi)\nLocation: Samakhusi Chowk, Tokha Road, Kathmandu\nPrice: Starting Rs 11,500 (Old Fridge Exchange up to Rs 8,000)\nContact: 9851045662 / 9765985999\nDetails: Certified 100% cooling tested single/double door refrigerators with 30-day testing warranty & free delivery.\nTags: #PuranoFridge #SecondHandFridgeNepal #SamakhusiElectronics #ReconditionFridgeKtm #SastoFridge #KathmanduSecondHand #ApplianceExchangeNepal #RingRoadElectronics`;
                  navigator.clipboard.writeText(adText);
                  alert("Copied Hamrobazaar Listing Template to clipboard!");
                }}
                className="w-full py-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-xs font-bold transition cursor-pointer"
              >
                Copy Hamrobazaar Template
              </button>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
