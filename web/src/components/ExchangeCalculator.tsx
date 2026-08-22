"use client";

import React, { useState } from "react";
import Image from "next/image";
import { RefreshCw, CheckCircle2, MessageCircle, ArrowRight, Sparkles, AlertCircle } from "lucide-react";
import { trackEvent } from "@/lib/track-client";

export function ExchangeCalculator() {
  const [category, setCategory] = useState<"tv" | "fridge" | "wm" | "ac">("tv");
  const [itemType, setItemType] = useState<string>("led_smart");
  const [condition, setCondition] = useState<"working" | "minor_fault" | "dead">("working");
  const [customerPhone, setCustomerPhone] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // Valuation algorithm
  const calculateEstimate = () => {
    let base = 3000;
    if (category === "tv") {
      if (itemType === "crt") base = 1500;
      else if (itemType === "led_small") base = 3500;
      else if (itemType === "led_smart") base = 6000;
      else if (itemType === "led_large") base = 8000;
    } else if (category === "fridge") {
      if (itemType === "single_door") base = 4000;
      else if (itemType === "double_door") base = 7500;
      else if (itemType === "side_by_side") base = 8500;
    } else if (category === "wm") {
      if (itemType === "semi_auto") base = 3000;
      else if (itemType === "top_load") base = 5000;
      else if (itemType === "front_load") base = 7000;
    } else if (category === "ac") {
      base = 6500;
    }

    if (condition === "minor_fault") base = Math.round(base * 0.7);
    if (condition === "dead") base = Math.round(base * 0.45);

    return Math.max(1000, base);
  };

  const estimatedCashback = calculateEstimate();
  const whatsapp = "9779851045662";

  const handleWhatsAppClaim = async () => {
    trackEvent("SubmitForm", {
      form_type: "exchange_claim",
      category,
      condition,
      value: estimatedCashback,
      currency: "NPR",
    });
    const text = `Namaste Join Electronic Center (Samakhusi Chowk)! 
Malai purano saman exchange (sata pata) garera naya wa recondition appliance linu chha.
- Category: ${category.toUpperCase()}
- Old Model: ${itemType}
- Condition: ${condition}
- Estimated Exchange Cashback: Rs ${estimatedCashback.toLocaleString("en-NP")}

Purano device ko photo pathaudai chhu, please valuation confirm garera pickup process bataidinus.`;

    // Save lead to database silently
    if (customerPhone) {
      try {
        await fetch("/api/inquiries", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: "Exchange Customer",
            phone: customerPhone,
            type: "exchange",
            message: `Exchange request: ${category} (${itemType}) in ${condition} condition. Valuation: Rs ${estimatedCashback}`,
            estimatedValue: estimatedCashback,
            oldItemCondition: condition,
          }),
        });
      } catch (err) {
        console.error(err);
      }
    }

    window.open(`https://wa.me/${whatsapp}?text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <section id="exchange" className="py-16 bg-slate-950/80 border-b border-slate-800 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center space-x-2 bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-full text-xs font-bold text-amber-300">
            <RefreshCw className="w-4 h-4 text-amber-400" />
            <span>KATHMANDU OLD APPLIANCE TRADE-IN PROGRAM</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white">
            Exchange Old TV & Refrigerator for <span className="text-gradient-gold">Instant Cash Discount</span>
          </h2>
          <p className="text-slate-300 text-sm sm:text-base">
            Don&apos;t let old appliances collect dust. Get up to <strong>Rs 8,000 cashback</strong> deducted directly from your new 4K TV, Frost-Free Fridge, or Washing Machine purchase with free valley doorstep pickup!
          </p>
        </div>

        {/* Calculator Widget Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Inputs Card */}
          <div className="lg:col-span-7 glass-panel p-6 sm:p-8 rounded-3xl space-y-6">
            
            {/* Step 1: Select Category */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                1. Select Appliance to Exchange
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  { id: "tv", label: "Television (TV)" },
                  { id: "fridge", label: "Refrigerator" },
                  { id: "wm", label: "Washing Machine" },
                  { id: "ac", label: "Air Conditioner" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setCategory(tab.id as any);
                      if (tab.id === "tv") setItemType("led_smart");
                      else if (tab.id === "fridge") setItemType("single_door");
                      else if (tab.id === "wm") setItemType("top_load");
                    }}
                    className={`py-3 px-2 rounded-xl text-xs font-bold border text-center transition cursor-pointer ${
                      category === tab.id
                        ? "bg-blue-600 border-blue-400 text-white shadow-md shadow-blue-600/30"
                        : "bg-slate-900/80 border-slate-800 text-slate-300 hover:bg-slate-800"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Specific Type Options */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                2. Select Specific Type / Size
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {category === "tv" && (
                  <>
                    {[
                      { id: "crt", title: "CRT Box TV (Any Size)", desc: "Old bulky heavy box television" },
                      { id: "led_small", title: "24\" - 32\" Flat LCD/LED", desc: "Non-smart or standard HD" },
                      { id: "led_smart", title: "39\" - 43\" Smart TV", desc: "Full HD / 4K Smart TV" },
                      { id: "led_large", title: "50\"+ Large 4K Smart TV", desc: "Big screen smart television" },
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => setItemType(opt.id)}
                        className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                          itemType === opt.id
                            ? "bg-blue-950/80 border-blue-400 text-white"
                            : "bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-800"
                        }`}
                      >
                        <p className="font-bold text-sm">{opt.title}</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">{opt.desc}</p>
                      </button>
                    ))}
                  </>
                )}

                {category === "fridge" && (
                  <>
                    {[
                      { id: "single_door", title: "Single Door Refrigerator", desc: "180L - 215L direct cool" },
                      { id: "double_door", title: "Double Door Frost-Free", desc: "230L - 350L frost free" },
                      { id: "side_by_side", title: "Multi-Door / Side-by-Side", desc: "400L+ large refrigerator" },
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => setItemType(opt.id)}
                        className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                          itemType === opt.id
                            ? "bg-blue-950/80 border-blue-400 text-white"
                            : "bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-800"
                        }`}
                      >
                        <p className="font-bold text-sm">{opt.title}</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">{opt.desc}</p>
                      </button>
                    ))}
                  </>
                )}

                {category === "wm" && (
                  <>
                    {[
                      { id: "semi_auto", title: "Semi-Automatic Twin Tub", desc: "Two tub washer and spinner" },
                      { id: "top_load", title: "Fully-Automatic Top Load", desc: "Single tub top load" },
                      { id: "front_load", title: "Fully-Automatic Front Load", desc: "Front door heavy washing machine" },
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => setItemType(opt.id)}
                        className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                          itemType === opt.id
                            ? "bg-blue-950/80 border-blue-400 text-white"
                            : "bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-800"
                        }`}
                      >
                        <p className="font-bold text-sm">{opt.title}</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">{opt.desc}</p>
                      </button>
                    ))}
                  </>
                )}

                {category === "ac" && (
                  <div className="sm:col-span-2 p-3.5 rounded-xl border border-blue-400 bg-blue-950/80 text-white">
                    <p className="font-bold text-sm">Split / Window Air Conditioner (1.0 - 2.0 Ton)</p>
                    <p className="text-xs text-slate-300 mt-1">Indoor + outdoor unit complete set</p>
                  </div>
                )}
              </div>
            </div>

            {/* Step 3: Working Condition */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                3. Current Working Condition
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {[
                  { id: "working", label: "Working Normally", desc: "Powers on & works properly" },
                  { id: "minor_fault", label: "Minor Issues / Lines", desc: "Display lines or cooling low" },
                  { id: "dead", label: "Not Working / Dead", desc: "Completely dead or broken" },
                ].map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setCondition(c.id as any)}
                    className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                      condition === c.id
                        ? "bg-amber-500/20 border-amber-400 text-amber-200 shadow-sm"
                        : "bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-300"
                    }`}
                  >
                    <p className="font-bold text-xs">{c.label}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{c.desc}</p>
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Right Calculation Result Card */}
          <div className="lg:col-span-5 glass-panel-glow p-6 sm:p-8 rounded-3xl flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-center space-x-2 text-amber-400 mb-2">
                <Sparkles className="w-5 h-5" />
                <span className="text-xs uppercase tracking-widest font-extrabold">Instant Valuation Result</span>
              </div>
              <h3 className="text-2xl font-black text-white">Estimated Exchange Value</h3>
              <p className="text-xs text-slate-300 mt-1">
                Applied as direct discount upon delivery of your new appliance!
              </p>

              {/* Big Price Display */}
              <div className="bg-slate-900/90 border border-amber-500/30 rounded-2xl p-6 my-6 text-center shadow-inner">
                <span className="text-xs text-slate-400 uppercase tracking-widest font-semibold">Cashback Voucher</span>
                <p className="text-4xl sm:text-5xl font-black text-gradient-gold my-1">
                  Rs {estimatedCashback.toLocaleString("en-NP")}
                </p>
                <span className="inline-block bg-emerald-500/20 text-emerald-400 text-xs px-2.5 py-0.5 rounded-full font-bold">
                  ✓ Free Pickup in Kathmandu Valley Included
                </span>
              </div>

              {/* Optional Phone input */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-300">
                  Your Phone / WhatsApp Number (Optional)
                </label>
                <input
                  type="tel"
                  placeholder="e.g. 98XXXXXXXX"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* Action CTA */}
            <div className="space-y-3 pt-2">
              <button
                onClick={handleWhatsAppClaim}
                className="w-full py-4 rounded-xl font-extrabold text-sm text-slate-950 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 transition shadow-lg shadow-amber-500/20 flex items-center justify-center space-x-2 cursor-pointer"
              >
                <MessageCircle className="w-5 h-5 text-slate-950" />
                <span>Claim Rs {estimatedCashback.toLocaleString("en-NP")} on WhatsApp</span>
              </button>

              <p className="text-[11px] text-center text-slate-400">
                🔒 Send a quick photo of your old device on WhatsApp for 100% final confirmation.
              </p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
