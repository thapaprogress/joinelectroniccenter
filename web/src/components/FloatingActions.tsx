"use client";

import React from "react";
import { MessageCircle, Phone } from "lucide-react";

export function FloatingActions() {
  const phone = "9851045662";
  const whatsapp = "9779851045662";

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end space-y-3">
      {/* Call Button (Mobile/Desktop) */}
      <a
        href={`tel:${phone}`}
        className="p-3.5 rounded-full bg-slate-900/90 text-blue-400 border border-slate-700 shadow-xl hover:bg-slate-800 hover:scale-110 transition duration-200 hidden sm:flex items-center justify-center"
        title="Call Store Now"
      >
        <Phone className="w-5 h-5" />
      </a>

      {/* Pulsing WhatsApp CTA */}
      <a
        href={`https://wa.me/${whatsapp}?text=${encodeURIComponent("Namaste Join Electronic Center! I am checking your appliance catalog and want to know today's best price/exchange offer.")}`}
        target="_blank"
        rel="noopener noreferrer"
        className="relative group p-4 rounded-full bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-2xl shadow-emerald-950/60 hover:scale-110 transition duration-200 flex items-center justify-center border border-emerald-400/40"
        title="Chat on WhatsApp"
      >
        {/* Glow Ring */}
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-40"></span>
        <MessageCircle className="w-7 h-7 relative z-10" />

        {/* Hover Tooltip */}
        <span className="absolute right-16 bg-slate-900 text-white text-xs font-bold px-3 py-1.5 rounded-xl border border-slate-700 whitespace-nowrap opacity-0 group-hover:opacity-100 transition shadow-lg pointer-events-none">
          💬 Chat Live on WhatsApp
        </span>
      </a>
    </div>
  );
}
