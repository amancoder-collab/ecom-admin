export interface IProduct {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  priceWithoutTax: number;
  discountedPrice: number;
  tax: number;
  isLive: boolean;
  variants: IVariant[];
  sellerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface IVariant {
  id: string;
  sku: string;
  color: string;
  size: string;
  weight: number;
  breadth: number;
  height: number;
  length: number;
  stock: number;
  images: string[];
  createdAt: string;
  updatedAt: string;
}
