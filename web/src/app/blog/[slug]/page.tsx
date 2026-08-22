import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getAllBlogs, getBlogBySlug } from "@/lib/blogs";
import { ArrowLeft, Clock, Calendar, Tag, MessageCircle, Phone, Check, ShieldCheck, Share2, Sparkles, BookOpen } from "lucide-react";

interface BlogPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const blogs = await getAllBlogs();
  return blogs.map((b) => ({
    slug: b.slug,
  }));
}

export async function generateMetadata({ params }: BlogPageProps): Promise<Metadata> {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);

  if (!blog) {
    return {
      title: "Buying Guide Not Found | Join Electronic Center Kathmandu",
    };
  }

  const title = `${blog.title} | Join Electronic Center Kathmandu`;
  const description = `${blog.summary} Official showroom pricing, exchange cashback offers, and 0% EMI at Samakhushi Chowk Kathmandu.`;

  return {
    title,
    description,
    keywords: blog.keywords,
    alternates: {
      canonical: `https://joinelectroniccenter.com/blog/${blog.slug}`,
    },
    openGraph: {
      title,
      description,
      url: `https://joinelectroniccenter.com/blog/${blog.slug}`,
      siteName: "Join Electronic Center Kathmandu",
      images: [
        {
          url: blog.image || "/images/hero-showroom.jpg",
          width: 1200,
          height: 630,
          alt: blog.title,
        },
      ],
      type: "article",
      publishedTime: blog.date,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [blog.image || "/images/hero-showroom.jpg"],
    },
  };
}

function ArticleContent({ content }: { content: string }) {
  // Split by double newline to handle blocks (paragraphs, tables, lists, headers)
  const blocks = content.trim().split(/\n\s*\n/);

  const renderInline = (text: string) => {
    // Replace **bold** with <strong> and `code` with <code>
    const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
    return parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={i} className="text-white font-bold">{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith("`") && part.endsWith("`")) {
        return (
          <code key={i} className="px-1.5 py-0.5 rounded bg-slate-800 text-amber-300 font-mono text-xs border border-slate-700">
            {part.slice(1, -1)}
          </code>
        );
      }
      return part;
    });
  };

  return (
    <div className="space-y-4">
      {blocks.map((block, idx) => {
        const trimmed = block.trim();

        // Check if it is a markdown table
        if (trimmed.startsWith("|") && trimmed.includes("\n|")) {
          const rows = trimmed.split("\n").filter((r) => r.trim().startsWith("|"));
          if (rows.length >= 2) {
            const parseCells = (row: string) =>
              row
                .split("|")
                .slice(1, -1)
                .map((c) => c.trim());

            const headerCells = parseCells(rows[0]);
            const dataRows = rows.slice(2); // Skip separator row

            return (
              <div key={idx} className="my-6 overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/80 shadow-lg">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-slate-800/90 text-white font-extrabold uppercase tracking-wider text-[11px] border-b border-slate-700">
                    <tr>
                      {headerCells.map((h, i) => (
                        <th key={i} className="py-3 px-4 sm:px-5">
                          {renderInline(h)}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-300">
                    {dataRows.map((row, rIdx) => {
                      const cells = parseCells(row);
                      return (
                        <tr key={rIdx} className="hover:bg-slate-800/40 transition">
                          {cells.map((cell, cIdx) => (
                            <td key={cIdx} className="py-3 px-4 sm:px-5 whitespace-nowrap">
                              {renderInline(cell)}
                            </td>
                          ))}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            );
          }
        }

        // Headings
        if (trimmed.startsWith("## ")) {
          return (
            <h2 key={idx} className="text-xl sm:text-2xl font-black text-white pt-6 pb-1 border-b border-slate-800/80">
              {renderInline(trimmed.replace(/^##\s+/, ""))}
            </h2>
          );
        }
        if (trimmed.startsWith("### ")) {
          return (
            <h3 key={idx} className="text-lg sm:text-xl font-bold text-blue-300 pt-4">
              {renderInline(trimmed.replace(/^###\s+/, ""))}
            </h3>
          );
        }
        if (trimmed.startsWith("#### ")) {
          return (
            <h4 key={idx} className="text-base font-bold text-amber-300 pt-2">
              {renderInline(trimmed.replace(/^####\s+/, ""))}
            </h4>
          );
        }

        // Horizontal Rule
        if (trimmed === "---") {
          return <hr key={idx} className="border-slate-800 my-6" />;
        }

        // Bullet / Ordered List
        if (trimmed.startsWith("* ") || trimmed.startsWith("- ") || /^\d+\.\s/.test(trimmed)) {
          const lines = trimmed.split("\n");
          return (
            <ul key={idx} className="space-y-2 my-3 pl-2">
              {lines.map((line, lIdx) => {
                const cleanLine = line.replace(/^(\*|-|\d+\.)\s+/, "");
                return (
                  <li key={lIdx} className="flex items-start gap-2 text-sm text-slate-300">
                    <span className="text-blue-400 mt-1 font-bold">•</span>
                    <span className="flex-1">{renderInline(cleanLine)}</span>
                  </li>
                );
              })}
            </ul>
          );
        }

        // Standard Paragraph
        return (
          <p key={idx} className="text-sm sm:text-base text-slate-300 leading-relaxed">
            {renderInline(trimmed)}
          </p>
        );
      })}
    </div>
  );
}

export default async function BlogArticlePage({ params }: BlogPageProps) {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);

  if (!blog) {
    notFound();
  }

  const allBlogs = await getAllBlogs();
  const relatedBlogs = allBlogs.filter((b) => b.slug !== blog.slug).slice(0, 3);

  // Schema.org Article & FAQPage JSON-LD
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": blog.title,
    "image": blog.image ? `https://joinelectroniccenter.com${blog.image}` : "https://joinelectroniccenter.com/images/hero-showroom.jpg",
    "description": blog.summary,
    "datePublished": "2026-08-15T09:00:00+05:45",
    "dateModified": "2026-08-21T18:00:00+05:45",
    "author": {
      "@type": "Organization",
      "name": "Join Electronic Center Kathmandu",
      "url": "https://joinelectroniccenter.com",
    },
    "publisher": {
      "@type": "Organization",
      "name": "Join Electronic Center Kathmandu",
      "logo": {
        "@type": "ImageObject",
        "url": "https://joinelectroniccenter.com/images/hero-showroom.jpg",
      },
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://joinelectroniccenter.com/blog/${blog.slug}`,
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://joinelectroniccenter.com",
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Buying Guides",
        "item": "https://joinelectroniccenter.com/blog",
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": blog.title,
        "item": `https://joinelectroniccenter.com/blog/${blog.slug}`,
      },
    ],
  };

  const whatsappMessage = encodeURIComponent(
    `Namaste Join Electronic Center! I just read your article "${blog.title}". Please share current showroom prices and available stock.`
  );

  const faqJsonLd = blog.faqs && blog.faqs.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": blog.faqs.map((f) => ({
      "@type": "Question",
      "name": f.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": f.answer,
      },
    })),
  } : null;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}

      <div className="max-w-4xl mx-auto">
        {/* Navigation Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs sm:text-sm text-slate-400 mb-6 flex-wrap">
          <Link href="/" className="hover:text-white flex items-center gap-1 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Home
          </Link>
          <span>/</span>
          <Link href="/#blog" className="hover:text-white transition-colors">
            Buying Guides
          </Link>
          <span>/</span>
          <span className="text-blue-400 font-medium truncate max-w-xs">{blog.category}</span>
        </nav>

        {/* Article Header Card */}
        <article className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-10 backdrop-blur-xl shadow-2xl overflow-hidden">
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              {blog.category}
            </span>
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-500" /> {blog.date}
            </span>
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-500" /> {blog.readMin}
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight mb-4">
            {blog.title}
          </h1>

          {/* Price Highlight Banner */}
          {blog.priceHighlight && (
            <div className="inline-flex items-center gap-2 bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 text-xs sm:text-sm font-semibold px-4 py-2 rounded-xl mb-6">
              <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{blog.priceHighlight}</span>
            </div>
          )}

          {/* Hero Featured Image */}
          {blog.image && (
            <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden mb-8 border border-slate-800 bg-slate-950">
              <Image
                src={blog.image}
                alt={blog.title}
                fill
                priority
                className="object-contain p-4"
                sizes="(max-width: 768px) 100vw, 800px"
              />
            </div>
          )}

          {/* Author Badge */}
          <div className="flex items-center justify-between py-4 border-y border-slate-800/80 mb-8 text-xs text-slate-400 flex-wrap gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-blue-600/20 border border-blue-500/40 flex items-center justify-center font-bold text-blue-400 text-sm">
                JEC
              </div>
              <div>
                <span className="font-bold text-white block">Join Electronic Center Editorial</span>
                <span>Home Appliance Specialists (Samakhushi Chowk, Kathmandu)</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={`https://wa.me/9779851045662?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 text-xs font-semibold px-3 py-1.5 rounded-lg transition"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Ask Appliance Expert</span>
              </a>
            </div>
          </div>

          {/* Article Markdown Body */}
          <div className="text-slate-300 text-sm sm:text-base leading-relaxed space-y-4">
            <p className="text-base sm:text-lg font-medium text-slate-200 leading-relaxed border-l-4 border-blue-500 pl-4 py-2 bg-slate-950/60 rounded-r-xl my-4">
              {blog.summary}
            </p>

            <ArticleContent content={blog.content} />
          </div>

          {/* Frequently Asked Questions (Romanized & English FAQs) */}
          {blog.faqs && blog.faqs.length > 0 && (
            <div className="mt-10 pt-8 border-t border-slate-800 space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-md">
                  Frequently Asked Questions (FAQ)
                </span>
              </div>
              <h3 className="text-xl font-bold text-white">
                Most Common Questions & Inquiries
              </h3>

              <div className="space-y-3 pt-2">
                {blog.faqs.map((faq, idx) => (
                  <div
                    key={idx}
                    className="p-4 sm:p-5 rounded-2xl bg-slate-950/80 border border-slate-800/80 space-y-2 hover:border-slate-700 transition"
                  >
                    <h4 className="font-bold text-sm sm:text-base text-amber-300 flex items-start gap-2">
                      <span className="text-xs text-slate-500 mt-0.5">Q{idx + 1}.</span>
                      <span>{faq.question}</span>
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-300 pl-6 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Keyword Cloud */}
          {blog.keywords && blog.keywords.length > 0 && (
            <div className="mt-8 pt-6 border-t border-slate-800">
              <span className="text-xs font-semibold text-slate-400 block mb-2">Related Search Topics:</span>
              <div className="flex flex-wrap gap-2">
                {blog.keywords.map((kw) => (
                  <span
                    key={kw}
                    className="inline-flex items-center gap-1 text-xs text-slate-300 bg-slate-950 px-3 py-1 rounded-lg border border-slate-800"
                  >
                    <Tag className="w-3 h-3 text-blue-400" />
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Showroom Booking Callout */}
          <div className="mt-10 p-6 bg-gradient-to-r from-blue-900/40 via-slate-900 to-slate-950 border border-blue-500/30 rounded-2xl">
            <h3 className="text-lg font-bold text-white mb-2">Ready to Upgrade Your Appliances?</h3>
            <p className="text-xs sm:text-sm text-slate-300 mb-4">
              Visit our Kathmandu showroom at Samakhushi Chowk to inspect live demo units, claim up to <strong>Rs 8,000 old appliance trade-in cashback</strong>, and enjoy <strong>0% EMI installments</strong> with free door-to-door delivery inside Kathmandu Valley.
            </p>

            <div className="flex flex-wrap gap-3">
              <a
                href={`https://wa.me/9779851045662?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold py-3 px-6 rounded-xl shadow-lg transition"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Inquire on WhatsApp (9851045662)</span>
              </a>

              <Link
                href="/#catalog"
                className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white text-xs sm:text-sm font-semibold py-3 px-6 rounded-xl border border-slate-700 transition"
              >
                <BookOpen className="w-4 h-4 text-blue-400" />
                <span>Browse 378+ Live Products</span>
              </Link>
            </div>
          </div>
        </article>

        {/* Related Buying Guides Carousel */}
        {relatedBlogs.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-bold text-white mb-6">More Recommended Buying Guides</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {relatedBlogs.map((r) => (
                <Link
                  key={r.slug}
                  href={`/blog/${r.slug}`}
                  className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between hover:border-blue-500/40 transition group hover:-translate-y-1"
                >
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded">
                      {r.category}
                    </span>
                    <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-blue-400 transition-colors mt-2 line-clamp-2">
                      {r.title}
                    </h4>
                  </div>
                  <span className="text-[11px] text-slate-500 mt-3 block">{r.readMin}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
