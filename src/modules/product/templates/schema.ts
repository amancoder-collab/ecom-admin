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
  sku: z.string().min(1, 'SKU is required'),
  color: z.string().optional(),
  size: z.string().optional(),
  weight: z.number().min(0, 'Weight must be non-negative'),
  width: z.number().min(0, 'Width must be non-negative'),
  height: z.number().min(0, 'Height must be non-negative'),
  length: z.number().min(0, 'Length must be non-negative'),
  stock: z.number().int().min(0, 'Stock must be non-negative'),
  attributes: z
    .array(variantAttributeSchema)
    .min(1, 'At least one attribute is required'),
  thumbnail: z.string().url('Invalid URL'),
  images: z
    .array(z.string().url('Invalid URL'))
    .min(1, 'At least one image is required'),
});

export const baseSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  thumbnail: z.string().url('Invalid URL'),
  images: z.array(z.string()).min(1),
  weight: z.number().min(1, 'Weight must be greater than 0'),
  width: z.number().min(1, 'Width must be greater than 0'),
  height: z.number().min(1, 'Height must be greater than 0'),
  length: z.number().min(1, 'Length must be greater than 0'),
  description: z.string().min(1, 'Description is required'),
  price: z.number().min(1, 'Price must be greater than 0'),
  variants: z
    .array(baseVariantSchema)
    .min(1, 'At least one variant is required'),
  attributes: z
    .array(attributeSchema)
    .min(1, 'At least one attribute is required'),
  discountedPrice: z.number().min(1, 'Discounted price must be greater than 0'),
  isLive: z.boolean().default(false),
});

export type CreateProductSchema = z.infer<typeof baseSchema>;

export const updateVariantSchema = baseVariantSchema.extend({
  id: z.string().min(1, 'ID is required'),
});

export const updateSchema = baseSchema.extend({
  variants: z.array(updateVariantSchema),
});

export type UpdateProductSchema = z.infer<typeof updateSchema>;
