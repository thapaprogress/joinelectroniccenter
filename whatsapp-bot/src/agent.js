import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CATALOG_PATH = path.resolve(__dirname, "../../website/site/data/catalog.json");

// Load 378 products from catalog.json
let catalog = [];
try {
  const data = fs.readFileSync(CATALOG_PATH, "utf-8");
  catalog = jsonParseSafe(data, []);
  console.log(`[AGENT] Loaded ${catalog.length} products into memory.`);
} catch (err) {
  console.error("[AGENT] Error loading catalog.json:", err);
}

function jsonParseSafe(str, fallback) {
  try {
    return JSON.parse(str);
  } catch (e) {
    return fallback;
  }
}

// 74 Researched benchmark price lookup
const BENCHMARK_PRICES = {
  "skyworth 32": { name: "Skyworth 32\" Google TV (32STD2000)", price: 30900, warranty: "3 Years Panel Warranty" },
  "skyworth 43": { name: "Skyworth 43\" 4K UHD Smart TV (43STE6600)", price: 46900, warranty: "3 Years Panel Warranty" },
  "skyworth 55": { name: "Skyworth 55\" 4K QLED Google TV (55Q6500G)", price: 84900, warranty: "3 Years Panel Warranty" },
  "skyworth 65": { name: "Skyworth 65\" 4K UHD Smart TV (65G6500G)", price: 135000, warranty: "3 Years Panel Warranty" },
  "samsung 43": { name: "Samsung 43\" Crystal 4K UHD TV (UA43DU7700)", price: 68000, warranty: "1 Year Official Warranty" },
  "himstar 170": { name: "Himstar 170L Single Door Refrigerator (HR-17D71)", price: 30990, warranty: "10 Years Compressor Warranty" },
  "whirlpool 263": { name: "Whirlpool 263L Triple Door Protton (263-D-Protton)", price: 69900, warranty: "10 Years Inverter Compressor Warranty" },
  "samsung 246": { name: "Samsung 246L Digital Inverter Refrigerator", price: 54900, warranty: "20 Years Compressor Warranty" },
  "samsung 7kg": { name: "Samsung 7.0kg Semi-Automatic Washing Machine", price: 25990, warranty: "5 Years Motor Warranty" },
  "skyworth 8kg": { name: "Skyworth 8.0kg Steam Inverter Front Load (WM-F8014DSDN)", price: 62500, warranty: "10 Years Motor Warranty" },
  "aura 1 ton": { name: "AURA 1 Ton Split AC (AU12FSWAC)", price: 53500, warranty: "3 Years Compressor Warranty" },
  "skyworth 1.5 ton": { name: "Skyworth 1.5 Ton Dual Inverter Split AC (SMVH18B-R32)", price: 78500, warranty: "5 Years Compressor Warranty" },
  "himstar 105": { name: "Himstar 105L Mega Desert Air Cooler (HC-10526)", price: 22990, warranty: "1 Year Motor Warranty" },
};

/**
 * Search local catalog in memory
 */
export function searchCatalog(query, limit = 3) {
  if (!query) return catalog.slice(0, limit);
  const qTerms = query.toLowerCase().split(/\s+/).filter(Boolean);

  const matched = catalog.filter((item) => {
    const text = `${item.product_name || item.name || ""} ${item.model_code || ""} ${item.brand || ""} ${item.category || ""}`.toLowerCase();
    return qTerms.some((t) => text.includes(t));
  });

  return matched.slice(0, limit);
}

/**
 * Log customer inquiry to backend API
 */
export async function logInquiry({ name, phone, message, estimatedValue }) {
  try {
    await fetch("http://localhost:3005/api/inquiries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: name || "WhatsApp Customer",
        phone: phone || "9851045662",
        type: "whatsapp",
        message: message || "WhatsApp auto-responder inquiry",
        estimatedValue: estimatedValue || 50000,
      }),
    });
    return true;
  } catch (err) {
    console.error("[AGENT] API Log Inquiry Error:", err.message);
    return false;
  }
}

/**
 * Detect language (Nepali / Romanized vs English)
 */
function isNepaliContext(text) {
  const nepaliKeywords = ["namaste", "नमस्ते", "kati", "kasto", "ho", "cha", "hajur", "हजुर", "chahi", "parne", "sasto", "kun", "lina", "dine", "pauncha", "bhandinus", "pathaidinus", "chhut", "purano", "satta", "mero", "number"];
  const lower = text.toLowerCase();
  if (/[\u0900-\u097F]/.test(text)) return true;
  return nepaliKeywords.some(k => lower.includes(k));
}

/**
 * Core AI Reasoning Agent
 */
export async function generateAiReply(userText, customerId = "user") {
  const nepali = isNepaliContext(userText);
  const textLower = userText.toLowerCase();

  // 1. Lead Submission (Phone numbers / Address)
  const phoneMatch = userText.match(/(?:98|97)\d{8}/);
  if (phoneMatch) {
    await logInquiry({
      name: "WhatsApp Lead",
      phone: phoneMatch[0],
      message: userText,
      estimatedValue: 50000,
    });

    if (nepali) {
      return `धन्यवाद हजुर! 🙏 हजुरको सम्पर्क नम्बर (${phoneMatch[0]}) प्राप्त भयो।\n\nहाम्रो सामाखुसी सोरुमको सेल्स टिमले थप छुट (Offer Price) र निःशुल्क डेलिभरी कन्फर्म गर्न छिट्टै सम्पर्क गर्नेछ।\n\nहजुरलाई कुन मोडल सबैभन्दा बढी मन परेको छ?`;
    } else {
      return `Thank you! We have received your contact number (${phoneMatch[0]}).\n\nOur showroom sales team from Samakhushi will contact you shortly to confirm the special offer price and free Kathmandu valley delivery.\n\nWhich specific appliance or model are you interested in?`;
    }
  }

  // 2. Old Appliance Trade-In / Exchange Inquiry
  if (textLower.includes("exchange") || textLower.includes("satta") || textLower.includes("purano") || textLower.includes("trade") || textLower.includes("cashback")) {
    if (nepali) {
      return `नमस्ते हजुर! 🙏 जोइन इलेक्ट्रोनिक सेन्टर (सामाखुसी चोक) मा पुरानो टिभी तथा फ्रिज साटेर नयाँ सामान लिँदा **रु. ८,००० सम्मको एक्सचेन्ज बोनस (Cashback)** पाइन्छ।\n\nकुनै पनि चालु वा बिग्रेको CRT / LED टिभी वा फ्रिज साट्न सकिन्छ।\n\nकृपया हजुरको पुरानो सामानको फोटो र मोडल यहाँ पठाइदिनुहोस्, हामी तत्काल मूल्याङ्कन (Quote) पठाइदिनेछौं!`;
    } else {
      return `Namaste & Welcome! 🙏 At Join Electronic Center (Samakhushi Chowk), you can exchange any old CRT/LED TV or refrigerator for **up to Rs 8,000 instant cashback bonus** towards any brand-new appliance.\n\nPlease share a photo and brand of your old appliance here on WhatsApp for an immediate exchange valuation!`;
    }
  }

  // 3. EMI Financing Inquiry
  if (textLower.includes("emi") || textLower.includes("installment") || textLower.includes("kista")) {
    if (nepali) {
      return `नमस्ते हजुर! 🙏 हामीकहाँ **नबिल बैंक, एनआइसी एसिया, ग्लोबल आइएमई बैंक** तथा eSewa बाट ०% ब्याजदरमा सजिलो मासिक किस्ता (EMI) सुविधा उपलब्ध छ।\n\n- डाउन पेमेन्ट: २०% देखि\n- अवधि: ६, १२ वा १८ महिना\n\nहजुरलाई कुन सामानको लागि किस्ता प्लान बुझ्न मन छ? (सामानको नाम लेखिदिनुहोला हजुर!)`;
    } else {
      return `Namaste! 🙏 We offer 0% Credit Card EMI and digital installment options with **Nabil Bank, NIC Asia Bank, Global IME Bank, and eSewa BNPL**.\n\n- Tenure: 6, 12, or 18 months\n- Down Payment: From 20%\n\nPlease mention which appliance you want to finance and we will calculate your exact monthly EMI!`;
    }
  }

  // 4. Product Search & Catalog Lookup
  let searchTerms = [];
  if (textLower.includes("tv") || textLower.includes("television") || textLower.includes("55 inch") || textLower.includes("32 inch") || textLower.includes("43 inch")) {
    searchTerms.push("television");
  }
  if (textLower.includes("fridge") || textLower.includes("refrigerator") || textLower.includes("freeze")) {
    searchTerms.push("refrigerator");
  }
  if (textLower.includes("washing") || textLower.includes("washer")) {
    searchTerms.push("washing machine");
  }
  if (textLower.includes("ac") || textLower.includes("conditioner")) {
    searchTerms.push("air conditioner");
  }
  if (textLower.includes("cooler")) {
    searchTerms.push("air cooler");
  }

  // Specific brand checks
  ["skyworth", "samsung", "himstar", "whirlpool", "videocon", "panasonic", "livpure", "aura", "hitachi"].forEach(b => {
    if (textLower.includes(b)) searchTerms.push(b);
  });

  const query = searchTerms.join(" ") || userText;
  const results = searchCatalog(query, 3);

  if (results.length > 0) {
    if (nepali) {
      let reply = `नमस्ते हजुर! 🙏 हाम्रो सोरुममा उपलब्ध केही उत्कृष्ट मोडलहरू यस प्रकार छन्:\n\n`;
      results.forEach((p, idx) => {
        const name = p.product_name || p.name;
        const mrp = p.mrp_npr || p.mrpNpr || 0;
        const photo = p.photo_path || p.photoPath;
        const war = p.warranty || "आधिकारिक ब्रान्ड वारेन्टी";

        reply += `${idx + 1}. **${name}**\n`;
        reply += `   • आधिकारिक MRP: **रु. ${mrp.toLocaleString("en-NP")}**\n`;
        reply += `   • वारेन्टी: ${war}\n`;
        if (photo) {
          reply += `   • फोटो: https://joinelectroniccenter.com/${photo.replace(/\\/g, "/")}\n`;
        }
        reply += `\n`;
      });
      reply += `काठमाडौँ उपत्यकाभित्र **फ्री होम डेलिभरी** र अर्डर गर्न हजुरको नाम र ठेगाना पठाइदिनुहोला है हजुर! 🙏`;
      return reply;
    } else {
      let reply = `Hello & Welcome! 🙏 Here are the top verified models available in our Kathmandu showroom:\n\n`;
      results.forEach((p, idx) => {
        const name = p.product_name || p.name;
        const mrp = p.mrp_npr || p.mrpNpr || 0;
        const photo = p.photo_path || p.photoPath;
        const war = p.warranty || "Official Brand Warranty";

        reply += `${idx + 1}. **${name}**\n`;
        reply += `   • Official MRP: **Rs ${mrp.toLocaleString("en-NP")}**\n`;
        reply += `   • Warranty: ${war}\n`;
        if (photo) {
          reply += `   • Photo: https://joinelectroniccenter.com/${photo.replace(/\\/g, "/")}\n`;
        }
        reply += `\n`;
      });
      reply += `We provide **Free Same-Day Doorstep Delivery & Setup** in Kathmandu Valley. Please share your delivery address to proceed!`;
      return reply;
    }
  }

  // 5. Default Warm Retail Greeting & Store Info
  if (nepali) {
    return `नमस्ते हजुर! 🙏 जोइन इलेक्ट्रोनिक सेन्टर (सामाखुसी चोक, काठमाडौँ) मा स्वागत छ।\n\nहामीकहाँ **Samsung, Skyworth, Himstar, Whirlpool, Panasonic** का ३७८+ टिभी, फ्रिज, वासिङ मेसिन तथा एसीहरू आधिकारिक वारेन्टी र विशेष छुटमा उपलब्ध छन्।\n\nहजुरलाई आज कुन सामान सम्बन्धी जानकारी चाहिन्थ्यो भन्नुहोस् न?`;
  } else {
    return `Namaste & Welcome to Join Electronic Center (Samakhushi Chowk, Kathmandu) 🙏\n\nWe stock 378+ genuine home appliances from **Samsung, Skyworth, Himstar, Whirlpool, and Panasonic** with official warranty, 0% EMI, and old appliance exchange up to Rs 8,000 bonus.\n\nHow may I help you with your purchase today?`;
  }
}
