"use client";

import React from "react";
import { MessageCircle, Phone, MapPin, Mail, ShieldCheck, Heart } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-950 text-slate-400 text-xs border-t border-slate-800">
      {/* Upper Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center font-black text-lg text-white">
                JEC
              </div>
              <span className="font-extrabold text-lg text-white tracking-tight">JOIN ELECTRONIC CENTER</span>
            </div>
            <p className="text-slate-300 text-xs leading-relaxed max-w-sm">
              Kathmandu&apos;s premier multi-brand appliance store serving Nepali homes for over two decades. Authorized retailer for Samsung, Whirlpool, Skyworth, Himstar, Panasonic, Hitachi, and more.
            </p>
            <div className="flex items-center space-x-2 text-[11px] text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>100% Genuine Products with Official Brand Warranty</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h3 className="font-extrabold text-white text-xs uppercase tracking-wider">Store Services</h3>
            <ul className="space-y-2">
              <li><a href="#catalog" className="hover:text-white transition">Product Catalog (378)</a></li>
              <li><a href="#exchange" className="text-amber-400 hover:underline transition">Old TV & Fridge Exchange</a></li>
              <li><a href="#emi" className="hover:text-white transition">Easy EMI Calculator</a></li>
              <li><a href="#reviews" className="hover:text-white transition">Customer Reviews</a></li>
              <li><a href="#location" className="hover:text-white transition">Store Location</a></li>
            </ul>
          </div>

          {/* Top Brands */}
          <div className="space-y-3">
            <h3 className="font-extrabold text-white text-xs uppercase tracking-wider">Top Brands</h3>
            <ul className="space-y-2">
              <li><span className="hover:text-white">Samsung Electronics</span></li>
              <li><span className="hover:text-white">Skyworth Nepal</span></li>
              <li><span className="hover:text-white">Himstar Home Appliances</span></li>
              <li><span className="hover:text-white">Whirlpool Appliances</span></li>
              <li><span className="hover:text-white">Panasonic Japan</span></li>
              <li><span className="hover:text-white">Hitachi Luxury</span></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <h3 className="font-extrabold text-white text-xs uppercase tracking-wider">Contact & Visit</h3>
            <div className="space-y-2 text-slate-300">
              <p className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                <span>Samakhushi Chowk, Tokha Road, Kathmandu, Nepal</span>
              </p>
              <p className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <span>9851045662 / 9765985999</span>
              </p>
              <p className="flex items-center space-x-2">
                <MessageCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>WhatsApp: +977 9851045662</span>
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-900 bg-slate-950/90 py-6 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-400 text-center sm:text-left">
          <p>© {currentYear} Join Electronic Center. All rights reserved. Registered in Kathmandu, Nepal.</p>
          <p className="flex items-center justify-center space-x-1">
            <span>Built for Kathmandu Homeowners with</span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
          </p>
        </div>
      </div>
    </footer>
  );
}
