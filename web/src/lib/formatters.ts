import { Brand, Category } from "@/types/product";

/**
 * Normalizes backslashes from Windows scraper paths to standard web URLs
 */
export function normalizeImagePath(photoPath: string | null | undefined, defaultFallback = "/images/placeholder-appliance.jpg"): string {
  if (!photoPath) return defaultFallback;
  
  const clean = photoPath.replace(/\\/g, "/").trim();
  if (!clean) return defaultFallback;
  
  if (clean.startsWith("http://") || clean.startsWith("https://")) {
    return clean;
  }
  
  return clean.startsWith("/") ? clean : `/${clean}`;
}

/**
 * Formats NPR price in Nepali/South Asian comma grouping (e.g. Rs 1,25,000)
 */
export function formatPriceNPR(amount: number | null | undefined): string {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return "Call for Price";
  }
  return `Rs ${amount.toLocaleString("en-IN")}`;
}

/**
 * Generates a clean URL slug from product name and model code
 */
export function generateProductSlug(name: string, modelCode: string): string {
  const combined = `${name}-${modelCode}`;
  return combined
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

/**
 * Safely extracts brand name whether brand is an object or string
 */
export function getBrandName(brand: Brand | string | null | undefined): string {
  if (!brand) return "Join Electronic";
  if (typeof brand === "string") return brand;
  return brand.name || "Join Electronic";
}

/**
 * Safely extracts category name whether category is an object or string
 */
export function getCategoryName(category: Category | string | null | undefined): string {
  if (!category) return "Appliances";
  if (typeof category === "string") return category;
  return category.name || "Appliances";
}

/**
 * Parses specsList from either a JSON string, array, or newline-separated text
 */
export function parseSpecsList(specs: string[] | string | null | undefined): string[] {
  if (!specs) return [];
  if (Array.isArray(specs)) return specs.filter(Boolean);
  
  try {
    const parsed = JSON.parse(specs);
    if (Array.isArray(parsed)) return parsed.filter(Boolean);
  } catch {
    // If not JSON, split by newline or comma
    return specs
      .split(/[\n,]/)
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return [];
}

/**
 * Calculates estimated Daraz price and showroom discount
 */
export function calculateDarazDiscount(mrpNpr: number) {
  // Showroom price is on average 8-15% lower than retail MRP or online platforms
  const discountFactor = 0.10;
  const darazPrice = Math.round(mrpNpr * 1.05); // Online retail comparison
  const showroomPrice = mrpNpr;
  const savings = darazPrice - showroomPrice;
  const discountPercent = Math.round((savings / darazPrice) * 100);

  return {
    darazPrice,
    showroomPrice,
    savings: Math.max(savings, 1500),
    discountPercent: Math.max(discountPercent, 8),
  };
}
