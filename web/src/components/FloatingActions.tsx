"use client";

import React from "react";
import { MessageCircle, Phone, Search, RefreshCw, Sparkles } from "lucide-react";
import { trackEvent } from "@/lib/track-client";

interface FloatingActionsProps {
  onOpenSearch?: () => void;
  onOpenExchange?: () => void;
}

export function FloatingActions({ onOpenSearch, onOpenExchange }: FloatingActionsProps) {
  const phone = "9851045662";
  const whatsapp = "9779851045662";

  return (
    <>
      {/* ================= DESKTOP FLOATING PILLS (Visible on sm+) ================= */}
      <div className="fixed bottom-6 right-6 z-40 hidden sm:flex flex-col items-end space-y-3">
        {/* Call Button */}
        <a
          href={`tel:${phone}`}
          className="p-3.5 rounded-full bg-slate-900/90 text-blue-400 border border-slate-700 shadow-xl hover:bg-slate-800 hover:scale-110 transition duration-200 flex items-center justify-center cursor-pointer"
          title="Call Showroom (9851045662)"
        >
          <Phone className="w-5 h-5" />
        </a>

        {/* Pulsing WhatsApp CTA */}
        <a
          href={`https://wa.me/${whatsapp}?text=${encodeURIComponent("Namaste Join Electronic Center! I am checking your appliance catalog and want to know today's best price/exchange offer.")}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackEvent("Contact", { source: "floating_whatsapp" })}
          className="relative group p-4 rounded-full bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-2xl shadow-emerald-950/60 hover:scale-110 transition duration-200 flex items-center justify-center border border-emerald-400/40 cursor-pointer"
          title="Chat on WhatsApp"
        >
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-40"></span>
          <MessageCircle className="w-7 h-7 relative z-10" />

          {/* Hover Tooltip */}
          <span className="absolute right-16 bg-slate-900 text-white text-xs font-bold px-3 py-1.5 rounded-xl border border-slate-700 whitespace-nowrap opacity-0 group-hover:opacity-100 transition shadow-lg pointer-events-none">
            💬 Chat Live on WhatsApp
          </span>
        </a>
      </div>

      {/* ================= MOBILE HIGH-CONVERSION BOTTOM BAR (Visible on mobile only) ================= */}
      <div className="fixed bottom-0 left-0 right-0 z-50 sm:hidden bg-slate-950/95 backdrop-blur-lg border-t border-slate-800/90 px-3 py-2 shadow-2xl">
        <div className="grid grid-cols-4 gap-1.5 items-center">
          {/* Quick Call */}
          <a
            href={`tel:${phone}`}
            className="flex flex-col items-center justify-center py-1.5 px-1 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 active:bg-slate-800 transition"
          >
            <Phone className="w-4 h-4 text-blue-400 mb-0.5" />
            <span className="text-[10px] font-bold">Call</span>
          </a>

          {/* Search Trigger */}
          <button
            type="button"
            onClick={onOpenSearch}
            className="flex flex-col items-center justify-center py-1.5 px-1 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 active:bg-slate-800 transition"
          >
            <Search className="w-4 h-4 text-cyan-400 mb-0.5" />
            <span className="text-[10px] font-bold">Search</span>
          </button>

          {/* Exchange Valuation */}
          <button
            type="button"
            onClick={onOpenExchange}
            className="flex flex-col items-center justify-center py-1.5 px-1 rounded-xl bg-slate-900 border border-amber-500/30 text-amber-300 active:bg-slate-800 transition"
          >
            <RefreshCw className="w-4 h-4 text-amber-400 mb-0.5" />
            <span className="text-[10px] font-bold">Exchange</span>
          </button>

          {/* WhatsApp Primary Buy CTA */}
          <a
            href={`https://wa.me/${whatsapp}?text=${encodeURIComponent("Namaste Join Electronic Center! I am browsing your mobile store and want to inquire about appliance availability.")}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackEvent("Contact", { source: "mobile_bottom_whatsapp" })}
            className="flex flex-col items-center justify-center py-1.5 px-1 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 text-white font-bold shadow-lg shadow-emerald-950/40 active:scale-95 transition"
          >
            <MessageCircle className="w-4 h-4 mb-0.5" />
            <span className="text-[10px]">WhatsApp</span>
          </a>
        </div>
      </div>
    </>
  );
}
