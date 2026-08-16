"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { BrandMarquee } from "@/components/BrandMarquee";
import { TopPicksShowcase } from "@/components/TopPicksShowcase";
import { SponsoredBanner } from "@/components/SponsoredBanner";
import { CatalogSection } from "@/components/CatalogSection";
import { RefurbishedSection } from "@/components/RefurbishedSection";
import { ExchangeCalculator } from "@/components/ExchangeCalculator";
import { EmiCalculator } from "@/components/EmiCalculator";
import { BlogSection } from "@/components/BlogSection";
import { SocialProof } from "@/components/SocialProof";
import { SocialMediaFeed } from "@/components/SocialMediaFeed";
import { LocationSection } from "@/components/LocationSection";
import { Footer } from "@/components/Footer";
import { ProductModal } from "@/components/ProductModal";
import { SearchModal } from "@/components/SearchModal";
import { FloatingActions } from "@/components/FloatingActions";

export default function Home() {
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Global Ctrl+K / slash key listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      } else if (e.key === "/" && document.activeElement?.tagName !== "INPUT" && document.activeElement?.tagName !== "TEXTAREA") {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const scrollToCatalog = () => {
    const el = document.getElementById("catalog");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToExchange = () => {
    const el = document.getElementById("exchange");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToEmi = () => {
    const el = document.getElementById("emi");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-blue-600 selection:text-white transition-colors duration-300">
      {/* Navigation Header with Search & Day/Night Switcher */}
      <Navbar
        onOpenExchange={scrollToExchange}
        onOpenEmi={scrollToEmi}
        onScrollToCatalog={scrollToCatalog}
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      {/* Main Hero Showcase */}
      <Hero
        onScrollToCatalog={scrollToCatalog}
        onOpenExchange={scrollToExchange}
      />

      {/* Brand Interactive Filter Strip */}
      <BrandMarquee
        selectedBrand={selectedBrand}
        onSelectBrand={(brand) => {
          setSelectedBrand(brand);
          scrollToCatalog();
        }}
      />

      {/* Best in Class Showcase (Best TV, Fridge, WM, AC, Cooler, De-fridger) */}
      <TopPicksShowcase
        onSelectProduct={setSelectedProduct}
        onOpenExchange={scrollToExchange}
      />

      {/* Sponsored Official Brand Partner Spotlight */}
      <SponsoredBanner
        onSelectBrand={(brand) => {
          setSelectedBrand(brand);
          scrollToCatalog();
        }}
      />

      {/* Live Inventory Catalog Section with Discount Badges */}
      <CatalogSection
        selectedBrand={selectedBrand}
        onSelectBrand={setSelectedBrand}
        onSelectProduct={setSelectedProduct}
        onOpenExchange={scrollToExchange}
      />

      {/* Certified Refurbished & Clearance Corner (High-Margin Flip) */}
      <RefurbishedSection
        onOpenExchange={scrollToExchange}
      />

      {/* 2026 Buying Guides & Price Lists Section */}
      <BlogSection />

      {/* Old TV & Fridge Trade-In / Exchange Section */}
      <ExchangeCalculator />

      {/* Monthly Installment EMI & Bank Referral Calculator */}
      <EmiCalculator />

      {/* Social Proof & Customer Testimonials */}
      <SocialProof />

      {/* Live Social Media Posts & Channel Links (TikTok, Facebook, GMB) */}
      <SocialMediaFeed />

      {/* Store Location, Hours & Map */}
      <LocationSection />

      {/* Complete Footer */}
      <Footer />

      {/* Global Instant Search Autocomplete Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectProduct={(p) => setSelectedProduct(p)}
      />

      {/* Product Detail Modal with Smart Add-On Upsells */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onOpenExchange={() => {
            setSelectedProduct(null);
            scrollToExchange();
          }}
        />
      )}

      {/* Persistent WhatsApp Hotline */}
      <FloatingActions />
    </main>
  );
}
