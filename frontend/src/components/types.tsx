export type Status =
  | "none"
  | "lead"
  | "interested"
  | "not_interested"
  | "client";

export type LeadType = "base" | "client";

export type BusinessType =
  | "none"
  | "barbearia"
  | "salao"
  | "manicure"
  | "pedicure"
  | "estetica"
  | "outro";

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

  business_type?: BusinessType;
  custom_business?: string;
};

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

export type ProductType = "product" | "service";

export type Product = {
  id?: number;
  name: string;
  type: ProductType;
  price?: number;
  monthly_price?: number;
};
