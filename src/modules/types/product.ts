export interface IProduct {
  id: string;
  name: string;
  description: string;
  thumbnail?: string;
  images?: string[];
  weight?: number;
  width?: number;
  height?: number;
  length?: number;
  price: number;
  discountedPrice?: number;
  isActive: boolean;
  hasVariants: boolean;
  variants?: IVariant[];
  attributes?: IAttribute[];
  sellerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface IAttribute {
  id?: string;
  productId?: string;
  title: string;
  values: IAttributeValue[];
  createdAt?: string;
  updatedAt?: string;
}

export interface IAttributeValue {
  id?: string;
  attributeId?: string;
  variantId?: string;
  value: string;
  attribute?: IAttribute;
  createdAt?: string;
  updatedAt?: string;
}

export interface IVariant {
  id?: string;
  productId?: string;
  sku: string;
  weight: number;
  width: number;
  height: number;
  length: number;
  stock: number;
  price: number;
  discountedPrice?: number;
  isActive: boolean;
  thumbnail: string;
  images: string[];
  attributeValues: IAttributeValue[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ICreateVariantAttribute {
  title: string;
  value: string;
}

export interface ICreateVariant {
  sku: string;
  weight: number;
  width: number;
  height: number;
  length: number;
  stock: number;
  thumbnail: string;
  images: string[];
  attributes: ICreateVariantAttribute[];
}

export interface IUpdateVariant extends Partial<ICreateVariant> {}
