export interface IProduct {
  id: number;
  name: string;
  description: string;
  price: number;
  priceWithoutTax: number;
  discountedPrice: number;
  specification: {
    color: string;
    fabric: string;
    pattern: string;
    material: string;
    warranty: string;
    closure_type: string;
    sleeve_length: string;
    care_instructions: string;
    country_of_origin: string;
  };
  weight: number;
  breadth: number;
  height: number;
  length: number;
  tax: number;
  stock: number;
  sizes: string[];
  colors: string[];
  images: string[];
  isLive: boolean;
  sellerId: string;
  createdAt: string;
  updatedAt: string;
}
