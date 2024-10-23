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
  discountedPrice: number;
  isLive: boolean;
  variants?: IVariant[];
  attributes?: IAttribute[];
  sellerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface IAttribute {
  id: string;
  title: string;
  values: IAttributeValue[];
}

export interface IAttributeValue {
  id: string;
  attributeId: string;
  variantId: string;
  value: string;
  attribute: IAttribute;
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
  thumbnail: string;
  images: string[];
  attributeValues: IAttributeValue[];
  createdAt: string;
  updatedAt: string;
}
