"use client";

import React, { useState } from "react";
import { Calculator, Percent, ShieldCheck, MessageCircle, Building2, CheckCircle2, Send } from "lucide-react";
import { trackEvent } from "@/lib/track-client";

const BANK_PARTNERS = [
  { id: "nabil", name: "Nabil Bank (0% Credit Card EMI)", tenureMax: 18 },
  { id: "nic_asia", name: "NIC Asia Bank (Smart Installment)", tenureMax: 18 },
  { id: "global_ime", name: "Global IME Bank (Easy Pay EMI)", tenureMax: 12 },
  { id: "kumari_siddhartha", name: "Kumari / Siddhartha Bank", tenureMax: 12 },
  { id: "esewa_bnpl", name: "eSewa / Fonepay BNPL (Instant Digital)", tenureMax: 6 },
];

export function EmiCalculator() {
  const [productPrice, setProductPrice] = useState(65000);
  const [tenure, setTenure] = useState(12);
  const [downPaymentPercent, setDownPaymentPercent] = useState(20);
  const [selectedBank, setSelectedBank] = useState("nabil");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [leadSubmitted, setLeadSubmitted] = useState(false);

  const downPayment = Math.round((productPrice * downPaymentPercent) / 100);
  const financedAmount = productPrice - downPayment;
  const interestRate = 0.10;
  const totalInterest = Math.round(financedAmount * (interestRate * (tenure / 12)));
  const monthlyEmi = Math.round((financedAmount + totalInterest) / tenure);

  const whatsapp = "9779851045662";
  const bankObj = BANK_PARTNERS.find((b) => b.id === selectedBank) || BANK_PARTNERS[0];

  const handleApply = async () => {
    trackEvent("SubmitForm", {
      form_type: "emi_application",
      bank: bankObj.name,
      value: financedAmount,
      currency: "NPR",
    });
    // Log lead to database for bank commission tracking
    if (customerPhone) {
      try {
        await fetch("/api/inquiries", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: customerName || "EMI Applicant",
            phone: customerPhone,
            type: "emi",
            message: `Bank EMI Lead: ${bankObj.name} | Budget: Rs ${productPrice} | Down: Rs ${downPayment} | Monthly: Rs ${monthlyEmi}/mo for ${tenure} months`,
            estimatedValue: financedAmount,
          }),
        });
        setLeadSubmitted(true);
      } catch (err) {
        console.error(err);
      }
    }

    const text = `Namaste Join Electronic Center! I want to apply for Appliance EMI:
Bank Partner: ${bankObj.name}
Applicant Name: ${customerName || "Customer"}
Contact Number: ${customerPhone || "Provided on Chat"}
Appliance Budget: Rs ${productPrice.toLocaleString("en-NP")}
Down Payment: Rs ${downPayment.toLocaleString("en-NP")} (${downPaymentPercent}%)
Monthly Payment: Rs ${monthlyEmi.toLocaleString("en-NP")}/mo (${tenure} Months)

Please guide me on required documents and immediate approval.`;

    window.open(`https://wa.me/${whatsapp}?text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <section id="emi" className="py-16 bg-slate-950 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <div className="inline-flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full text-xs font-bold text-emerald-400">
            <Percent className="w-4 h-4" />
            <span>AFFORDABLE MONTHLY INSTALLMENTS & BANK PARTNERS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white">
            Smart Appliance <span className="text-gradient-blue">EMI & 0% Bank Plans</span>
          </h2>
          <p className="text-slate-300 text-sm">
            Partnered with leading commercial banks in Nepal for instant credit card and digital installment approvals.
          </p>
        </div>

        <div className="max-w-5xl mx-auto glass-panel p-6 sm:p-10 rounded-3xl grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Sliders and Options */}
          <div className="md:col-span-7 space-y-5">
            
            {/* Bank Selector */}
            <div>
              <label className="block text-xs font-bold uppercase text-slate-300 mb-2 flex items-center space-x-1.5">
                <Building2 className="w-4 h-4 text-blue-400" />
                <span>1. Select Financing Partner / Bank</span>
              </label>
              <select
                value={selectedBank}
                onChange={(e) => setSelectedBank(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white font-medium focus:outline-none focus:border-blue-500"
              >
                {BANK_PARTNERS.map((b) => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
            </div>

            {/* Price Slider */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-bold uppercase text-slate-300">2. Appliance Price (NPR)</label>
                <span className="text-lg font-black text-white">Rs {productPrice.toLocaleString("en-NP")}</span>
              </div>
              <input
                type="range"
                min={15000}
                max={300000}
                step={5000}
                value={productPrice}
                onChange={(e) => setProductPrice(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
              <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                <span>Rs 15,000</span>
                <span>Rs 150,000</span>
                <span>Rs 300,000</span>
              </div>
            </div>

            {/* Tenure Selection */}
            <div>
              <label className="block text-xs font-bold uppercase text-slate-300 mb-2">3. Tenure Duration</label>
              <div className="grid grid-cols-3 gap-2.5">
                {[
                  { m: 6, label: "6 Months" },
                  { m: 12, label: "12 Months (Popular)" },
                  { m: 18, label: "18 Months" },
                ].map((t) => (
                  <button
                    key={t.m}
                    onClick={() => setTenure(t.m)}
                    className={`py-2.5 px-2 rounded-xl text-xs font-bold border transition cursor-pointer ${
                      tenure === t.m
                        ? "bg-blue-600 border-blue-400 text-white shadow-md"
                        : "bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Down Payment Selection */}
            <div>
              <label className="block text-xs font-bold uppercase text-slate-300 mb-2">4. Down Payment</label>
              <div className="grid grid-cols-4 gap-2">
                {[0, 20, 30, 50].map((pct) => (
                  <button
                    key={pct}
                    onClick={() => setDownPaymentPercent(pct)}
                    className={`py-2 px-1 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                      downPaymentPercent === pct
                        ? "bg-emerald-600/30 border-emerald-400 text-emerald-300"
                        : "bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800"
                    }`}
                  >
                    {pct}% (Rs {Math.round((productPrice * pct) / 100).toLocaleString("en-NP")})
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Contact Form */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-800">
              <div>
                <label className="block text-[11px] text-slate-400 mb-1 font-semibold">Your Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Ramesh Shrestha"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-400 mb-1 font-semibold">Phone / WhatsApp Number</label>
                <input
                  type="tel"
                  placeholder="e.g. 98XXXXXXXX"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

          </div>

          {/* Result Card */}
          <div className="md:col-span-5 bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-700/80 p-6 rounded-2xl space-y-4 text-center">
            <span className="text-xs text-slate-400 uppercase tracking-widest font-semibold">Estimated Monthly Payment</span>
            
            <div className="my-1">
              <p className="text-3xl sm:text-4xl font-black text-emerald-400">
                Rs {monthlyEmi.toLocaleString("en-NP")}
              </p>
              <p className="text-xs text-slate-400 mt-1">per month for {tenure} months</p>
            </div>

            <div className="text-xs text-slate-300 space-y-1.5 pt-3 border-t border-slate-800 text-left">
              <div className="flex justify-between">
                <span className="text-slate-400">Financing Partner:</span>
                <span className="font-semibold text-blue-300 truncate">{bankObj.name.split("(")[0]}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Down Payment:</span>
                <span className="font-semibold text-white">Rs {downPayment.toLocaleString("en-NP")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Financed Principal:</span>
                <span className="font-semibold text-white">Rs {financedAmount.toLocaleString("en-NP")}</span>
              </div>
            </div>

            <button
              onClick={handleApply}
              className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center space-x-2 transition shadow-md shadow-emerald-950/40 cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Send Message & Apply on WhatsApp</span>
            </button>

            {leadSubmitted && (
              <p className="text-[11px] text-emerald-400 font-semibold flex items-center justify-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Application submitted to store desk!</span>
              </p>
            )}

            <p className="text-[10px] text-slate-400">
              ✓ Requires Citizenship copy + Salary/Bank Statement or Credit Card.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
}
