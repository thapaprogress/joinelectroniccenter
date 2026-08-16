import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.resolve(__dirname, "../dev.db");
const adapter = new PrismaBetterSqlite3({ url: dbPath });
const prisma = new PrismaClient({ adapter });

function slugify(text) {
  return String(text || "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");
}

async function main() {
  console.log("Seeding SQLite database from catalog.json via Prisma + better-sqlite3 adapter...");

  const catalogPath = path.resolve(__dirname, "../../website/site/data/catalog.json");
  if (!fs.existsSync(catalogPath)) {
    throw new Error(`Catalog file not found at: ${catalogPath}`);
  }

  const raw = fs.readFileSync(catalogPath, "utf-8");
  const items = JSON.parse(raw);

  console.log(`Found ${items.length} items to seed.`);

  // 1. Collect unique brands & categories
  const brandNames = Array.from(new Set(items.map((i) => (i.brand || "General").trim())));
  const categoryNames = Array.from(new Set(items.map((i) => (i.category || "Appliance").trim())));

  const brandMap = new Map();
  for (const bName of brandNames) {
    const slug = slugify(bName);
    const b = await prisma.brand.upsert({
      where: { name: bName },
      update: {},
      create: {
        name: bName,
        slug: slug || "general",
      },
    });
    brandMap.set(bName, b.id);
  }

  const categoryMap = new Map();
  for (const cName of categoryNames) {
    const slug = slugify(cName);
    const c = await prisma.category.upsert({
      where: { name: cName },
      update: {},
      create: {
        name: cName,
        slug: slug || "appliance",
      },
    });
    categoryMap.set(cName, c.id);
  }

  console.log(`Created ${brandMap.size} brands and ${categoryMap.size} categories.`);

  // 2. Insert Products
  let inserted = 0;
  for (let idx = 0; idx < items.length; idx++) {
    const item = items[idx];
    const brandName = (item.brand || "General").trim();
    const categoryName = (item.category || "Appliance").trim();

    const brandId = brandMap.get(brandName);
    const categoryId = categoryMap.get(categoryName);

    const baseModelCode = item.model_code ? String(item.model_code).trim() : `ITEM-${idx + 1}`;
    const modelCode = baseModelCode || `ITEM-${idx + 1}`;
    
    let baseSlug = item.slug ? String(item.slug).trim() : slugify(`${brandName}-${item.product_name || modelCode}`);
    if (!baseSlug) baseSlug = `product-${idx + 1}`;
    const slug = `${baseSlug}-${idx + 1}`;

    const mrpNpr = typeof item.mrp_npr === "number" ? item.mrp_npr : parseFloat(item.mrp_npr) || 0;
    const emiMonthly12 = item.emi_monthly_12 ? (typeof item.emi_monthly_12 === "number" ? item.emi_monthly_12 : parseFloat(item.emi_monthly_12)) : null;

    const specsList = item.specs_list ? JSON.stringify(item.specs_list) : null;

    await prisma.product.upsert({
      where: { modelCode },
      update: {
        name: item.product_name || modelCode,
        slug,
        brandId,
        categoryId,
        type: item.type || null,
        capacity: item.capacity || null,
        mrpNpr,
        emiMonthly12,
        shortDescription: item.short_description || null,
        detailedSpecs: item.detailed_specs || null,
        specsList,
        warranty: item.warranty || null,
        imageUrl: item.image_url || null,
        photoPath: item.photo_path ? item.photo_path.replace(/\\/g, "/") : null,
        hasLocalPhoto: Boolean(item.has_local_photo),
        source: item.source || "catalog_seed",
        whatsapp: item.whatsapp || "9779851045662",
        metaTitle: item.meta_title || null,
        metaDescription: item.meta_description || null,
      },
      create: {
        modelCode,
        slug,
        name: item.product_name || modelCode,
        brandId,
        categoryId,
        type: item.type || null,
        capacity: item.capacity || null,
        mrpNpr,
        emiMonthly12,
        shortDescription: item.short_description || null,
        detailedSpecs: item.detailed_specs || null,
        specsList,
        warranty: item.warranty || null,
        imageUrl: item.image_url || null,
        photoPath: item.photo_path ? item.photo_path.replace(/\\/g, "/") : null,
        hasLocalPhoto: Boolean(item.has_local_photo),
        source: item.source || "catalog_seed",
        whatsapp: item.whatsapp || "9779851045662",
        metaTitle: item.meta_title || null,
        metaDescription: item.meta_description || null,
      },
    });

    inserted++;
  }

  console.log(`Successfully seeded ${inserted} products into SQLite database!`);
}

main()
  .catch((e) => {
    console.error("Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
