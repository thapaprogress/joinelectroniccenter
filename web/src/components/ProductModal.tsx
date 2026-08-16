"use client";

import React, { useState } from "react";
import Image from "next/image";
import { 
  X, 
  MessageCircle, 
  Phone, 
  ShieldCheck, 
  Truck, 
  RefreshCw, 
  CheckCircle2, 
  PlusCircle, 
  Sparkles,
  Check
} from "lucide-react";

interface ProductModalProps {
  product: any | null;
  onClose: () => void;
  onOpenExchange: () => void;
}

export function ProductModal({ product, onClose, onOpenExchange }: ProductModalProps) {
  if (!product) return null;

  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);

  const whatsapp = product.whatsapp || "9779851045662";
  const phone = "9851045662";
  const catLower = (product.category?.name || product.category || "").toLowerCase();

  // Category specific high-margin upsells
  const availableUpsells = [
    ...(catLower.includes("television") || catLower.includes("tv") ? [
      { id: "wall_mount", name: "Heavy Full-Motion Wall Mount & Free Fitting", price: 1800, badge: "Popular" },
      { id: "surge_guard", name: "Spike Guard & HDMI 2.1 Ultra 4K Cable", price: 950, badge: "Essential" },
    ] : []),
    ...(catLower.includes("refrigerator") || catLower.includes("fridge") ? [
      { id: "stabilizer", name: "Automatic Heavy-Duty Voltage Stabilizer", price: 3200, badge: "Recommended" },
      { id: "stand", name: "Heavy Rust-Free Base Stand with Wheels", price: 1200, badge: "Convenient" },
    ] : []),
    ...(catLower.includes("washing") ? [
      { id: "wm_stand", name: "Anti-Vibration Shock-Absorbing Stand & Cover", price: 1400, badge: "Best Value" },
      { id: "inlet_hose", name: "Heavy-Duty Inlet Hose & Water Filter", price: 650, badge: "Protection" },
    ] : []),
    ...(catLower.includes("conditioner") || catLower.includes("ac") ? [
      { id: "ac_stabilizer", name: "4kVA Heavy Digital AC Voltage Stabilizer", price: 4200, badge: "Recommended" },
      { id: "ac_outdoor_bracket", name: "Anti-Rust Heavy Galvanized Outdoor Bracket", price: 1800, badge: "Durable" },
    ] : []),
    { id: "extended_warranty", name: "1-Year Extended Comprehensive Store Warranty", price: 1999, badge: "Peace of Mind" },
  ];

  const toggleAddon = (id: string) => {
    if (selectedAddons.includes(id)) {
      setSelectedAddons(selectedAddons.filter((item) => item !== id));
    } else {
      setSelectedAddons([...selectedAddons, id]);
    }
  };

  const addonsTotal = selectedAddons.reduce((sum, id) => {
    const item = availableUpsells.find((u) => u.id === id);
    return sum + (item ? item.price : 0);
  }, 0);

  const basePrice = product.mrpNpr || 0;
  const grandTotal = basePrice + addonsTotal;

  // Build image src
  const imageSrc = product.hasLocalPhoto && product.photoPath
    ? `/${product.photoPath.startsWith("/") ? product.photoPath.slice(1) : product.photoPath}`
    : (product.imageUrl || "/images/hero-showroom.jpg");

  const selectedAddonNames = selectedAddons
    .map((id) => availableUpsells.find((u) => u.id === id)?.name)
    .filter(Boolean);

  const whatsappMessage = `Namaste Join Electronic Center! I want to purchase:
Model: ${product.modelCode}
Product: ${product.name}
Base Price: Rs ${basePrice.toLocaleString("en-NP")}
${selectedAddonNames.length > 0 ? `Bundled Add-Ons:\n${selectedAddonNames.map(n => `- ${n}`).join("\n")}\n` : ""}Grand Total: Rs ${grandTotal.toLocaleString("en-NP")}

Please confirm availability and delivery time for Kathmandu Valley!`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div 
        className="relative w-full max-w-4xl glass-panel-glow bg-slate-950 border border-slate-700/80 rounded-3xl overflow-hidden shadow-2xl my-8 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-slate-900/90 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-700 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-6 sm:p-8">
          
          {/* Left Column: Image Gallery */}
          <div className="md:col-span-5 flex flex-col justify-between space-y-4">
            <div className="relative h-72 sm:h-80 w-full rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 flex items-center justify-center p-4">
              <Image
                src={imageSrc}
                alt={product.name}
                fill
                className="object-contain p-3"
                sizes="(max-width: 768px) 100vw, 400px"
              />
              <div className="absolute top-3 left-3 bg-blue-600/90 text-white text-[11px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider shadow">
                {product.brand?.name || product.brand}
              </div>
            </div>

            {/* Value Guarantees */}
            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex items-center space-x-2 bg-slate-900/80 border border-slate-800 p-2.5 rounded-xl">
                <ShieldCheck className="w-4 h-4 text-purple-400 flex-shrink-0" />
                <span>{product.warranty || "100% Genuine Official Brand Warranty"}</span>
              </div>
              <div className="flex items-center space-x-2 bg-slate-900/80 border border-slate-800 p-2.5 rounded-xl">
                <Truck className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <span>Free Doorstep Delivery & Setup Inside Valley</span>
              </div>
            </div>
          </div>

          {/* Right Column: Details, Upsells, Pricing & Actions */}
          <div className="md:col-span-7 space-y-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center space-x-2 text-xs text-slate-400 font-semibold mb-1">
                <span>Category: {product.category?.name || product.category}</span>
                <span>•</span>
                <span className="font-mono text-blue-400">Model: {product.modelCode}</span>
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-white leading-snug">
                {product.name}
              </h2>

              {/* Price & EMI block */}
              <div className="flex items-baseline justify-between p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 my-3">
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase tracking-wider font-semibold">Store Price</span>
                  <span className="text-2xl font-black text-amber-400">
                    Rs {grandTotal.toLocaleString("en-NP")}
                  </span>
                  {addonsTotal > 0 && (
                    <span className="text-[11px] text-slate-400 ml-2">
                      (Base Rs {basePrice.toLocaleString("en-NP")} + Rs {addonsTotal.toLocaleString("en-NP")} add-ons)
                    </span>
                  )}
                </div>
                {product.emiMonthly12 && (
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block uppercase tracking-wider font-semibold">Easy EMI</span>
                    <span className="text-base font-extrabold text-emerald-400">
                      Rs {Math.round(product.emiMonthly12).toLocaleString("en-NP")}/mo
                    </span>
                  </div>
                )}
              </div>

              {/* Smart High-Margin Upsell Add-On Selector */}
              <div className="space-y-2 my-3 p-3.5 rounded-2xl bg-slate-900/70 border border-blue-500/20">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-wider font-extrabold text-blue-300 flex items-center space-x-1">
                    <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                    <span>Frequently Bought Together (Add-On Deals):</span>
                  </span>
                </div>

                <div className="space-y-1.5 pt-1">
                  {availableUpsells.map((addon) => {
                    const isChecked = selectedAddons.includes(addon.id);
                    return (
                      <div
                        key={addon.id}
                        onClick={() => toggleAddon(addon.id)}
                        className={`p-2 rounded-xl border text-xs flex items-center justify-between cursor-pointer transition ${
                          isChecked
                            ? "bg-blue-600/20 border-blue-400 text-white"
                            : "bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-900"
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <div className={`w-4 h-4 rounded-md border flex items-center justify-center ${
                            isChecked ? "bg-blue-600 border-blue-400" : "border-slate-600 bg-slate-900"
                          }`}>
                            {isChecked && <Check className="w-3 h-3 text-white" />}
                          </div>
                          <div>
                            <span className="font-semibold">{addon.name}</span>
                            <span className="ml-2 text-[10px] bg-amber-400/20 text-amber-300 px-1 py-0.2 rounded font-bold">
                              {addon.badge}
                            </span>
                          </div>
                        </div>
                        <span className="font-bold text-emerald-400 ml-2">
                          +Rs {addon.price.toLocaleString("en-NP")}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Specs Breakdown */}
              <div>
                <h3 className="text-xs uppercase tracking-wider font-bold text-slate-300 mb-1.5">
                  Key Specifications
                </h3>
                <div className="max-h-28 overflow-y-auto space-y-1 pr-2 custom-scrollbar text-xs">
                  {Array.isArray(product.specsList) && product.specsList.length > 0 ? (
                    product.specsList.map((spec: string, i: number) => (
                      <div key={i} className="flex items-start space-x-1.5 text-slate-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 mt-0.5 flex-shrink-0" />
                        <span>{spec}</span>
                      </div>
                    ))
                  ) : product.detailedSpecs ? (
                    product.detailedSpecs.split(";").map((s: string, i: number) => (
                      <div key={i} className="flex items-start space-x-1.5 text-slate-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 mt-0.5 flex-shrink-0" />
                        <span>{s.trim()}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-slate-400">Official distributor warranty terms apply.</p>
                  )}
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <a
                href={`https://wa.me/${whatsapp}?text=${encodeURIComponent(whatsappMessage)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 transition shadow-lg shadow-emerald-950/40 flex items-center justify-center space-x-2 cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Send Message on WhatsApp (Rs {grandTotal.toLocaleString("en-NP")})</span>
              </a>

              <div className="grid grid-cols-2 gap-2">
                <a
                  href={`tel:${phone}`}
                  className="py-2.5 rounded-xl text-xs font-semibold text-slate-200 bg-slate-900 border border-slate-700 hover:bg-slate-800 flex items-center justify-center space-x-1.5"
                >
                  <Phone className="w-3.5 h-3.5 text-blue-400" />
                  <span>Call Store ({phone})</span>
                </a>

                <button
                  onClick={() => {
                    onClose();
                    onOpenExchange();
                  }}
                  className="py-2.5 rounded-xl text-xs font-semibold text-amber-300 bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/20 flex items-center justify-center space-x-1.5 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
                  <span>Exchange Old Device</span>
                </button>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
