"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Phone, 
  MessageCircle, 
  ShoppingBag, 
  RefreshCw, 
  Calculator, 
  MapPin, 
  Menu, 
  X, 
  Sparkles, 
  Sun, 
  Moon,
  Trophy,
  Flame,
  Search,
  BookOpen,
  ChevronDown
} from "lucide-react";

interface NavbarProps {
  onOpenExchange: () => void;
  onOpenEmi: () => void;
  onScrollToCatalog: () => void;
  onOpenSearch?: () => void;
}

export function Navbar({ onOpenExchange, onOpenEmi, onScrollToCatalog, onOpenSearch }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
  const [isLightMode, setIsLightMode] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Scroll listener: appear only when scrolling down past 80px
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 80) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
        setMobileMenuOpen(false);
        setMoreDropdownOpen(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setMoreDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Initialize theme from localStorage or default dark
  useEffect(() => {
    const saved = localStorage.getItem("jec_theme");
    if (saved === "light") {
      setIsLightMode(true);
      document.documentElement.classList.add("light");
      document.documentElement.classList.remove("dark");
    } else {
      setIsLightMode(false);
      document.documentElement.classList.remove("light");
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    if (isLightMode) {
      document.documentElement.classList.remove("light");
      document.documentElement.classList.add("dark");
      localStorage.setItem("jec_theme", "dark");
      setIsLightMode(false);
    } else {
      document.documentElement.classList.add("light");
      document.documentElement.classList.remove("dark");
      localStorage.setItem("jec_theme", "light");
      setIsLightMode(true);
    }
  };

  const phone = "9851045662";
  const whatsapp = "9779851045662";

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out transform ${
        isVisible 
          ? "translate-y-0 opacity-100 shadow-2xl pointer-events-auto" 
          : "-translate-y-full opacity-0 pointer-events-none"
      } border-b border-slate-800/80 bg-slate-950/92 backdrop-blur-xl`}
    >
      {/* Top Announcement Bar */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 text-white text-[11px] py-1 px-3 sm:px-6 font-medium border-b border-blue-600/30">
        <div className="max-w-[1500px] mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2 truncate">
            <span className="bg-amber-400 text-slate-950 text-[10px] font-extrabold px-1.5 py-0.5 rounded leading-none shrink-0">OFFER</span>
            <span className="truncate">🔥 Old TV & Fridge Exchange: Get up to <strong>Rs 8,000 Cashback</strong> • Free Valley Delivery!</span>
          </div>
          <div className="hidden lg:flex items-center space-x-4 text-[11px] text-blue-100 font-medium shrink-0 ml-4">
            <span>📍 Samakhushi Chowk, Kathmandu</span>
            <span>⏱ Open 7 Days: 9:30 AM - 8:00 PM</span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-[1500px] mx-auto px-3 sm:px-6">
        <div className="flex items-center justify-between h-16 sm:h-18 gap-2">
          
          {/* Brand Logo & Name */}
          <div 
            className="flex items-center space-x-2.5 cursor-pointer shrink-0 select-none" 
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center font-black text-base text-white shadow-md shadow-blue-500/20 border border-blue-400/30 shrink-0">
              JEC
            </div>
            <div className="flex flex-col justify-center">
              <div className="flex items-center space-x-1.5 leading-none">
                <span className="font-black text-base sm:text-lg tracking-tight text-white whitespace-nowrap">JOIN ELECTRONIC</span>
                <span className="text-[10px] bg-blue-500/20 text-blue-400 border border-blue-500/30 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider leading-none">CENTER</span>
              </div>
              <p className="text-[10px] text-slate-400 tracking-wider uppercase font-medium mt-1 leading-none whitespace-nowrap">Samakhushi • Estd. 2004 (20+ Years)</p>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden xl:flex items-center space-x-1">
            {/* Search Pill */}
            <button
              onClick={onOpenSearch}
              className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-300 bg-slate-900/90 border border-slate-700/80 hover:border-blue-500/60 hover:text-white transition flex items-center space-x-2 cursor-pointer shrink-0 mr-1"
            >
              <Search className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <span className="hidden 2xl:inline">Search 378+ Items...</span>
              <span className="2xl:hidden">Search...</span>
              <kbd className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded border border-slate-700 leading-none">Ctrl K</kbd>
            </button>

            {/* Core Nav Links */}
            <button
              onClick={onScrollToCatalog}
              className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-200 hover:text-white hover:bg-slate-800/60 transition flex items-center space-x-1 cursor-pointer shrink-0"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <span>Catalog</span>
            </button>

            <a
              href="#top-picks"
              className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-200 hover:text-white hover:bg-slate-800/60 transition flex items-center space-x-1 cursor-pointer shrink-0"
            >
              <Trophy className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>Best Picks</span>
            </a>

            <button
              onClick={onOpenExchange}
              className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-amber-300 hover:text-amber-200 hover:bg-amber-500/10 transition flex items-center space-x-1 border border-amber-500/20 cursor-pointer shrink-0"
            >
              <RefreshCw className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>Exchange</span>
              <span className="bg-amber-400/20 text-amber-300 text-[10px] px-1 py-0.2 rounded font-bold">Rs 8K</span>
            </button>

            <button
              onClick={onOpenEmi}
              className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-200 hover:text-white hover:bg-slate-800/60 transition flex items-center space-x-1 cursor-pointer shrink-0"
            >
              <Calculator className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>EMI</span>
            </button>

            <a
              href="#clearance"
              className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-red-300 hover:text-red-200 hover:bg-red-500/10 transition flex items-center space-x-1 shrink-0"
            >
              <Flame className="w-3.5 h-3.5 text-red-400 shrink-0" />
              <span>Clearance</span>
              <span className="bg-red-500/20 text-red-300 text-[10px] px-1 py-0.2 rounded font-bold">50%</span>
            </a>

            {/* Guides Link on 2XL screens */}
            <a
              href="#blog-guides"
              className="hidden 2xl:flex px-2.5 py-1.5 rounded-lg text-xs font-semibold text-cyan-300 hover:text-cyan-200 hover:bg-cyan-500/10 transition items-center space-x-1 shrink-0"
            >
              <BookOpen className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span>Guides</span>
            </a>

            {/* More Dropdown for Guides, Reviews, Location */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setMoreDropdownOpen(!moreDropdownOpen)}
                className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/60 transition flex items-center space-x-1 cursor-pointer shrink-0"
              >
                <span>More</span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${moreDropdownOpen ? "rotate-180" : ""}`} />
              </button>

              {moreDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 rounded-xl bg-slate-900 border border-slate-700/80 shadow-2xl p-1.5 z-50 animate-in fade-in zoom-in-95">
                  <a
                    href="#blog-guides"
                    onClick={() => setMoreDropdownOpen(false)}
                    className="flex items-center space-x-2.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-200 hover:bg-slate-800 hover:text-white transition"
                  >
                    <BookOpen className="w-4 h-4 text-cyan-400" />
                    <span>2026 Buying Guides & Prices</span>
                  </a>
                  <a
                    href="#reviews"
                    onClick={() => setMoreDropdownOpen(false)}
                    className="flex items-center space-x-2.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-200 hover:bg-slate-800 hover:text-white transition"
                  >
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    <span>Customer Reviews (4.9 ★)</span>
                  </a>
                  <a
                    href="#location"
                    onClick={() => setMoreDropdownOpen(false)}
                    className="flex items-center space-x-2.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-200 hover:bg-slate-800 hover:text-white transition"
                  >
                    <MapPin className="w-4 h-4 text-red-400" />
                    <span>Store Location & Hours</span>
                  </a>
                </div>
              )}
            </div>
          </nav>

          {/* Right Action CTAs & Day/Night Toggle */}
          <div className="flex items-center space-x-2 shrink-0">
            {/* Search button on smaller screens */}
            <button
              onClick={onOpenSearch}
              className="xl:hidden p-2 rounded-xl border border-slate-700 bg-slate-900/90 text-slate-300 hover:text-white cursor-pointer shrink-0"
              title="Search Catalog"
            >
              <Search className="w-4 h-4 text-blue-400" />
            </button>

            {/* Day / Night Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 sm:p-2.5 rounded-xl border border-slate-700 bg-slate-900/90 text-slate-300 hover:text-white hover:border-slate-500 transition duration-200 cursor-pointer flex items-center justify-center shadow-sm shrink-0"
              title={isLightMode ? "Switch to Night Mode (Dark)" : "Switch to Day Mode (Light)"}
            >
              {isLightMode ? (
                <Moon className="w-4 h-4 text-indigo-400" />
              ) : (
                <Sun className="w-4 h-4 text-amber-400" />
              )}
            </button>

            {/* Phone button */}
            <a
              href={`tel:${phone}`}
              className="hidden lg:flex px-3 py-2 rounded-xl text-xs font-semibold text-slate-200 bg-slate-900/80 border border-slate-700/60 hover:border-slate-500 transition items-center space-x-1.5 shadow-sm shrink-0"
            >
              <Phone className="w-3.5 h-3.5 text-blue-400" />
              <span>{phone}</span>
            </a>

            {/* WhatsApp CTA */}
            <a
              href={`https://wa.me/${whatsapp}?text=${encodeURIComponent("Namaste Join Electronic Center! I am browsing your appliance catalog and want to check pricing/exchange offer.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 sm:px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition flex items-center space-x-1.5 shadow-lg shadow-emerald-600/20 shrink-0"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </a>

            {/* Mobile Menu Button for < XL */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-xl border border-slate-700 text-slate-300 hover:text-white cursor-pointer shrink-0"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-slate-800 bg-slate-950/98 backdrop-blur-2xl px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top-2 max-h-[85vh] overflow-y-auto">
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              if (onOpenSearch) onOpenSearch();
            }}
            className="w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium text-slate-200 hover:bg-slate-800 flex items-center space-x-2"
          >
            <Search className="w-4 h-4 text-blue-400" />
            <span>Search 378+ Products...</span>
          </button>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onScrollToCatalog();
            }}
            className="w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium text-slate-200 hover:bg-slate-800 flex items-center space-x-2"
          >
            <ShoppingBag className="w-4 h-4 text-blue-400" />
            <span>Full Catalog (378 Products)</span>
          </button>
          <a
            href="#top-picks"
            onClick={() => setMobileMenuOpen(false)}
            className="w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium text-amber-300 hover:bg-amber-500/10 flex items-center space-x-2"
          >
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>Best Picks (Editor's Choice)</span>
          </a>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenExchange();
            }}
            className="w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium text-amber-300 hover:bg-amber-500/10 flex items-center space-x-2"
          >
            <RefreshCw className="w-4 h-4 text-amber-400" />
            <span>Old TV & Fridge Exchange (Up to Rs 8,000)</span>
          </button>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenEmi();
            }}
            className="w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium text-emerald-300 hover:bg-emerald-500/10 flex items-center space-x-2"
          >
            <Calculator className="w-4 h-4 text-emerald-400" />
            <span>0% Credit Card EMI Calculator</span>
          </button>
          <a
            href="#clearance"
            onClick={() => setMobileMenuOpen(false)}
            className="w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium text-red-300 hover:bg-red-500/10 flex items-center space-x-2"
          >
            <Flame className="w-4 h-4 text-red-400" />
            <span>Refurbished & Clearance Corner (50% OFF)</span>
          </a>
          <a
            href="#blog-guides"
            onClick={() => setMobileMenuOpen(false)}
            className="w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium text-cyan-300 hover:bg-cyan-500/10 flex items-center space-x-2"
          >
            <BookOpen className="w-4 h-4 text-cyan-400" />
            <span>2026 Buying Guides & Price Lists</span>
          </a>
          <a
            href="#reviews"
            onClick={() => setMobileMenuOpen(false)}
            className="w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium text-purple-300 hover:bg-purple-500/10 flex items-center space-x-2"
          >
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span>Customer Testimonials & Reviews</span>
          </a>
          <a
            href="#location"
            onClick={() => setMobileMenuOpen(false)}
            className="w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium text-slate-200 hover:bg-slate-800 flex items-center space-x-2"
          >
            <MapPin className="w-4 h-4 text-red-400" />
            <span>Store Location & Directions (Samakhushi)</span>
          </a>
        </div>
      )}
    </header>
  );
}
