// ================= STATUS =================
export type Status =
  | "none"
  | "lead"
  | "interested"
  | "not_interested"
  | "client";

// ================= LEAD =================
export type LeadType = "base" | "client";

// 🔥 Agora alinhado com backend (ID + fallback "outro")
export type BusinessType = number | "outro" | null;

export type House = {
  id?: number;
  name: string;
  latitude: number;
  longitude: number;

  email?: string;
  phone?: string;
  whatsapp?: string;

  status: Status;
  type: LeadType;
  radius?: number;

  // 🔥 FK ou fallback
  business_type?: BusinessType;
  custom_business?: string;
};

// ================= SALES =================
export type SaleKind = "product" | "service";
export type SaleStatus = "active" | "cancelled";

export type Sale = {
  id?: number;
  house: number;
  kind: SaleKind;
  name: string;
  price: number;
  start_date?: string;
  status?: SaleStatus;
};

// ================= PRODUCTS =================
export type ProductType = "product" | "service";

export type Product = {
  id?: number;
  name: string;
  type: ProductType;
  price?: number;
  monthly_price?: number;
};