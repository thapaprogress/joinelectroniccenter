"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Lock,
  Search,
  Phone,
  MessageCircle,
  CheckCircle,
  XCircle,
  Clock,
  Tag,
  Edit3,
  Trash2,
  Eye,
  RefreshCw,
  Package,
  Star,
  Users,
  AlertCircle,
  Save,
  BookOpen,
  Globe,
  Plus,
  Sparkles,
  ArrowRight
} from "lucide-react";

interface Inquiry {
  id: string;
  name: string;
  phone: string;
  message?: string;
  productModel?: string;
  type: string;
  status: string;
  estimatedValue?: number;
  oldItemCondition?: string;
  createdAt: string;
}

interface Review {
  id: string;
  productId?: string;
  modelCode?: string;
  authorName: string;
  location: string;
  rating: number;
  title?: string;
  comment: string;
  verified: boolean;
  createdAt: string;
}

interface ProductItem {
  id: string;
  modelCode: string;
  name: string;
  brand: string | { name: string };
  category: string | { name: string };
  mrpNpr: number;
  inStock: boolean;
  featured: boolean;
  photoPath?: string;
}

interface BlogPostItem {
  slug: string;
  category: string;
  title: string;
  date: string;
  readMin: string;
  summary: string;
  content?: string;
  image?: string;
  priceHighlight?: string;
  keywords: string[];
}

interface SeoSettings {
  siteName: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  contactPhone: string;
  whatsappPhone: string;
  storeAddress: string;
  openingHours: string;
  googleSiteVerification: string;
  bingSiteVerification: string;
}

export default function AdminDashboardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [authError, setAuthError] = useState("");

  const [activeTab, setActiveTab] = useState<"leads" | "reviews" | "products" | "blogs" | "seo">("leads");

  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [blogs, setBlogs] = useState<BlogPostItem[]>([]);
  const [seo, setSeo] = useState<SeoSettings>({
    siteName: "Join Electronic Center Kathmandu",
    metaTitle: "Join Electronic Center | Smart Appliances, Old TV Exchange & 0% EMI Kathmandu",
    metaDescription: "Kathmandu's trusted home appliance showroom for 20+ years at Samakhushi Chowk.",
    keywords: ["TV price in Nepal 2026", "Old TV exchange Kathmandu", "Refrigerator price Nepal"],
    contactPhone: "9851045662",
    whatsappPhone: "9779851045662",
    storeAddress: "Samakhushi Chowk, Ring Road, Kathmandu, Nepal",
    openingHours: "Sun-Fri 09:30 - 20:00, Sat 10:00 - 18:00",
    googleSiteVerification: "eN_w_K_cmJ3DwzAIVwAXQ4dtziGlorjbp03BR3TeAYI",
    bingSiteVerification: "132FD1EBFB4DC860368794F461320DB9",
  });

  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  // Search & Edit states
  const [inquirySearch, setInquirySearch] = useState("");
  const [productSearch, setProductSearch] = useState("");
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState<number>(0);

  // New Blog Modal / Form state
  const [showBlogForm, setShowBlogForm] = useState(false);
  const [newBlog, setNewBlog] = useState<BlogPostItem>({
    slug: "",
    category: "Buying Guide",
    title: "",
    date: "Aug 21, 2026",
    readMin: "6 min read",
    summary: "",
    content: "",
    image: "/images/hero-showroom.webp",
    priceHighlight: "Best Showroom Price",
    keywords: [],
  });
  const [rawKeywords, setRawKeywords] = useState("");

  // Check stored auth
  useEffect(() => {
    const saved = localStorage.getItem("jec_admin_auth");
    if (saved === "jec2026" || saved === "admin123" || saved === "jec2026admin") {
      setIsAuthenticated(true);
      loadAllData();
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === "jec2026" || passcode === "admin123" || passcode === "jec2026admin") {
      localStorage.setItem("jec_admin_auth", passcode);
      setIsAuthenticated(true);
      setAuthError("");
      loadAllData();
    } else {
      setAuthError("Incorrect Admin PIN. Try 'jec2026'");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("jec_admin_auth");
    setIsAuthenticated(false);
  };

  const loadAllData = async () => {
    setLoading(true);
    try {
      // 1. Inquiries
      try {
        const inqRes = await fetch("/api/inquiries");
        const inqData = await inqRes.json();
        if (inqData.success) setInquiries(inqData.inquiries || []);
      } catch {}

      // 2. Reviews
      try {
        const revRes = await fetch("/api/reviews");
        const revData = await revRes.json();
        if (revData.success) setReviews(revData.reviews || []);
      } catch {}

      // 3. Products
      try {
        const catRes = await fetch("/data/catalog.json");
        const catData: any[] = await catRes.json();
        setProducts(
          catData.map((p, idx) => ({
            id: p.id || `prod_${idx}`,
            modelCode: p.model_code || p.modelCode || `JEC-${idx}`,
            name: p.item_name || p.name || `${p.brand} Appliance`,
            brand: typeof p.brand === "string" ? p.brand : p.brand?.name,
            category: typeof p.category === "string" ? p.category : p.category?.name,
            mrpNpr: Number(p.mrp_npr || p.mrpNpr || 0),
            inStock: p.in_stock !== false,
            featured: Boolean(p.featured || idx < 8),
            photoPath: p.photo_path || p.photoPath,
          }))
        );
      } catch {}

      // 4. Blogs
      try {
        const blogRes = await fetch("/api/admin/blog");
        const blogData = await blogRes.json();
        if (blogData.success) setBlogs(blogData.blogs || []);
      } catch {}

      // 5. SEO Settings
      try {
        const seoRes = await fetch("/data/seo_settings.json");
        const seoData = await seoRes.json();
        if (seoData) setSeo(seoData);
      } catch {}
    } finally {
      setLoading(false);
    }
  };

  const saveSeoSettings = async () => {
    try {
      const res = await fetch("/api/admin/seo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(seo),
      });
      const data = await res.json();
      if (data.success) {
        setStatusMessage("✓ Global SEO settings saved successfully!");
        setTimeout(() => setStatusMessage(""), 4000);
      }
    } catch {
      setStatusMessage("Failed to save SEO settings.");
    }
  };

  const handleSaveBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    const blogToSave = {
      ...newBlog,
      slug: newBlog.slug || newBlog.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
      keywords: rawKeywords.split(",").map((k) => k.trim()).filter(Boolean),
    };

    try {
      const res = await fetch("/api/admin/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "create", blog: blogToSave }),
      });
      const data = await res.json();
      if (data.success) {
        setBlogs(data.blogs);
        setShowBlogForm(false);
        setStatusMessage("✓ Blog article published successfully!");
        setTimeout(() => setStatusMessage(""), 4000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteBlog = async (slug: string) => {
    if (!confirm(`Are you sure you want to delete blog: "${slug}"?`)) return;
    try {
      const res = await fetch("/api/admin/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete", blog: { slug } }),
      });
      const data = await res.json();
      if (data.success) {
        setBlogs(data.blogs);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const updateInquiryStatus = (id: string, newStatus: string) => {
    setInquiries((prev) =>
      prev.map((inq) => (inq.id === id ? { ...inq, status: newStatus } : inq))
    );
  };

  const deleteReview = (id: string) => {
    setReviews((prev) => prev.filter((r) => r.id !== id));
  };

  const saveProductPrice = (id: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, mrpNpr: editPrice } : p))
    );
    setEditingProductId(null);
  };

  // Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-slate-900/80 border border-slate-800 rounded-3xl p-8 shadow-2xl backdrop-blur-xl">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-blue-600/20 border border-blue-500/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-blue-400" />
            </div>
            <h1 className="text-2xl font-extrabold text-white">Showroom Admin Portal</h1>
            <p className="text-xs text-slate-400 mt-1">
              Join Electronic Center Kathmandu (Samakhushi Chowk)
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Enter Admin Security PIN
              </label>
              <input
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Enter PIN (e.g. jec2026)"
                className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 focus:outline-none rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600"
                autoFocus
              />
            </div>

            {authError && (
              <div className="flex items-center gap-2 text-xs text-rose-400 bg-rose-950/40 border border-rose-800/40 rounded-lg p-2.5">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl shadow-lg transition duration-200 text-sm"
            >
              Unlock Dashboard
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link href="/" className="text-xs text-slate-500 hover:text-slate-300 transition">
              &larr; Back to Main Website
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const filteredInquiries = inquiries.filter(
    (inq) =>
      inq.name.toLowerCase().includes(inquirySearch.toLowerCase()) ||
      inq.phone.includes(inquirySearch) ||
      (inq.productModel && inq.productModel.toLowerCase().includes(inquirySearch.toLowerCase()))
  );

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.modelCode.toLowerCase().includes(productSearch.toLowerCase()) ||
      (typeof p.brand === "string" ? p.brand : p.brand?.name || "").toLowerCase().includes(productSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Bar */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center font-bold text-blue-400 text-xl">
              JEC
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-white">Join Electronic Admin Dashboard</h1>
                <span className="bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                  Connected
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Samakhushi Showroom &bull; 378 Catalog Items &bull; Blog &amp; SEO Engine
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadAllData}
              disabled={loading}
              className="inline-flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold px-3 py-2 rounded-xl border border-slate-700 transition"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
              <span>Refresh</span>
            </button>

            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold px-3 py-2 rounded-xl border border-slate-700 transition"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>View Site</span>
            </Link>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 text-xs font-semibold px-3 py-2 rounded-xl transition"
            >
              <span>Log Out</span>
            </button>
          </div>
        </div>

        {statusMessage && (
          <div className="bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-semibold p-3.5 rounded-2xl mb-6 shadow-lg">
            {statusMessage}
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-slate-800 mb-6 pb-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab("leads")}
            className={`flex items-center gap-2 text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl transition whitespace-nowrap ${
              activeTab === "leads"
                ? "bg-blue-600 text-white shadow-lg"
                : "text-slate-400 hover:text-white hover:bg-slate-900"
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Customer Leads ({inquiries.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("reviews")}
            className={`flex items-center gap-2 text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl transition whitespace-nowrap ${
              activeTab === "reviews"
                ? "bg-blue-600 text-white shadow-lg"
                : "text-slate-400 hover:text-white hover:bg-slate-900"
            }`}
          >
            <Star className="w-4 h-4" />
            <span>Reviews ({reviews.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("products")}
            className={`flex items-center gap-2 text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl transition whitespace-nowrap ${
              activeTab === "products"
                ? "bg-blue-600 text-white shadow-lg"
                : "text-slate-400 hover:text-white hover:bg-slate-900"
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Catalog &amp; Prices ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("blogs")}
            className={`flex items-center gap-2 text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl transition whitespace-nowrap ${
              activeTab === "blogs"
                ? "bg-blue-600 text-white shadow-lg"
                : "text-slate-400 hover:text-white hover:bg-slate-900"
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Buying Guides &amp; Blog ({blogs.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("seo")}
            className={`flex items-center gap-2 text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl transition whitespace-nowrap ${
              activeTab === "seo"
                ? "bg-blue-600 text-white shadow-lg"
                : "text-slate-400 hover:text-white hover:bg-slate-900"
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>SEO &amp; AEO Engine</span>
          </button>
        </div>

        {/* TAB 1: LEADS */}
        {activeTab === "leads" && (
          <div className="space-y-4">
            <div className="relative max-w-md">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search leads by customer name, phone, or model..."
                value={inquirySearch}
                onChange={(e) => setInquirySearch(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            {filteredInquiries.length === 0 ? (
              <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-12 text-center text-slate-500 text-sm">
                No customer inquiries matching filter.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {filteredInquiries.map((inq) => {
                  const replyText = encodeURIComponent(
                    `Namaste ${inq.name}! This is Join Electronic Center Samakhushi regarding your ${inq.type} inquiry for ${inq.productModel || "appliance"}. How can we assist you with showroom pricing and free delivery today?`
                  );

                  return (
                    <div
                      key={inq.id}
                      className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-white text-base">{inq.name}</span>
                          <span className="text-xs text-blue-400 font-mono bg-blue-950/60 px-2 py-0.5 rounded border border-blue-900/40">
                            {inq.phone}
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded uppercase bg-emerald-950 text-emerald-300 border border-emerald-800/40">
                            {inq.type}
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded uppercase bg-slate-800 text-slate-300">
                            {inq.status}
                          </span>
                        </div>

                        {inq.productModel && (
                          <div className="text-xs text-slate-300 font-medium">
                            Target Model: <span className="text-white">{inq.productModel}</span>
                          </div>
                        )}

                        {inq.estimatedValue ? (
                          <div className="text-xs text-emerald-400 font-semibold">
                            Trade-in Quote: Rs {inq.estimatedValue.toLocaleString("en-IN")} ({inq.oldItemCondition || "Used"})
                          </div>
                        ) : null}

                        {inq.message && (
                          <p className="text-xs text-slate-400 italic bg-slate-950/40 p-2.5 rounded-lg border border-slate-800/60">
                            "{inq.message}"
                          </p>
                        )}

                        <div className="text-[10px] text-slate-500 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> Received: {new Date(inq.createdAt).toLocaleString()}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 flex-wrap shrink-0">
                        <a
                          href={`https://wa.me/${inq.phone.replace(/[^0-9]/g, "").startsWith("977") ? inq.phone.replace(/[^0-9]/g, "") : `977${inq.phone.replace(/[^0-9]/g, "")}`}?text=${replyText}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-3 py-2 rounded-xl transition shadow"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>1-Tap WhatsApp</span>
                        </a>

                        <a
                          href={`tel:${inq.phone}`}
                          className="inline-flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold px-3 py-2 rounded-xl border border-slate-700 transition"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          <span>Call</span>
                        </a>

                        <select
                          value={inq.status}
                          onChange={(e) => updateInquiryStatus(inq.id, e.target.value)}
                          className="bg-slate-950 border border-slate-800 text-xs text-slate-300 rounded-xl px-2.5 py-2 focus:outline-none"
                        >
                          <option value="pending">Pending</option>
                          <option value="contacted">Contacted</option>
                          <option value="completed">Completed</option>
                        </select>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: REVIEWS */}
        {activeTab === "reviews" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reviews.map((rev) => (
              <div
                key={rev.id}
                className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">{rev.authorName}</span>
                      <span className="text-xs text-slate-500">({rev.location})</span>
                    </div>
                    <div className="flex text-amber-400 text-xs">
                      {"★".repeat(rev.rating)}
                      {"☆".repeat(5 - rev.rating)}
                    </div>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed mb-4">"{rev.comment}"</p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 text-xs">
                  <span className="text-emerald-400 flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" /> Verified Buyer
                  </span>
                  <button
                    onClick={() => deleteReview(rev.id)}
                    className="text-rose-400 hover:text-rose-300 flex items-center gap-1 font-semibold transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 3: PRODUCTS */}
        {activeTab === "products" && (
          <div className="space-y-4">
            <div className="relative max-w-md">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search by brand, product name, or model code..."
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950/80 text-slate-400 font-semibold border-b border-slate-800 uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="p-3.5">Model Code</th>
                      <th className="p-3.5">Product Title</th>
                      <th className="p-3.5">Brand</th>
                      <th className="p-3.5">Category</th>
                      <th className="p-3.5">MRP (NPR)</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {filteredProducts.slice(0, 50).map((prod) => {
                      const isEditing = editingProductId === prod.id;

                      return (
                        <tr key={prod.id} className="hover:bg-slate-800/40 transition">
                          <td className="p-3.5 font-mono text-blue-400 font-semibold">
                            {prod.modelCode}
                          </td>
                          <td className="p-3.5 font-medium text-white max-w-xs truncate">
                            {prod.name}
                          </td>
                          <td className="p-3.5">
                            {typeof prod.brand === "string" ? prod.brand : prod.brand?.name}
                          </td>
                          <td className="p-3.5">
                            {typeof prod.category === "string" ? prod.category : prod.category?.name}
                          </td>
                          <td className="p-3.5 font-bold text-emerald-400">
                            {isEditing ? (
                              <input
                                type="number"
                                value={editPrice}
                                onChange={(e) => setEditPrice(Number(e.target.value))}
                                className="w-24 bg-slate-950 border border-blue-500 text-white px-2 py-1 rounded focus:outline-none font-mono"
                                autoFocus
                              />
                            ) : (
                              `Rs ${prod.mrpNpr.toLocaleString("en-IN")}`
                            )}
                          </td>
                          <td className="p-3.5 text-right">
                            {isEditing ? (
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => saveProductPrice(prod.id)}
                                  className="bg-emerald-600 hover:bg-emerald-500 text-white p-1.5 rounded-lg transition"
                                  title="Save"
                                >
                                  <Save className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => setEditingProductId(null)}
                                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 p-1.5 rounded-lg transition"
                                  title="Cancel"
                                >
                                  <XCircle className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => {
                                  setEditingProductId(prod.id);
                                  setEditPrice(prod.mrpNpr);
                                }}
                                className="text-blue-400 hover:text-blue-300 p-1.5 rounded-lg hover:bg-blue-600/10 transition inline-flex items-center gap-1"
                              >
                                <Edit3 className="w-3.5 h-3.5" /> Edit Price
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: BLOGS & BUYING GUIDES */}
        {activeTab === "blogs" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white">Showroom Buying Guides ({blogs.length})</h2>
                <p className="text-xs text-slate-400">Published articles appear on homepage and /blog/ directory.</p>
              </div>
              <button
                onClick={() => setShowBlogForm(!showBlogForm)}
                className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-lg transition"
              >
                <Plus className="w-4 h-4" />
                <span>Publish New Buying Guide</span>
              </button>
            </div>

            {/* Create Blog Form Modal/Box */}
            {showBlogForm && (
              <form onSubmit={handleSaveBlog} className="bg-slate-900 border border-blue-500/40 rounded-3xl p-6 shadow-2xl space-y-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue-400" />
                  <span>Create / Edit Buying Guide</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Article Title</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Best 55 Inch 4K Smart TV in Nepal Under 1 Lakh"
                      value={newBlog.title}
                      onChange={(e) => setNewBlog({ ...newBlog, title: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">URL Slug</label>
                    <input
                      type="text"
                      placeholder="e.g. best-55-inch-4k-tv-nepal"
                      value={newBlog.slug}
                      onChange={(e) => setNewBlog({ ...newBlog, slug: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
                    <input
                      type="text"
                      placeholder="e.g. TV Buying Guide, Fridge Guide"
                      value={newBlog.category}
                      onChange={(e) => setNewBlog({ ...newBlog, category: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Price Highlight Tag</label>
                    <input
                      type="text"
                      placeholder="e.g. 55 Inch from Rs 59,990"
                      value={newBlog.priceHighlight}
                      onChange={(e) => setNewBlog({ ...newBlog, priceHighlight: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Short Excerpt / Summary</label>
                  <textarea
                    rows={2}
                    required
                    placeholder="2-sentence summary that appears on search engines and card preview..."
                    value={newBlog.summary}
                    onChange={(e) => setNewBlog({ ...newBlog, summary: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Full Article Body (Markdown / Text)</label>
                  <textarea
                    rows={6}
                    placeholder="Full article content with headings, specifications comparison, and showroom buying tips..."
                    value={newBlog.content}
                    onChange={(e) => setNewBlog({ ...newBlog, content: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Target SEO Keywords (Comma Separated)</label>
                  <input
                    type="text"
                    placeholder="e.g. TV price in Nepal 2026, 55 inch 4K TV, Smart TV Kathmandu"
                    value={rawKeywords}
                    onChange={(e) => setRawKeywords(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowBlogForm(false)}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold px-4 py-2 rounded-xl transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-5 py-2 rounded-xl shadow-lg transition"
                  >
                    Publish Article
                  </button>
                </div>
              </form>
            )}

            {/* Articles List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {blogs.map((b) => (
                <div
                  key={b.slug}
                  className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between hover:border-slate-700 transition"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold uppercase bg-blue-950 text-blue-300 border border-blue-900/40 px-2 py-0.5 rounded">
                        {b.category}
                      </span>
                      <span className="text-[11px] text-slate-500">{b.readMin}</span>
                    </div>

                    <h4 className="text-sm font-bold text-white line-clamp-2 mb-2 leading-snug">
                      {b.title}
                    </h4>

                    <p className="text-xs text-slate-400 line-clamp-2 mb-3 leading-relaxed">
                      {b.summary}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 text-xs">
                    <span className="text-emerald-400 font-semibold">{b.priceHighlight}</span>

                    <div className="flex items-center gap-3">
                      <Link
                        href={`/blog/${b.slug}`}
                        target="_blank"
                        className="text-blue-400 hover:text-blue-300 flex items-center gap-1 font-semibold"
                      >
                        <Eye className="w-3.5 h-3.5" /> View
                      </Link>

                      <button
                        onClick={() => handleDeleteBlog(b.slug)}
                        className="text-rose-400 hover:text-rose-300 flex items-center gap-1 font-semibold"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: SEO & AEO ENGINE */}
        {activeTab === "seo" && (
          <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Globe className="w-5 h-5 text-blue-400" />
                  <span>Global SEO &amp; AI Crawler (AEO) Configuration</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Directly powers meta tags, Schema.org JSON-LD, and AI agent feeds (/llms.txt).
                </p>
              </div>

              <button
                onClick={saveSeoSettings}
                className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-lg transition"
              >
                <Save className="w-4 h-4" />
                <span>Save SEO Config</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Global Meta Title
                </label>
                <input
                  type="text"
                  value={seo.metaTitle}
                  onChange={(e) => setSeo({ ...seo, metaTitle: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Showroom Contact Phone (WhatsApp)
                </label>
                <input
                  type="text"
                  value={seo.contactPhone}
                  onChange={(e) => setSeo({ ...seo, contactPhone: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Global Meta Description (Google &amp; AI Search Summary)
                </label>
                <textarea
                  rows={3}
                  value={seo.metaDescription}
                  onChange={(e) => setSeo({ ...seo, metaDescription: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-blue-500 leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Showroom Address (Local Schema.org)
                </label>
                <input
                  type="text"
                  value={seo.storeAddress}
                  onChange={(e) => setSeo({ ...seo, storeAddress: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Opening Hours
                </label>
                <input
                  type="text"
                  value={seo.openingHours}
                  onChange={(e) => setSeo({ ...seo, openingHours: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Google Site Verification Token
                </label>
                <input
                  type="text"
                  value={seo.googleSiteVerification}
                  onChange={(e) => setSeo({ ...seo, googleSiteVerification: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Bing Webmaster Verification Token
                </label>
                <input
                  type="text"
                  value={seo.bingSiteVerification}
                  onChange={(e) => setSeo({ ...seo, bingSiteVerification: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
