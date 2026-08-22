import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://joinelectroniccenter.com"),
  alternates: {
    canonical: "https://joinelectroniccenter.com",
  },
  title: "Join Electronic Center | Home Appliances Store Kathmandu (Estd. 2004) - TV, Fridge, Washing Machine, AC Price Nepal",
  description:
    "Kathmandu's trusted home appliance showroom for 20+ years at Samakhushi Chowk. Shop 378+ Smart TVs, Refrigerators, Washing Machines, Air Conditioners, and Purifiers from Samsung, Whirlpool, Skyworth, Himstar, and Panasonic. Best prices vs Daraz Nepal with Old TV/Fridge Exchange (Rs 8,000 Cashback), 0% Credit Card EMI & Free Valley Delivery.",
  keywords: [
    // Brand & Store Intent
    "Join Electronic Center",
    "Join Electronic Center Kathmandu",
    "Samakhushi Chowk electronics shop",
    "electronics store near me Kathmandu",
    // High-Intent Recondition & Used Appliance Keywords
    "purano fridge samakhusi",
    "second hand fridge kathmandu cheap price",
    "recondition fridge samakhusi chowk",
    "used fridge exchange kathmandu",
    "purano samana phatke samakhusi",
    "cheap recondition electronic shop near ring road",
    // Nepali Roman Script Queries (How local buyers type online)
    "sasto ma purano fridge kathmandu",
    "purano fridge sata pata garne thau",
    "samakhusi ma purano electronic dokan",
    "single door used fridge sasto price",
    "recondition fridge kinne thau ktm",
    // Location & Category Intent
    "home appliance exchange center samakhusi",
    "electronic recondition shop near tokha road",
    "second hand fridge shop ring road kathmandu",
    // Google & Daraz Nepal High-Search Buying Queries
    "Daraz electronics Nepal price compare",
    "TV price in Nepal 2026",
    "Smart TV 32 43 55 65 inch price in Nepal",
    "Samsung Smart TV price in Nepal",
    "Skyworth 4K Google TV Nepal",
    "Refrigerator price in Nepal 2026",
    "Single door double door fridge price Nepal",
    "Whirlpool refrigerator Kathmandu price",
    "Washing machine price in Nepal",
    "Front load top load washing machine Nepal",
    "AC price in Nepal 2026 1 ton 1.5 ton 2 ton inverter",
    "Air cooler desert cooler price Kathmandu",
    "Water purifier RO UV alkaline price Nepal",
    // Exchange & Finance Intent
    "Old TV exchange in Nepal cashback",
    "Old refrigerator exchange offer Kathmandu",
    "Used appliance buyback Nepal",
    "Appliance 0 percent EMI in Kathmandu",
    "Credit card installment home appliance Nepal",
    "Himstar home appliances official price list",
    "Free home delivery electronics Kathmandu Lalitpur Bhaktapur",
    // Social & Viral Hashtags
    "PuranoFridge",
    "SecondHandFridgeNepal",
    "SamakhusiElectronics",
    "ReconditionFridgeKtm",
    "SastoFridge",
    "KathmanduSecondHand",
    "ApplianceExchangeNepal",
    "RingRoadElectronics",
  ],
  verification: {
    google: "eN_w_K_cmJ3DwzAIVwAXQ4dtziGlorjbp03BR3TeAYI",
    other: {
      "msvalidate.01": "132FD1EBFB4DC860368794F461320DB9",
    },
  },
  openGraph: {
    title: "Join Electronic Center | Smart Appliances, Old TV Exchange & 0% EMI Kathmandu",
    description:
      "378+ Certified Home Appliances with Official Brand Warranty, Old TV/Fridge Trade-in up to Rs 8,000 cashback, and Free Delivery inside Kathmandu Valley.",
    url: "https://joinelectroniccenter.com",
    siteName: "Join Electronic Center",
    images: [
      {
        url: "/images/hero-showroom.jpg",
        width: 1200,
        height: 630,
        alt: "Join Electronic Center Samakhushi Showroom Kathmandu",
      },
    ],
    locale: "en_NP",
    type: "website",
  },
};

const jsonLdStore = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ElectronicsStore",
      "@id": "https://joinelectroniccenter.com/#store",
      "name": "Join Electronic Center",
      "alternateName": "JEC Samakhushi",
      "url": "https://joinelectroniccenter.com",
      "logo": "https://joinelectroniccenter.com/images/hero-showroom.jpg",
      "image": "https://joinelectroniccenter.com/images/hero-showroom.jpg",
      "description": "Kathmandu's premier electronics showroom for Smart TVs, Refrigerators, Washing Machines, Air Conditioners, and Home Appliances with old item exchange and 0% EMI.",
      "telephone": "+977-9851045662",
      "priceRange": "NPR 2,000 - NPR 350,000",
      "paymentAccepted": "Cash, Credit Card, Fonepay, Bank Transfer, EMI Installments",
      "currenciesAccepted": "NPR",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Samakhushi Chowk, Tokha Road",
        "addressLocality": "Kathmandu",
        "addressRegion": "Bagmati",
        "postalCode": "44600",
        "addressCountry": "NP"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 27.7328,
        "longitude": 85.3168
      },
      "openingHoursSpecification": [
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
          "opens": "09:30",
          "closes": "20:00"
        }
      ],
      "areaServed": [
        { "@type": "City", "name": "Kathmandu" },
        { "@type": "City", "name": "Lalitpur" },
        { "@type": "City", "name": "Bhaktapur" }
      ]
    },
    {
      "@type": "WebSite",
      "@id": "https://joinelectroniccenter.com/#website",
      "url": "https://joinelectroniccenter.com",
      "name": "Join Electronic Center",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://joinelectroniccenter.com/?search={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    },
    {
      "@type": "FAQPage",
      "@id": "https://joinelectroniccenter.com/#faq",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "How much cashback can I get for old TV or fridge exchange in Kathmandu?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "At Join Electronic Center (Samakhushi Chowk), you can receive up to Rs 8,000 trade-in cashback bonus for your old, damaged, or working CRT/LED TVs and refrigerators against the purchase of a new appliance with free doorstep pickup."
          }
        },
        {
          "@type": "Question",
          "name": "Can I buy appliances on 0% EMI in Kathmandu?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. Join Electronic Center offers 0% interest monthly installment (EMI) facilities across all major Nepali commercial bank credit cards (including Nabil, NIC Asia, Global IME, NMB, Siddhartha) for 6, 12, or 18 month tenures."
          }
        },
        {
          "@type": "Question",
          "name": "Do you offer free delivery in Kathmandu Valley?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, we provide free same-day home delivery and professional installation inside Kathmandu, Lalitpur, and Bhaktapur."
          }
        }
      ]
    }
  ]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased dark`}>
      <head>
        {/* Schema.org Structured Data (JSON-LD) for LocalBusiness, FAQ & Search */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdStore) }}
        />

        {/* Google Analytics 4 Official Multi-line tag */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-JYNYWLHKZJ"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-JYNYWLHKZJ');
          `}
        </Script>

        {/* TikTok Pixel Code */}
        <Script id="tiktok-pixel" strategy="afterInteractive">
          {`
            !function (w, d, t) {
              w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(
var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var r="https://analytics.tiktok.com/i18n/pixel/events.js",o=n&&n.partner;ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=r,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};n=document.createElement("script")
;n.type="text/javascript",n.async=!0,n.src=r+"?sdkid="+e+"&lib="+t;e=document.getElementsByTagName("script")[0];e.parentNode.insertBefore(n,e)};
              ttq.load('DA42VCJC77U0QGTKHE8G');
              ttq.page();
            }(window, document, 'ttq');
          `}
        </Script>
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://analytics.tiktok.com" />
        <link rel="dns-prefetch" href="https://analytics.tiktok.com" />
        <meta name="google-site-verification" content="eN_w_K_cmJ3DwzAIVwAXQ4dtziGlorjbp03BR3TeAYI" />
        <meta name="msvalidate.01" content="132FD1EBFB4DC860368794F461320DB9" />
      </head>
      <body className="min-h-full flex flex-col bg-slate-950 text-slate-100">{children}</body>
    </html>
  );
}
