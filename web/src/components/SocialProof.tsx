"use client";

import React from "react";
import { Star, MessageCircle, ThumbsUp, ShieldCheck, Award } from "lucide-react";

export function SocialProof() {
  const reviews = [
    {
      name: "Ramesh Shrestha",
      location: "Baluwatar, Kathmandu",
      rating: 5,
      date: "2 weeks ago",
      text: "Exchanged our 8-year-old CRT TV for a Samsung 43-inch 4K Smart TV. Got Rs 6,500 exchange discount and free delivery to our home in Baluwatar on the same afternoon. Very honest and polite staff!",
      item: "Samsung 43\" 4K Smart TV",
    },
    {
      name: "Suman Maharjan",
      location: "Gongabu, Kathmandu",
      rating: 5,
      date: "1 month ago",
      text: "Bought a Whirlpool 263L Frost-Free Refrigerator with easy EMI. The process was super fast on WhatsApp, and they installed it for free within 3 hours. 20+ years of trusted service indeed.",
      item: "Whirlpool 263L Frost Free",
    },
    {
      name: "Prashant Thapa",
      location: "Samakhushi, Kathmandu",
      rating: 5,
      date: "3 weeks ago",
      text: "Best price in Kathmandu for Skyworth Washing Machine. Checked Daraz and market prices, Join Electronic Center offered better warranty terms and direct doorstep delivery. Highly recommended store!",
      item: "Skyworth Front Load Washer",
    },
  ];

  return (
    <section id="reviews" className="py-16 bg-slate-950/80 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <div className="inline-flex items-center space-x-1 text-yellow-400 bg-yellow-400/10 border border-yellow-400/20 px-3 py-1 rounded-full text-xs font-bold">
            <Star className="w-3.5 h-3.5 fill-yellow-400" />
            <Star className="w-3.5 h-3.5 fill-yellow-400" />
            <Star className="w-3.5 h-3.5 fill-yellow-400" />
            <Star className="w-3.5 h-3.5 fill-yellow-400" />
            <Star className="w-3.5 h-3.5 fill-yellow-400" />
            <span className="text-white ml-1.5 font-bold">5.0 / 5.0 Star Rated</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white">
            Trusted by <span className="text-gradient-gold">10,000+ Families</span> in Kathmandu
          </h2>
          <p className="text-slate-300 text-sm">
            Read genuine customer feedback from Facebook, TikTok community, and verified store buyers.
          </p>
        </div>

        {/* Reviews Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((rev, idx) => (
            <div key={idx} className="glass-panel p-6 rounded-3xl flex flex-col justify-between space-y-4 border border-slate-800">
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-extrabold text-white text-base">{rev.name}</h3>
                    <p className="text-xs text-slate-400">{rev.location}</p>
                  </div>
                  <div className="flex text-yellow-400">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400" />
                    ))}
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-300 italic leading-relaxed">
                  &ldquo;{rev.text}&rdquo;
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                <span className="font-semibold text-blue-400">{rev.item}</span>
                <span>{rev.date}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Facebook Community Banner */}
        <div className="mt-10 glass-panel-glow p-6 sm:p-8 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-6 border border-blue-500/20">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center text-white font-black text-2xl shadow-lg">
              f
            </div>
            <div>
              <h3 className="text-lg font-black text-white">Join 7,200+ Followers on Facebook</h3>
              <p className="text-xs text-slate-300">
                Stay updated with daily flash deals, new stock arrivals, and clearance offers.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href="https://g.page/r/CRBpNA834DU9EBM/review"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center space-x-2 transition shadow-md shadow-amber-950/30 flex-shrink-0"
            >
              <Star className="w-4 h-4 fill-slate-950" />
              <span>Write a Google Review</span>
            </a>

            <a
              href="https://www.facebook.com/joinelectroniccenter"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center space-x-2 transition shadow-md shadow-blue-900/30 flex-shrink-0"
            >
              <ThumbsUp className="w-4 h-4" />
              <span>Visit Facebook Page</span>
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
