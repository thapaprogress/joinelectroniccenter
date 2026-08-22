import fs from "fs";
import path from "path";
import { prisma } from "@/lib/prisma";
import { Product } from "@/types/product";
import { normalizeImagePath, generateProductSlug } from "@/lib/formatters";

/**
 * Loads products from database or fallback static JSON file
 */
export async function getAllProducts(): Promise<Product[]> {
  try {
    const dbProducts = await prisma.product.findMany({
      include: { brand: true, category: true },
      orderBy: { featured: "desc" },
    });

    if (dbProducts && dbProducts.length > 0) {
      return dbProducts.map((p) => ({
        id: p.id,
        modelCode: p.modelCode,
        slug: p.slug || generateProductSlug(p.name, p.modelCode),
        name: p.name,
        brand: p.brand,
        category: p.category,
        type: p.type,
        capacity: p.capacity,
        mrpNpr: p.mrpNpr,
        emiMonthly12: p.emiMonthly12 || Math.round(p.mrpNpr / 12),
        shortDescription: p.shortDescription,
        detailedSpecs: p.detailedSpecs,
        specsList: p.specsList,
        warranty: p.warranty || "1 Year Official Warranty",
        imageUrl: p.imageUrl,
        photoPath: normalizeImagePath(p.photoPath),
        hasLocalPhoto: p.hasLocalPhoto,
        inStock: p.inStock,
        featured: p.featured,
        whatsapp: p.whatsapp || "9779851045662",
      }));
    }
  } catch (error) {
    console.warn("Prisma query failed, falling back to static catalog.json", error);
  }

  // Fallback to static catalog.json
  try {
    const jsonPath = path.join(process.cwd(), "public", "data", "catalog.json");
    if (fs.existsSync(jsonPath)) {
      const fileData = fs.readFileSync(jsonPath, "utf-8");
      const items: any[] = JSON.parse(fileData);

      return items.map((item, idx) => {
        const rawPhoto = item.photo_path || item.photoPath || "";
        const photoPath = normalizeImagePath(rawPhoto);
        const brandName = typeof item.brand === "string" ? item.brand : (item.brand?.name || "Join Electronic");
        const categoryName = typeof item.category === "string" ? item.category : (item.category?.name || "Appliances");
        const model = item.model_code || item.modelCode || `JEC-${idx + 1}`;
        const name = item.item_name || item.name || `${brandName} ${categoryName}`;
        const slug = item.slug || generateProductSlug(name, model);
        const price = Number(item.mrp_npr || item.mrpNpr || 0);

        return {
          id: String(item.id || idx + 1),
          modelCode: model,
          slug,
          name,
          brand: { name: brandName, slug: brandName.toLowerCase().replace(/\s+/g, "-") },
          category: { name: categoryName, slug: categoryName.toLowerCase().replace(/\s+/g, "-") },
          type: item.type || null,
          capacity: item.capacity || null,
          mrpNpr: price,
          emiMonthly12: Number(item.emi_monthly_12 || item.emiMonthly12 || Math.round(price / 12)),
          shortDescription: item.short_description || item.shortDescription || `${name} with official warranty and free delivery.`,
          detailedSpecs: item.detailed_specs || item.detailedSpecs || null,
          specsList: item.specs_list || item.specsList || [],
          warranty: item.warranty || "1 Year Official Warranty",
          photoPath,
          hasLocalPhoto: Boolean(item.has_local_photo || item.hasLocalPhoto || photoPath),
          inStock: item.in_stock !== false,
          featured: Boolean(item.featured || idx < 12),
          whatsapp: "9779851045662",
        };
      });
    }
  } catch (err) {
    console.error("Failed to read static catalog.json", err);
  }

  return [];
}

/**
 * Finds a single product by slug or model code
 */
export async function getProductBySlug(slug: string): Promise<Product | null> {
  const normalizedSlug = slug.toLowerCase().trim();

  try {
    const p = await prisma.product.findFirst({
      where: {
        OR: [
          { slug: { equals: normalizedSlug } },
          { modelCode: { equals: slug } },
          { modelCode: { equals: slug.toUpperCase() } },
        ],
      },
      include: { brand: true, category: true },
    });

    if (p) {
      return {
        id: p.id,
        modelCode: p.modelCode,
        slug: p.slug || generateProductSlug(p.name, p.modelCode),
        name: p.name,
        brand: p.brand,
        category: p.category,
        type: p.type,
        capacity: p.capacity,
        mrpNpr: p.mrpNpr,
        emiMonthly12: p.emiMonthly12 || Math.round(p.mrpNpr / 12),
        shortDescription: p.shortDescription,
        detailedSpecs: p.detailedSpecs,
        specsList: p.specsList,
        warranty: p.warranty || "1 Year Official Warranty",
        imageUrl: p.imageUrl,
        photoPath: normalizeImagePath(p.photoPath),
        hasLocalPhoto: p.hasLocalPhoto,
        inStock: p.inStock,
        featured: p.featured,
        whatsapp: p.whatsapp || "9779851045662",
      };
    }
  } catch (err) {
    console.warn("Direct DB lookup failed, searching in-memory catalog", err);
  }

  const all = await getAllProducts();
  return (
    all.find(
      (p) =>
        p.slug.toLowerCase() === normalizedSlug ||
        p.modelCode.toLowerCase() === normalizedSlug ||
        generateProductSlug(p.name, p.modelCode) === normalizedSlug
    ) || null
  );
}

/**
 * Filters products by category slug
 */
export async function getProductsByCategory(categorySlug: string): Promise<Product[]> {
  const all = await getAllProducts();
  const normalized = categorySlug.toLowerCase().replace(/-/g, " ").trim();

  return all.filter((p) => {
    const catName = typeof p.category === "string" ? p.category : p.category.name;
    const catSlug = typeof p.category === "string" ? p.category.toLowerCase() : p.category.slug.toLowerCase();
    return catSlug === categorySlug.toLowerCase() || catName.toLowerCase().includes(normalized);
  });
}

/**
 * Extracts all unique categories with product counts
 */
export async function getAllCategories() {
  const all = await getAllProducts();
  const map = new Map<string, { name: string; slug: string; count: number }>();

  all.forEach((p) => {
    const catName = typeof p.category === "string" ? p.category : p.category.name;
    const slug = catName.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-");
    const existing = map.get(slug);
    if (existing) {
      existing.count += 1;
    } else {
      map.set(slug, { name: catName, slug, count: 1 });
    }
  });

  return Array.from(map.values());
}
