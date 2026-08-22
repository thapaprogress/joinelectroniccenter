import fs from "fs";
import path from "path";
import { prisma } from "@/lib/prisma";

export interface BlogPostItem {
  slug: string;
  category: string;
  title: string;
  date: string;
  readMin: string;
  summary: string;
  content: string;
  image: string;
  priceHighlight: string;
  keywords: string[];
  faqs?: { question: string; answer: string }[];
}

export const NEW_AEO_BLOGS: BlogPostItem[] = [
  {
    slug: "sasto-ma-purano-fridge-samakhusi-kathmandu",
    category: "Recondition & Exchange Hub",
    title: "Sasto Ma Purano & Recondition Fridge Kathmandu (Samakhusi Chowk Exchange Offer 2026)",
    date: "Aug 22, 2026",
    readMin: "6 min read",
    summary: "Kathmandu ma sasto ma purano fridge kinne ra purano saman sata pata (exchange) garne best thau. Certified reconditioned single door & double door refrigerators starting from Rs. 11,500 with 30-day showroom testing warranty at Samakhusi Chowk, Tokha Road.",
    image: "/images/refurbished-fridge-showroom.jpg",
    priceHighlight: "Recondition Single Door from Rs 11,500 | Double Door from Rs 18,500 | Exchange Bonus up to Rs 8,000",
    keywords: [
      "purano fridge samakhusi",
      "second hand fridge kathmandu cheap price",
      "recondition fridge samakhusi chowk",
      "used fridge exchange kathmandu",
      "purano samana phatke samakhusi",
      "cheap recondition electronic shop near ring road",
      "sasto ma purano fridge kathmandu",
      "purano fridge sata pata garne thau",
      "samakhusi ma purano electronic dokan",
      "single door used fridge sasto price",
      "recondition fridge kinne thau ktm",
      "home appliance exchange center samakhusi",
      "electronic recondition shop near tokha road",
      "second hand fridge shop ring road kathmandu",
    ],
    faqs: [
      {
        question: "Samakhusi ma sasto purano fridge kata painchha?",
        answer: "Join Electronic Center located right at Samakhusi Chowk (Tokha Road, near Ring Road bridge) has Kathmandu's largest showroom of certified reconditioned single-door and double-door refrigerators starting from Rs. 11,500 with a 30-day warranty.",
      },
      {
        question: "Purano bigreko wa chaleko fridge exchange (sata pata) hunchha?",
        answer: "Hajur, tapai ko purano fridge chahe working condition ma hos ya non-working, Join Electronic Center ma instant evaluation garera Rs. 2,000 dekhi Rs. 8,000 samma cashback bonus paunu hunchha.",
      },
      {
        question: "Recondition fridge ma k k check garera bechincha?",
        answer: "Every recondition unit undergoes a strict 5-point inspection: 100% genuine gas pressure test, compressor amperage check, new anti-bacterial door gasket seal, internal coil leak check, and deep sanitization.",
      },
      {
        question: "Kathmandu Valley bhitra home delivery hunchha?",
        answer: "Yes, we provide fast doorstep pickup for old appliances and same-day delivery for new/recondition refrigerators across Kathmandu, Lalitpur, and Bhaktapur.",
      },
    ],
    content: `
## Sasto Ma Purano Fridge & Recondition Electronics in Kathmandu (2026 Guide)

Yadi tapai **Kathmandu ma sasto ma purano fridge** khojdai hunuhunchha wa aafno **purano fridge sata pata (exchange)** garera naya lina chahanuhunchha bhane, **Join Electronic Center (Samakhusi Chowk)** tapai ko lagi best destination ho.

Hamro showroom ma **certified pre-owned & reconditioned appliances** bisesh testing garera matra showroom ma rakhincha.

---

### Recondition Fridge Price List in Kathmandu (Updated 2026)

| Category & Model | Condition Grade | Showroom Price (JEC) | Market Brand New Price | Warranty |
|---|---|---|---|---|
| **Single Door Direct Cool (170L - 190L)** | Grade A+ (Ice Cold Cooling) | **Rs. 11,500 – 14,500** | Rs. 28,000 – 34,000 | 30 Days Full Testing |
| **Whirlpool / Samsung 200L Inverter** | Grade A (Flawless Body) | **Rs. 15,500 – 18,500** | Rs. 38,000 – 44,000 | 30 Days Motor Guarantee |
| **Double Door Frost Free (230L - 260L)** | Certified Refurbished | **Rs. 21,500 – 26,000** | Rs. 48,000 – 58,000 | 45 Days Complete Warranty |
| **Deep Freezer / Chest Cooler (150L - 300L)** | Fully Serviced & Pressurized | **Rs. 16,500 – 24,000** | Rs. 36,000 – 52,000 | 30 Days Cooling Warranty |

---

### Purano Samana Sata Pata (Exchange Process)

1. **Step 1 - Send Photos on WhatsApp**: Tapai ko purano fridge ko photo ra model name hamro official WhatsApp number (**9851045662**) ma pathaunus.
2. **Step 2 - Instant Valuation**: Hamro technician le condition herera **Rs. 2,000 dekhi Rs. 8,000 samma ko instant cashback offer** provide garnuhunchha.
3. **Step 3 - Free Doorstep Pickup & Delivery**: Hamro team le tapai ko ghar mai aayera purano fridge liyera naya wa reconditioned appliance deliver garchha.

---

### Why Local Buyers Trust Join Electronic Center (Estd. 2004)
* **Prime Location**: Right at **Samakhusi Chowk, Tokha Road** (Connecting directly to Ring Road).
* **No Hidden Faults**: Hamile 100% gas leak check, compressor load test, ra thermostat calibration gareka units matra bechchhau.
* **30-Day Testing Warranty**: Kunai samasya aaye ma instant free repair wa replacement guarantee.

---

### Popular Search Queries & Hashtags
\`#PuranoFridge\` \`#SecondHandFridgeNepal\` \`#SamakhusiElectronics\` \`#ReconditionFridgeKtm\` \`#SastoFridge\` \`#KathmanduSecondHand\` \`#ApplianceExchangeNepal\` \`#RingRoadElectronics\`
`,
  },
  {
    slug: "best-refrigerator-in-nepal-under-50000",
    category: "Refrigerator Buying Guide",
    title: "Best Refrigerator in Nepal Under 50,000 (2026 Double Door & Single Door Top Picks)",
    date: "Aug 21, 2026",
    readMin: "7 min read",
    summary: "Discover the top energy-efficient refrigerators under Rs 50,000 in Nepal from Samsung, Whirlpool, and Himstar. Digital inverter power savings, stabilizer-free operation, and Kathmandu showroom exchange offers.",
    image: "/photos/Samsung/RT28C3022S8.webp",
    priceHighlight: "Single Door from Rs 29,990 | Double Door from Rs 44,900",
    keywords: ["Refrigerator price in Nepal 2026", "Best fridge under 50000", "Double door fridge Nepal", "Samsung digital inverter fridge"],
    content: `
## Finding the Best Refrigerator Under Rs. 50,000 in Kathmandu (2026)

Choosing a refrigerator for a Nepali household requires balancing three critical factors: **storage capacity for joint families**, **energy efficiency to keep NEA electricity bills low**, and **compressor reliability during Kathmandu voltage fluctuations**.

Under the **Rs. 50,000 budget bracket**, you can easily buy a premium **190L to 230L Single Door direct-cool refrigerator** or a **236L to 253L Double Door frost-free inverter model**.

---

### Top 3 Recommended Models Under Rs. 50,000:

#### 1. Samsung 236L Convertible Double Door Frost Free (RT28)
* **Capacity**: 236 Litres (Ideal for 3-5 member families)
* **Compressor**: Digital Inverter with 20-Year Warranty
* **Cooling**: All-Around Cooling & Power Freeze
* **Showroom Price at JEC**: ~Rs. 44,900 *(Save Rs. 4,500 vs Daraz)*

#### 2. Whirlpool 200L Ice Magic Pro 5-Star Direct Cool
* **Capacity**: 200 Litres (Single Door)
* **Special Features**: 9-Hour cooling retention during load shedding, Insulated Capillary Technology
* **Showroom Price at JEC**: ~Rs. 32,500

#### 3. Himstar 210L Single Door Metallic Finish (HR-210BHN)
* **Capacity**: 210 Litres
* **Special Features**: Heavy base drawer for onions and potatoes, anti-bacterial gasket
* **Showroom Price at JEC**: ~Rs. 29,990

---

### Why Buy with Old Refrigerator Exchange?
At Join Electronic Center (Samakhushi Chowk), you can bring your old, damaged, or working single door fridge and receive **up to Rs. 8,000 instant cashback bonus**, reducing your effective new purchase cost to under Rs. 38,000!
    `,
    faqs: [
      {
        question: "Which refrigerator brand is best in Nepal under 50000?",
        answer: "Samsung and Whirlpool lead the frost-free category with 10 to 20-year inverter compressor warranties, while Himstar offers the best heavy-gauge single door options under Rs 35,000."
      },
      {
        question: "Can I buy a refrigerator on 0% EMI in Kathmandu?",
        answer: "Yes, Join Electronic Center provides 0% EMI installments for 6, 12, or 18 months through major commercial bank credit cards."
      }
    ]
  },
  {
    slug: "front-load-vs-top-load-washing-machine-nepal",
    category: "Laundry Buying Guide",
    title: "Front Load vs Top Load Washing Machine in Nepal: Which Saves More Water & Power?",
    date: "Aug 21, 2026",
    readMin: "8 min read",
    summary: "Complete comparison between front-load and top-load fully automatic washing machines for Kathmandu homes. Water pressure requirements, hot steam wash, electricity units, and 2026 Nepal price lists.",
    image: "/photos/Samsung/WW80T504DAX.webp",
    priceHighlight: "Top Load from Rs 34,900 | Front Load from Rs 54,900",
    keywords: ["Front load washing machine Nepal", "Washing machine price Kathmandu", "Top load vs front load Nepal", "Samsung EcoBubble"],
    content: `
## Front Load vs. Top Load: The Ultimate Nepal Laundry Guide

When buying a washing machine in Kathmandu or Lalitpur, homeowners frequently ask: *Is a Front Load washer worth the extra Rs. 15,000–20,000 investment over a Top Load machine?*

Here is the straightforward engineering comparison based on local water quality and electricity tariffs.

---

### Key Comparison Table

| Feature | Front Load Washer | Top Load Fully Automatic | Semi-Automatic (Twin Tub) |
|---|---|---|---|
| **Water Consumption** | **Very Low (40–50L/cycle)** | Moderate (90–120L/cycle) | High (Requires manual filling) |
| **Cleaning Performance** | **Superior (Tumble + Steam)** | Good (Impeller agitation) | Basic |
| **Hot Water Wash** | Built-in heater (up to 90°C) | Cold water only (mostly) | No |
| **Water Pressure Needed** | Requires steady overhead tank / pump | Works with low water pressure | Any water source |
| **Average Nepal Price** | **Rs. 52,000 – Rs. 95,000** | **Rs. 32,000 – Rs. 48,000** | **Rs. 18,000 – Rs. 26,000** |

---

### Which One Should You Buy?
1. **Choose Front Load if**: You live in Kathmandu with municipal water tanker supply (saves 60% water), want hot steam sanitization for baby/winter clothes, and wash delicate fabrics.
2. **Choose Top Load if**: You have low overhead water pressure and want to add clothes mid-cycle without bending down.

Visit Join Electronic Center at Samakhushi Chowk to inspect live working demo units before buying!
    `,
    faqs: [
      {
        question: "How much does a front load washing machine cost in Nepal?",
        answer: "A standard 7kg to 8kg front load inverter washing machine from Samsung, Skyworth, or Panasonic costs between Rs 52,000 and Rs 75,000 with official warranty."
      }
    ]
  },
  {
    slug: "inverter-ac-price-in-nepal-2026-guide",
    category: "AC Buying Guide",
    title: "1.5 Ton Inverter AC Price in Nepal (2026 Guide): Electricity Units & Best Brands",
    date: "Aug 21, 2026",
    readMin: "7 min read",
    summary: "Calculations on monthly electricity consumption for 1 Ton vs 1.5 Ton dual inverter ACs in Kathmandu. Copper condenser durability, heating & cooling capabilities, and free installation offers.",
    image: "/photos/AURA/AU12FSWAC.webp",
    priceHighlight: "1 Ton from Rs 48,000 | 1.5 Ton from Rs 64,500",
    keywords: ["1.5 ton AC price Nepal", "Inverter AC Kathmandu", "Air conditioner price list 2026", "AURA split AC Nepal"],
    content: `
## 1.5 Ton Dual Inverter Air Conditioners in Nepal: 2026 Buying Guide

With rising summer temperatures in Kathmandu Valley and chilly winter nights, **Hot & Cold (All-Weather) Inverter Split ACs** have become an essential household appliance rather than a luxury.

---

### Room Size Sizing Guide:
* **Up to 120 sq. ft (Small Bedroom)**: **1.0 Ton Inverter AC** (Consumes ~0.8 to 1.1 units/hour)
* **120 to 180 sq. ft (Master Bedroom / Office)**: **1.5 Ton Inverter AC** (Consumes ~1.2 to 1.6 units/hour)
* **180 to 260 sq. ft (Living Hall)**: **2.0 Ton Inverter AC** (Consumes ~1.8 to 2.4 units/hour)

---

### 2026 Official Showroom Price List:
1. **AURA 1.5 Ton Dual Inverter Split AC (AU18FSWAC)**: **Rs. 64,500** (Full Copper, Turbo Cooling, 5-Yr Compressor Warranty)
2. **Skyworth 1.5 Ton Smart Inverter AC (SM-18)**: **Rs. 69,900** (Golden Fin anti-corrosion, Wi-Fi Smart Control)
3. **Panasonic 1.5 Ton Nanoe-X Anti-Bacterial AC**: **Rs. 89,000** (Japanese Air Purification)

---

### Free Valley Delivery & Installation Service
Join Electronic Center provides prompt delivery across Kathmandu, Lalitpur, and Bhaktapur with certified HVAC technician installation.
    `,
    faqs: [
      {
        question: "How many electricity units does a 1.5 ton inverter AC use in Nepal?",
        answer: "A 1.5 Ton Dual Inverter AC running for 8 hours at 24°C temperature setting consumes approximately 5 to 7 units of electricity per day, amounting to roughly Rs 50 to Rs 75 per day on standard NEA domestic rates."
      }
    ]
  },
  {
    slug: "how-to-exchange-old-tv-fridge-kathmandu",
    category: "Exchange & Cashback",
    title: "How to Exchange Old CRT/LED TV & Fridge in Kathmandu for Up to Rs 8,000 Cashback",
    date: "Aug 21, 2026",
    readMin: "5 min read",
    summary: "Step-by-step guide to exchanging broken, damaged, or working old televisions and refrigerators at Join Electronic Center Kathmandu with instant WhatsApp appraisal and free doorstep collection.",
    image: "/images/exchange-banner.webp",
    priceHighlight: "Instant Trade-In Cashback up to Rs 8,000",
    keywords: ["Old TV exchange in Nepal cashback", "Old refrigerator exchange Kathmandu", "Used appliance buyback Nepal", "Second hand electronics trade in"],
    content: `
## Upgrade Your Living Room with Kathmandu's #1 Appliance Exchange Program

Don't let your old CRT TV, small single door fridge, or semi-automatic washing machine take up precious space. **Join Electronic Center (Samakhushi Chowk, Kathmandu)** offers the Valley's most generous trade-in buyback scheme with **up to Rs. 8,000 cash discount** on any brand-new appliance.

---

### 3-Step Hassle-Free Exchange Process:

1. **Step 1: Take 2 Photos of Your Old Appliance**
   * Snap a clear front photo and a photo of the back brand label.
2. **Step 2: Send Photos on WhatsApp to 9851045662**
   * Our appraisal specialist will evaluate the appliance condition (working, minor defect, or dead) and quote you an instant guaranteed valuation within 10 minutes.
3. **Step 3: Free Delivery & Doorstep Pickup**
   * Our delivery vehicle arrives at your home in Kathmandu, Lalitpur, or Bhaktapur with your brand-new appliance, sets it up, and collects your old item on the spot!

---

### Eligible Items for Exchange:
* Any Old CRT Box TV (14", 21", 29") or Old LCD/LED TV (Damaged screens accepted)
* Any Single Door, Double Door, or Deep Freezer Refrigerator
* Any Semi-Automatic or Top Load Washing Machine

Call or WhatsApp **9851045662** today to get your trade-in cashback quote!
    `,
    faqs: [
      {
        question: "Do you accept broken or non-working old TVs for exchange?",
        answer: "Yes, Join Electronic Center accepts dead, non-working, and broken screen TVs and refrigerators for trade-in cashback."
      }
    ]
  }
];

export async function getAllBlogs(): Promise<BlogPostItem[]> {
  const blogMap = new Map<string, BlogPostItem>();

  // Add the 4 new AEO blogs first
  NEW_AEO_BLOGS.forEach((b) => blogMap.set(b.slug, b));

  // Load from DB
  try {
    const dbPosts = await prisma.blogPost.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
    });

    dbPosts.forEach((p) => {
      if (!blogMap.has(p.slug)) {
        let kw: string[] = [];
        try {
          kw = p.keywords ? JSON.parse(p.keywords) : [];
        } catch {}

        blogMap.set(p.slug, {
          slug: p.slug,
          category: p.category,
          title: p.title,
          date: p.createdAt.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
          readMin: p.readMin,
          summary: p.summary,
          content: p.content || p.summary,
          image: p.image || "/images/hero-showroom.jpg",
          priceHighlight: p.priceHighlight || "Best Price Guaranteed",
          keywords: kw,
        });
      }
    });
  } catch (err) {
    console.warn("DB blog query failed, falling back to JSON", err);
  }

  // Load from static blog.json
  try {
    const jsonPath = path.join(process.cwd(), "public", "blog", "blog.json");
    if (fs.existsSync(jsonPath)) {
      const fileData = fs.readFileSync(jsonPath, "utf-8");
      const items: any[] = JSON.parse(fileData);

      items.forEach((item) => {
        if (!blogMap.has(item.slug)) {
          blogMap.set(item.slug, {
            slug: item.slug,
            category: item.category || "Buying Guide",
            title: item.title,
            date: item.date || "Aug 2026",
            readMin: item.readMin || "5 min read",
            summary: item.summary || item.excerpt || "",
            content: item.content || item.summary || "",
            image: item.image || item.image_url || "/images/hero-showroom.jpg",
            priceHighlight: item.priceHighlight || "Showroom Deals",
            keywords: item.keywords || [],
          });
        }
      });
    }
  } catch (err) {
    console.error("Failed to read blog.json", err);
  }

  return Array.from(blogMap.values());
}

export async function getBlogBySlug(slug: string): Promise<BlogPostItem | null> {
  const all = await getAllBlogs();
  const normalized = slug.toLowerCase().trim();

  return (
    all.find(
      (b) =>
        b.slug.toLowerCase() === normalized ||
        b.slug.toLowerCase().replace(/[^a-z0-9]/g, "") === normalized.replace(/[^a-z0-9]/g, "")
    ) || null
  );
}
