// 'use client';
// import { api } from '@/api';
// import { FormTextField } from '@/app/(dashboard)/components/forms/theme-elements/FormTextField';
// import { ConfirmationDialog } from '@/modules/common/components/ConfirmationDialog';
// import { ImageUpload } from '@/modules/common/components/ImageUpload';
// import { useProduct } from '@/modules/product/queries/use-product';
// import { IAttribute } from '@/modules/types/product';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { Add, Delete, ExpandMore } from '@mui/icons-material';
// import {
//   Accordion,
//   AccordionDetails,
//   AccordionSummary,
//   Button,
//   Checkbox,
//   Chip,
//   Divider,
//   FormControl,
//   FormControlLabel,
//   Grid,
//   IconButton,
//   InputLabel,
//   MenuItem,
//   Select,
//   TextField,
//   Typography,
// } from '@mui/material';
// import { useMutation } from '@tanstack/react-query';
// import { uniqueId } from 'lodash';
// import { useRouter } from 'next/navigation';
// import React, { useEffect, useState } from 'react';
// import { Controller, useForm } from 'react-hook-form';
// import { toast } from 'react-toastify';
// import { useProducts } from '../../../queries/use-products';
// import { UpdateProductSchema, updateSchema, VariantSchema } from './schema';

// interface ProductEditTemplateProps {
//   id: string;
// }

// export const ProductEditTemplate: React.FC<ProductEditTemplateProps> = ({
//   id,
// }) => {
//   const router = useRouter();
//   const { refetchProducts } = useProducts();
//   const { product, refetchProduct } = useProduct(id);
//   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
//   const [variantToDelete, setVariantToDelete] = useState<{
//     id: string;
//     index: number;
//   } | null>(null);
//   const [attributes, setAttributes] = useState<IAttribute[]>([]);
//   const [selectedAttributes, setSelectedAttributes] = useState<
//     {
//       title: string;
//       value: string;
//       variantId: string;
//     }[]
//   >([]);

//   const {
//     control,
//     handleSubmit,
//     reset,
//     watch,
//     setValue,
//     formState: { errors },
//   } = useForm<UpdateProductSchema>({
//     resolver: zodResolver(updateSchema),
//   });

//   useEffect(() => {
//     if (product) {
//       reset({
//         id: product.id,
//         name: product.name,
//         description: product.description,
//         thumbnail: product.thumbnail,
//         images: product.images,
//         price: product.price,
//         discountedPrice: product.discountedPrice,
//         weight: product.weight,
//         width: product.width,
//         height: product.height,
//         length: product.length,
//         isLive: product.isLive,
//         attributes: product.attributes?.map((e) => ({
//           title: e.title,
//           values: e.values.map((v) => v.value),
//         })),
//         variants: product.variants?.map((e) => ({
//           ...e,
//           attributes: e.attributeValues?.map((attr) => ({
//             title: attr.attribute?.title,
//             value: attr.value,
//           })),
//         })),
//       });

//       if (product.attributes) {
//         setAttributes(product.attributes);
//       }
//     }
//   }, [reset, product]);

//   const addVariant = () => {
//     setValue('variants', [
//       ...watch('variants'),
//       {
//         id: `auto-${uniqueId()}`,
//         sku: '',
//         stock: 0,
//         weight: 0,
//         width: 0,
//         height: 0,
//         length: 0,
//         attributes: [],
//         thumbnail: '',
//         images: [],
//       },
//     ]);
//   };

//   const deleteVariantMutation = useMutation({
//     mutationFn: (variantId: string) => {
//       return api.product.deleteVariantById(variantId);
//     },
//     onSuccess: () => {
//       toast.success('Variant deleted successfully');
//       refetchProduct();
//       setDeleteDialogOpen(false);
//       setVariantToDelete(null);
//     },
//     onError: (error) => {
//       console.error('Error deleting variant:', error);
//       toast.error('Failed to delete variant');
//     },
//   });

//   const updateProductMutation = useMutation({
//     mutationFn: (data: UpdateProductSchema) => {
//       return api.product.update(id, data);
//     },
//     onSuccess: () => {
//       toast.success(`Product updated successfully`);
//       refetchProducts();
//       router.push('/products');
//     },
//     onError: (error) => {
//       console.log(error, 'error');
//       toast.error(`Failed to update product`);
//     },
//   });

//   const onSubmit = (data: UpdateProductSchema) => {
//     console.log('Data', data);

//     const newData = {
//       ...data,
//       attributes: attributes.map((e) => ({
//         title: e.title,
//         values: e.values.map((v) => v.value),
//       })),
//       variants: data.variants.map((variant, index) => ({
//         ...variant,
//         attributes: [
//           ...variant.attributes,
//           ...selectedAttributes
//             .filter((attr) => attr.variantId === variant.id)
//             .map((e) => ({
//               title: e.title,
//               value: e.value,
//             })),
//         ],
//       })),
//     };

//     console.log('newData', newData);
//     updateProductMutation.mutate(newData);
//   };

//   console.log('errors', errors);

//   const addAttribute = (title: string) => {
//     console.log('title', title);
//     if (!attributes.find((attr) => attr.title === title)) {
//       setAttributes([
//         ...attributes,
//         {
//           title,
//           values: [],
//         },
//       ]);
//     } else {
//       toast.error(`Attribute "${title}" already exists`);
//     }
//   };

//   const isValueUnique = (title: string, value: string) => {
//     return !attributes
//       .find((attr) => attr.title === title)
//       ?.values?.some((v) => v.value === value);
//   };

//   const addAttributeValue = (title: string, value: string) => {
//     if (!isValueUnique(title, value)) {
//       toast.error(`Value "${value}" already exists for ${title}`);
//       return;
//     }

//     setAttributes((prev) => {
//       const newAttributes = JSON.parse(JSON.stringify(prev));
//       const attr = newAttributes.find(
//         (attr: IAttribute) => attr.title === title,
//       );
//       if (attr) {
//         attr.values.push({ value });
//       }
//       return newAttributes;
//     });
//   };

//   const renderAttributeSection = () => {
//     console.log('attributes', attributes);

//     return (
//       <Accordion>
//         <AccordionSummary expandIcon={<ExpandMore />}>
//           <Typography variant="h6">Product Attributes</Typography>
//         </AccordionSummary>
//         <AccordionDetails>
//           <Grid container spacing={3}>
//             {attributes.map((attr, index) => (
//               <Grid
//                 display={'flex'}
//                 justifyContent={'space-between'}
//                 direction={'row'}
//                 item
//                 xs={12}
//                 key={attr.title}
//               >
//                 <Grid item xs={12}>
//                   <Typography variant="subtitle1" gutterBottom>
//                     {attr.title}
//                   </Typography>
//                   <Grid
//                     container
//                     direction={'row'}
//                     spacing={2}
//                     alignItems="center"
//                   >
//                     <Grid item xs={12} sm={10}>
//                       <div
//                         style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}
//                       >
//                         {attr.values.map((value) => (
//                           <Chip
//                             key={value.id}
//                             label={value.value}
//                             size="small"
//                             variant="outlined"
//                           />
//                         ))}
//                       </div>
//                     </Grid>
//                   </Grid>
//                 </Grid>
//                 <Grid item xs={12}>
//                   <TextField
//                     label="Add new value"
//                     onKeyPress={(e: any) => {
//                       if (e.key === 'Enter') {
//                         e.preventDefault();
//                         const newValue = e.target.value.trim();
//                         if (newValue) {
//                           addAttributeValue(attr.title, newValue);
//                           e.target.value = '';
//                         }
//                       }
//                     }}
//                   />
//                 </Grid>
//               </Grid>
//             ))}

//             <Grid item xs={12}>
//               <Button
//                 startIcon={<Add />}
//                 onClick={() => {
//                   const dialog = prompt('Enter attribute title:');
//                   if (dialog) {
//                     addAttribute(dialog);
//                   }
//                 }}
//                 variant="outlined"
//                 color="primary"
//               >
//                 Add New Attribute
//               </Button>
//             </Grid>
//           </Grid>
//         </AccordionDetails>
//       </Accordion>
//     );
//   };

//   const onDeleteDialogClose = () => {
//     setDeleteDialogOpen(false);
//     setVariantToDelete(null);
//   };

//   const onDeleteDialogConfirm = () => {
//     if (variantToDelete?.id) {
//       deleteVariantMutation.mutate(variantToDelete.id);
//     } else {
//       setValue(
//         'variants',
//         watch('variants').filter(
//           (_, index) => index !== variantToDelete?.index,
//         ),
//       );
//       setDeleteDialogOpen(false);
//       setVariantToDelete(null);
//     }
//   };

//   const renderVariantView = (variant: VariantSchema, index: number) => (
//     <Grid container spacing={2} key={variant.id}>
//       <>{console.log('varianttt', variant)}</>
//       <Grid
//         item
//         xs={12}
//         style={{
//           display: 'flex',
//           alignItems: 'center',
//           justifyContent: 'space-between',
//         }}
//       >
//         <Typography variant="h6">Variant {index + 1}</Typography>
//         <div className="flex gap-2">
//           <IconButton
//             color="error"
//             onClick={() => {
//               setVariantToDelete({ id: variant.id as string, index });
//               setDeleteDialogOpen(true);
//             }}
//           >
//             <Delete />
//           </IconButton>
//         </div>
//       </Grid>

//       <Grid container padding={2} spacing={2} key={variant?.id}>
//         <Grid item xs={12} sm={6}>
//           <FormTextField
//             control={control}
//             label="SKU"
//             name={`variants.${index}.sku`}
//             fullWidth
//             required
//           />
//         </Grid>
//         <Grid item xs={12} sm={6}>
//           <FormTextField
//             control={control}
//             type="number"
//             name={`variants.${index}.stock`}
//             label="Stock"
//             fullWidth
//             required
//           />
//         </Grid>
//         <Grid item xs={12} sm={3}>
//           <FormTextField
//             control={control}
//             name={`variants.${index}.weight`}
//             label="Weight (in grams)"
//             type="number"
//             fullWidth
//             required
//           />
//         </Grid>
//         <Grid item xs={12} sm={3}>
//           <FormTextField
//             control={control}
//             name={`variants.${index}.width`}
//             label="Width (in cm)"
//             type="number"
//             fullWidth
//             required
//           />
//         </Grid>
//         <Grid item xs={12} sm={3}>
//           <FormTextField
//             control={control}
//             name={`variants.${index}.height`}
//             label="Height (in cm)"
//             type="number"
//             fullWidth
//             required
//           />
//         </Grid>
//         <Grid item xs={12} sm={3}>
//           <FormTextField
//             control={control}
//             name={`variants.${index}.length`}
//             label="Length (in cm)"
//             type="number"
//             fullWidth
//             required
//           />
//         </Grid>

//         {variant?.attributes?.map((attr, attrIndex) => (
//           <Grid item xs={12} sm={6} key={attrIndex}>
//             <TextField
//               label={attr.title}
//               value={attr.value}
//               disabled
//               fullWidth
//             />
//           </Grid>
//         ))}

//         {attributes
//           .filter(
//             (attr) =>
//               !variant?.attributes?.some(
//                 (variantAttr) => variantAttr.title === attr.title,
//               ),
//           )
//           .map((attr, index) => (
//             <Grid item xs={12} sm={6} key={attr.title}>
//               <FormControl fullWidth>
//                 <InputLabel>{attr.title}</InputLabel>
//                 <Select
//                   value={
//                     selectedAttributes.find(
//                       (variantAttr) => variantAttr.title === attr.title,
//                     )?.value
//                   }
//                   onChange={(e) => {
//                     setSelectedAttributes((prev) => {
//                       console.log('new prevvv', prev);
//                       const existingIndex = prev.findIndex(
//                         (variantAttr) =>
//                           variantAttr.title === attr.title &&
//                           variantAttr.variantId === variant.id,
//                       );

//                       const newAttribute = {
//                         title: attr.title,
//                         value: e.target.value as string,
//                         variantId: variant.id as string,
//                       };

//                       if (existingIndex >= 0) {
//                         const newAttributes = [...prev];
//                         newAttributes[existingIndex] = newAttribute;
//                         console.log('new attributeeeeeesss', newAttributes);
//                         return newAttributes;
//                       }

//                       console.log('new atttttt', [...prev, newAttribute]);

//                       return [...prev, newAttribute];
//                     });
//                   }}
//                   label={attr.title}
//                 >
//                   {attr.values.map((value) => (
//                     <MenuItem key={value.value} value={value.value}>
//                       {value.value}
//                     </MenuItem>
//                   ))}
//                 </Select>
//               </FormControl>
//             </Grid>
//           ))}

//         <Grid item xs={12}>
//           <Typography variant="subtitle1">Thumbnail</Typography>
//           <Controller
//             name="thumbnail"
//             control={control}
//             render={({ field }) => (
//               <ImageUpload value={field.value} onChange={field.onChange} />
//             )}
//           />
//         </Grid>
//         <Grid item xs={12}>
//           <Typography variant="subtitle1">Images</Typography>
//           <Controller
//             name="images"
//             control={control}
//             render={({ field }) => (
//               <ImageUpload
//                 multiple
//                 value={field.value}
//                 onChange={field.onChange}
//               />
//             )}
//           />
//         </Grid>
//       </Grid>
//     </Grid>
//   );

//   const renderVariantsSection = () => {
//     return (
//       <Accordion>
//         <AccordionSummary expandIcon={<ExpandMore />}>
//           <Typography variant="h6">Variants</Typography>
//         </AccordionSummary>
//         <AccordionDetails>
//           {watch('variants')?.map((variant, index) => (
//             <React.Fragment key={variant.id}>
//               {renderVariantView(variant, index)}
//               <Divider style={{ margin: '20px 0' }} />
//             </React.Fragment>
//           ))}
//           <Button startIcon={<Add />} onClick={addVariant}>
//             Add Variant
//           </Button>
//         </AccordionDetails>
//       </Accordion>
//     );
//   };

//   return (
//     <form onSubmit={handleSubmit(onSubmit)}>
//       <Grid container spacing={3}>
//         <Grid item xs={12}>
//           <Typography variant="h4">Edit Product</Typography>
//         </Grid>

//         <Grid display={'flex'} flexDirection={'column'} item gap={2} xs={12}>
//           <Accordion>
//             <AccordionSummary expandIcon={<ExpandMore />}>
//               <Typography variant="h6">Product Details</Typography>
//             </AccordionSummary>
//             <AccordionDetails>
//               <Grid container spacing={2}>
//                 <Grid item xs={12}>
//                   <FormTextField
//                     name="description"
//                     control={control}
//                     label="Description"
//                     variant="outlined"
//                     required
//                     multiline
//                     rows={4}
//                   />
//                 </Grid>
//                 <Grid item xs={12} sm={6}>
//                   <FormTextField
//                     name="name"
//                     control={control}
//                     label="Name"
//                     required
//                   />
//                 </Grid>
//                 <Grid item xs={12} sm={6}>
//                   <FormTextField
//                     name="price"
//                     control={control}
//                     label="Price"
//                     type="number"
//                     required
//                   />
//                 </Grid>
//                 <Grid item xs={12} sm={6}>
//                   <FormTextField
//                     name="discountedPrice"
//                     control={control}
//                     label="Discounted Price"
//                     type="number"
//                     required
//                   />
//                 </Grid>

//                 <Grid item xs={12} sm={3}>
//                   <FormTextField
//                     name="weight"
//                     control={control}
//                     label="Weight (in grams)"
//                     type="number"
//                     required
//                   />
//                 </Grid>
//                 <Grid item xs={12} sm={3}>
//                   <FormTextField
//                     name="width"
//                     control={control}
//                     label="Width (in cm)"
//                     type="number"
//                     required
//                   />
//                 </Grid>
//                 <Grid item xs={12} sm={3}>
//                   <FormTextField
//                     name="height"
//                     control={control}
//                     label="Height (in cm)"
//                     type="number"
//                     required
//                   />
//                 </Grid>
//                 <Grid item xs={12} sm={3}>
//                   <FormTextField
//                     name="length"
//                     control={control}
//                     label="Length (in cm)"
//                     type="number"
//                     required
//                   />
//                 </Grid>

//                 <Grid item xs={12}>
//                   <Typography variant="subtitle1">Thumbnail</Typography>
//                   <Controller
//                     name={`thumbnail`}
//                     control={control}
//                     render={({ field }) => (
//                       <ImageUpload
//                         value={field.value}
//                         onChange={field.onChange}
//                       />
//                     )}
//                   />
//                 </Grid>
//                 <Grid item xs={12}>
//                   <Typography variant="subtitle1">Images</Typography>
//                   <Controller
//                     name={`images`}
//                     control={control}
//                     render={({ field }) => (
//                       <ImageUpload
//                         multiple
//                         value={field.value}
//                         onChange={field.onChange}
//                       />
//                     )}
//                   />
//                 </Grid>
//               </Grid>
//             </AccordionDetails>
//           </Accordion>
//         </Grid>

//         <Grid item xs={12}>
//           {renderAttributeSection()}
//         </Grid>

//         <Grid item xs={12}>
//           {renderVariantsSection()}
//         </Grid>

//         <Grid item xs={12}>
//           <Controller
//             name="isLive"
//             control={control}
//             render={({ field }) => (
//               <FormControlLabel
//                 control={
//                   <Checkbox
//                     checked={field.value}
//                     onChange={(e) => field.onChange(e.target.checked)}
//                   />
//                 }
//                 label="Is Live"
//               />
//             )}
//           />
//         </Grid>
//         <Grid item xs={12}>
//           <Button type="submit" variant="contained" color="primary">
//             {id ? 'Update Product' : 'Create Product'}
//           </Button>
//         </Grid>
//       </Grid>

//       <ConfirmationDialog
//         open={deleteDialogOpen}
//         onClose={onDeleteDialogClose}
//         onConfirm={onDeleteDialogConfirm}
//       />

//       {/* <CreateEditVariant
//         attributes={attributes}
//         productId={id}
//         variantId={editingVariantId as string}
//         open={isOpen}
//         onClose={onClose}
//       /> */}
//     </form>
//   );
// };
