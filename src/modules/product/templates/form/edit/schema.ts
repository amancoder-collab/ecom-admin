// import * as z from 'zod';

// export const attributeSchema = z.object({
//   title: z.string().min(1, 'Title is required'),
//   value: z.string().min(1, 'At least one value is required'),
// });

// export const variantSchema = z.object({
//   id: z.string().optional(),
//   sku: z.string().min(1, 'SKU is required'),
//   weight: z.number().min(0, 'Weight must be non-negative'),
//   width: z.number().min(0, 'Width must be non-negative'),
//   height: z.number().min(0, 'Height must be non-negative'),
//   length: z.number().min(0, 'Length must be non-negative'),
//   stock: z.number().int().min(0, 'Stock must be non-negative'),
//   attributes: z.array(attributeSchema),
//   thumbnail: z.string().url('Invalid URL'),
//   images: z
//     .array(z.string().url('Invalid URL'))
//     .min(1, 'At least one image is required'),
// });

// export const updateSchema = z.object({
//   id: z.string().min(1, 'ID is required'),
//   name: z.string().min(1, 'Name is required'),
//   thumbnail: z.string().url('Invalid URL'),
//   images: z.array(z.string()).min(1),
//   weight: z.number().optional(),
//   width: z.number().optional(),
//   height: z.number().optional(),
//   length: z.number().optional(),
//   variants: z.array(variantSchema),
//   attributes: z.array(
//     z.object({
//       title: z.string(),
//       values: z.array(z.string()),
//     }),
//   ),
//   description: z.string().min(1, 'Description is required'),
//   price: z.number().min(1, 'Price must be greater than 0'),
//   discountedPrice: z.number().min(1, 'Discounted price must be greater than 0'),
//   isLive: z.boolean().default(false),
// });

// export type VariantSchema = z.infer<typeof variantSchema>;

// export type UpdateProductSchema = z.infer<typeof updateSchema>;
