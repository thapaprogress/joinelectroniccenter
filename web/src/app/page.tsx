"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { BrandMarquee } from "@/components/BrandMarquee";
import { TopPicksShowcase } from "@/components/TopPicksShowcase";
import { SponsoredBanner } from "@/components/SponsoredBanner";
import { CatalogSection } from "@/components/CatalogSection";
import { SocialProof } from "@/components/SocialProof";
import { LocationSection } from "@/components/LocationSection";
import { Footer } from "@/components/Footer";
import { FloatingActions } from "@/components/FloatingActions";
import { Product } from "@/types/product";

import { RefurbishedSection } from "@/components/RefurbishedSection";
import { ExchangeCalculator } from "@/components/ExchangeCalculator";
import { EmiCalculator } from "@/components/EmiCalculator";
import { BlogSection } from "@/components/BlogSection";
import { SocialMediaFeed } from "@/components/SocialMediaFeed";

// Lazy-load only modals
const ProductModal = dynamic(
  () => import("@/components/ProductModal").then((mod) => mod.ProductModal),
  { ssr: false }
);

const SearchModal = dynamic(
  () => import("@/components/SearchModal").then((mod) => mod.SearchModal),
  { ssr: false }
);

export default function Home() {
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | any | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Global Ctrl+K / slash key listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      } else if (
        e.key === "/" &&
        document.activeElement?.tagName !== "INPUT" &&
        document.activeElement?.tagName !== "TEXTAREA"
      ) {
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
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-blue-600 selection:text-white transition-colors duration-300 pb-16 sm:pb-0">
      {/* Navigation Header with Search */}
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

      {/* Best in Class Showcase (Best TV, Fridge, WM, AC, Cooler) */}
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

      {/* Live Inventory Catalog Section */}
      <CatalogSection
        selectedBrand={selectedBrand}
        onSelectBrand={setSelectedBrand}
        onSelectProduct={setSelectedProduct}
        onOpenExchange={scrollToExchange}
      />

      {/* Certified Refurbished / Floor Deals */}
      <RefurbishedSection
        onOpenExchange={scrollToExchange}
      />

      {/* Interactive Old Appliance Exchange Valuation Calculator */}
      <ExchangeCalculator />

      {/* 0% Monthly EMI Installment Calculator */}
      <EmiCalculator />

      {/* SEO & Buyer Knowledge Guides */}
      <BlogSection />

      {/* Social Proof & Customer Reviews */}
      <SocialProof />

      {/* Live TikTok / Instagram Video Feed */}
      <SocialMediaFeed />

      {/* Showroom Google Maps & Store Details */}
      <LocationSection />

      {/* Footer with SEO Sitemaps & Trust Badges */}
      <Footer />

      {/* Lazy Loaded Interactive Search Modal */}
      {isSearchOpen && (
        <SearchModal
          isOpen={isSearchOpen}
          onClose={() => setIsSearchOpen(false)}
          onSelectProduct={(p) => {
            setIsSearchOpen(false);
            setSelectedProduct(p);
          }}
        />
      )}

      {/* Lazy Loaded Product Detail Modal */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onOpenExchange={scrollToExchange}
        />
      )}

      {/* High-Conversion Floating Actions & Mobile Bottom Bar */}
      <FloatingActions
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenExchange={scrollToExchange}
      />
    </main>
  );
}
