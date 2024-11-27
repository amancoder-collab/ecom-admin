import * as z from 'zod';

const attributeSchema = z.object({
  title: z.string().min(1, 'Attribute name is required'),
  values: z.array(z.string()).min(1, 'At least one value is required'),
});

const variantAttributeSchema = z.object({
  title: z.string().min(1, 'Attribute name is required'),
  value: z.string().min(1, 'Attribute value is required'),
});

const baseVariantSchema = z.object({
  id: z.string().optional(),
  sku: z.string().min(1, 'SKU is required'),
  weight: z.number().min(0, 'Weight must be non-negative'),
  width: z.number().min(0, 'Width must be non-negative'),
  height: z.number().min(0, 'Height must be non-negative'),
  length: z.number().min(0, 'Length must be non-negative'),
  stock: z.number().int().min(0, 'Stock must be non-negative'),
  price: z.number().min(1, 'Price must be greater than 0'),
  discountedPrice: z.number().nullable().optional(),
  isActive: z.boolean(),
  attributes: z
    .array(variantAttributeSchema)
    .min(1, 'At least one attribute is required'),
  thumbnail: z.string().url('Invalid URL'),
  images: z
    .array(z.string().url('Invalid URL'))
    .min(1, 'At least one image is required'),
});

export const baseProductSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string(),
  isActive: z.boolean(),
});

export const updateProductSchema = baseProductSchema.extend({
  id: z.string().min(1, 'Product ID is required'),
});

export const baseProductSchemaWithoutVariants = baseProductSchema.extend({
  thumbnail: z.string(),
  images: z.array(z.string()),
  weight: z.number(),
  width: z.number(),
  height: z.number(),
  length: z.number(),
  description: z.string().min(1, 'Description is required'),
  price: z.number(),
  discountedPrice: z.number().nullable().optional(),
});

export const baseProductSchemaWithVariants = baseProductSchema.extend({
  variants: z
    .array(baseVariantSchema)
    .min(1, 'At least one variant is required'),
  attributes: z
    .array(attributeSchema)
    .min(1, 'At least one attribute is required'),
});

export const createProductSchemaWithVariants = baseProductSchemaWithVariants;

export const createProductSchemaWithoutVariants =
  baseProductSchemaWithoutVariants.extend({});

export const updateProductSchemaWithoutVariants =
  baseProductSchemaWithoutVariants.extend({
    id: z.string().min(1, 'Product ID is required'),
  });

export const updateProductSchemaWithVariants =
  baseProductSchemaWithVariants.extend({
    id: z.string().min(1, 'Product ID is required'),
  });

export type CreateProductSchemaWithoutVariants = z.infer<
  typeof createProductSchemaWithoutVariants
>;

export type CreateProductSchemaWithVariants = z.infer<
  typeof createProductSchemaWithVariants
>;

export type UpdateProductSchemaWithVariants = z.infer<
  typeof updateProductSchemaWithVariants
>;

export type UpdateProductSchemaWithoutVariants = z.infer<
  typeof updateProductSchemaWithoutVariants
>;
