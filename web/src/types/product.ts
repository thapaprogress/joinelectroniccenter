export interface Brand {
  id?: string;
  name: string;
  slug: string;
  logoUrl?: string | null;
}

export interface Category {
  id?: string;
  name: string;
  slug: string;
  icon?: string | null;
}

export interface Product {
  id: string;
  modelCode: string;
  slug: string;
  name: string;
  brand: Brand | string;
  category: Category | string;
  type?: string | null;
  capacity?: string | null;
  mrpNpr: number;
  emiMonthly12?: number | null;
  shortDescription?: string | null;
  detailedSpecs?: string | null;
  specsList?: string[] | string | null;
  warranty?: string | null;
  imageUrl?: string | null;
  photoPath?: string | null;
  photo_path?: string | null;
  hasLocalPhoto?: boolean;
  source?: string | null;
  inStock?: boolean;
  featured?: boolean;
  whatsapp?: string;
  metaTitle?: string | null;
  metaDescription?: string | null;
  darazPrice?: number;
  discountPercent?: number;
  rating?: number;
  reviewCount?: number;
}

export interface ProductQueryParams {
  search?: string;
  brand?: string;
  category?: string;
  maxPrice?: number;
  minPrice?: number;
  sort?: "featured" | "price_asc" | "price_desc" | "name_asc";
  limit?: number;
  offset?: number;
}

export interface ExchangeEstimation {
  applianceType: string;
  brand: string;
  ageYears: number;
  condition: "working" | "minor_defect" | "dead";
  estimatedCashback: number;
  recommendation: string;
}

export interface EmiCalculation {
  principal: number;
  downPaymentPercent: number;
  downPaymentNpr: number;
  loanAmount: number;
  tenureMonths: number;
  monthlyEmi: number;
  bankName: string;
}
