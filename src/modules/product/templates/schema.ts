import * as z from 'zod';

const attributeSchema = z.object({
  title: z.string().min(1, 'Attribute name is required'),
  value: z.string().min(1, 'Attribute value is required'),
});

const baseVariantSchema = z.object({
  sku: z.string().min(1, 'SKU is required'),
  color: z.string().optional(),
  size: z.string().optional(),
  weight: z.number().min(0, 'Weight must be non-negative'),
  breadth: z.number().min(0, 'Breadth must be non-negative'),
  height: z.number().min(0, 'Height must be non-negative'),
  length: z.number().min(0, 'Length must be non-negative'),
  stock: z.number().int().min(0, 'Stock must be non-negative'),
  attributes: z
    .array(attributeSchema)
    .min(1, 'At least one attribute is required'),
  images: z
    .array(z.string().url('Invalid URL'))
    .min(1, 'At least one image is required'),
});

export const baseSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  variants: z
    .array(baseVariantSchema)
    .min(1, 'At least one variant is required'),
  thumbnail: z.string().url('Invalid URL'),
  description: z.string().min(1, 'Description is required'),
  priceWithoutTax: z.number().min(1, 'Price must be greater than 0'),
  attributes: z
    .array(attributeSchema)
    .min(1, 'At least one attribute is required'),
  tax: z
    .number()
    .min(0, 'Tax must be non-negative')
    .max(100, 'Tax cannot exceed 100%'),
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
