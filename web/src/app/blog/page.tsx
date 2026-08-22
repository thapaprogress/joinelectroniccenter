import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getAllBlogs } from "@/lib/blogs";
import { ArrowLeft, Clock, Calendar, Tag, BookOpen, Sparkles, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Home Appliance Buying Guides & Price Lists Nepal 2026 | Join Electronic Center",
  description: "Comprehensive 2026 buying guides for Smart TVs, Refrigerators, Inverter ACs, and Washing Machines in Kathmandu with price comparisons vs Daraz and old item exchange tips.",
  alternates: {
    canonical: "https://joinelectroniccenter.com/blog",
  },
};

export default async function BlogIndexPage() {
  const blogs = await getAllBlogs();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Navigation */}
        <nav className="flex items-center gap-2 text-sm text-slate-400 mb-8">
          <Link href="/" className="hover:text-white flex items-center gap-1 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Home
          </Link>
          <span>/</span>
          <span className="text-blue-400 font-medium">Buying Guides &amp; Price Lists</span>
        </nav>

        {/* Hero Header */}
        <div className="bg-gradient-to-r from-blue-900/40 via-slate-900/60 to-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-10 mb-12">
          <div className="max-w-3xl">
            <span className="text-xs font-bold text-blue-400 uppercase tracking-widest bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
              {blogs.length} Comprehensive Buying Articles
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-3 mb-3">
              Home Appliance Buying Guides &amp; Nepal Price Lists (2026)
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Expert advice on selecting the right Smart 4K TVs, Double Door Refrigerators, Inverter ACs, and Washing Machines in Kathmandu. Compare prices, energy ratings, warranty coverage, and trade-in cashback benefits before buying.
            </p>
          </div>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((b) => (
            <Link
              key={b.slug}
              href={`/blog/${b.slug}`}
              className="bg-slate-900/70 border border-slate-800 rounded-2xl overflow-hidden flex flex-col justify-between hover:border-blue-500/40 transition-all duration-300 group hover:-translate-y-1 shadow-lg"
            >
              <div>
                {/* Thumbnail */}
                <div className="relative aspect-[16/9] bg-slate-950 border-b border-slate-800/80 p-4">
                  <span className="absolute top-3 left-3 z-10 bg-blue-600/90 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    {b.category}
                  </span>
                  <Image
                    src={b.image || "/images/hero-showroom.jpg"}
                    alt={b.title}
                    fill
                    className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>

                {/* Info */}
                <div className="p-5">
                  <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                    <span>{b.date}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {b.readMin}
                    </span>
                  </div>

                  <h2 className="text-base font-bold text-white group-hover:text-blue-400 transition-colors line-clamp-2 mb-2 leading-snug">
                    {b.title}
                  </h2>

                  <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed mb-4">
                    {b.summary}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {b.keywords.slice(0, 3).map((kw) => (
                      <span key={kw} className="text-[10px] bg-slate-950 text-slate-400 px-2 py-0.5 rounded border border-slate-800">
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Price Tag & Link */}
              <div className="p-5 pt-0 border-t border-slate-800/60 mt-auto flex items-center justify-between">
                <span className="text-xs font-semibold text-emerald-400">
                  {b.priceHighlight}
                </span>
                <span className="text-xs font-bold text-blue-400 group-hover:text-blue-300 flex items-center gap-1">
                  Read <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
