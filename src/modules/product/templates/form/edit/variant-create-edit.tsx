// 'use client';

// import { api } from '@/api';
// import { FormTextField } from '@/app/(dashboard)/components/forms/theme-elements/FormTextField';
// import { ImageUpload } from '@/modules/common/components/ImageUpload';
// import { useProduct } from '@/modules/product/queries/use-product';
// import { useVariant } from '@/modules/product/queries/use-variant';
// import {
//   IAttributeValue,
//   ICreateVariant,
//   IUpdateVariant,
//   IVariant,
// } from '@/modules/types/product';
// import { zodResolver } from '@hookform/resolvers/zod';
// import {
//   Button,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogTitle,
//   FormControl,
//   Grid,
//   InputLabel,
//   MenuItem,
//   Select,
//   TextField,
//   Typography,
// } from '@mui/material';
// import { useMutation } from '@tanstack/react-query';
// import { useEffect, useState } from 'react';
// import { Controller, useForm } from 'react-hook-form';
// import { toast } from 'react-toastify';
// import { UpdateProductSchema, VariantSchema, variantSchema } from './schema';

// interface ICreateEditVariantProps {
//   open: boolean;
//   onClose: () => void;
//   variantId?: string;
//   productId?: string;
//   attributes?: Record<string, IAttributeValue[]>;
// }

// export const CreateEditVariant = ({
//   open,
//   onClose,
//   variantId,
//   productId,
//   attributes,
// }: ICreateEditVariantProps) => {
//   const {
//     register,
//     handleSubmit: handleVariantSubmit,
//     control,
//     setValue,
//     reset,
//     watch,
//     formState: { errors },
//   } = useForm<VariantSchema>({
//     resolver: zodResolver(variantSchema),
//   });

//   const [selectedAttributes, setSelectedAttributes] = useState<
//     {
//       title: string;
//       value: string;
//     }[]
//   >([]);

//   useEffect(() => {
//     if (open === false) {
//       setSelectedAttributes([]);
//     }
//   }, [open]);

//   const { variant } = useVariant(variantId as string);
//   const { refetchProduct } = useProduct(productId as string);

//   const createVariantMutation = useMutation({
//     mutationFn: (data: ICreateVariant) => {
//       return api.product.createVariant(productId as string, data);
//     },
//     onSuccess: () => {
//       toast.success('Variant created successfully');
//       onClose();
//       refetchProduct();
//     },
//     onError: () => {
//       toast.error('Failed to create variant');
//     },
//   });

//   const updateVariantMutation = useMutation({
//     mutationFn: (data: IUpdateVariant) => {
//       return api.product.updateVariant(
//         productId as string,
//         variantId as string,
//         data,
//       );
//     },
//     onSuccess: () => {
//       toast.success('Variant updated successfully');
//       onClose();
//       refetchProduct();
//     },
//     onError: () => {
//       toast.error('Failed to update variant');
//     },
//   });

//   const onVariantSubmit = (data: IUpdateVariant | ICreateVariant) => {
//     const newData: ICreateVariant | IUpdateVariant = {
//       ...data,
//       attributes: selectedAttributes,
//     };

//     variantId
//       ? updateVariantMutation.mutate(newData as IUpdateVariant)
//       : createVariantMutation.mutate(newData as ICreateVariant);
//   };

//   useEffect(() => {
//     console.log('selectedAttributes', selectedAttributes);
//   }, [selectedAttributes]);

//   useEffect(() => {
//     if (variantId && variant) {
//       reset(variant);
//     } else {
//       reset();
//     }
//   }, [variantId, variant, reset]);

//   return (
//     <Dialog maxWidth="md" open={open} onClose={onClose} fullWidth>
//       <DialogTitle>{variantId ? 'Edit' : 'Create'} Variant</DialogTitle>
//       <DialogContent style={{ padding: 20 }}>
//         <Grid container spacing={2} key={variant?.id}>
//           <Grid item xs={12} sm={6}>
//             <FormTextField
//               name="sku"
//               control={control}
//               label="SKU"
//               fullWidth
//               required
//             />
//           </Grid>
//           <Grid item xs={12} sm={6}>
//             <FormTextField
//               name="stock"
//               control={control}
//               label="Stock"
//               type="number"
//               fullWidth
//               required
//             />
//           </Grid>
//           <Grid item xs={12} sm={3}>
//             <FormTextField
//               name="weight"
//               control={control}
//               label="Weight (in grams)"
//               type="number"
//               fullWidth
//               required
//             />
//           </Grid>
//           <Grid item xs={12} sm={3}>
//             <FormTextField
//               name="width"
//               control={control}
//               label="Width (in cm)"
//               type="number"
//               fullWidth
//               required
//             />
//           </Grid>
//           <Grid item xs={12} sm={3}>
//             <FormTextField
//               name="height"
//               control={control}
//               label="Height (in cm)"
//               type="number"
//               fullWidth
//               required
//             />
//           </Grid>
//           <Grid item xs={12} sm={3}>
//             <FormTextField
//               name="length"
//               control={control}
//               label="Length (in cm)"
//               type="number"
//               fullWidth
//               required
//             />
//           </Grid>

//           {variant?.attributeValues?.map((attr, attrIndex) => (
//             <Grid item xs={12} sm={6} key={attr.id}>
//               <TextField
//                 label={attr.attribute?.title}
//                 value={attr.value}
//                 disabled
//                 fullWidth
//               />
//             </Grid>
//           ))}

//           {Object.entries(attributes || {})
//             .filter(
//               ([title]) =>
//                 !variant?.attributeValues?.some(
//                   (attr) => attr.attribute?.title === title,
//                 ),
//             )
//             .map(([title, values], index) => (
//               <Grid item xs={12} sm={6} key={title}>
//                 <FormControl fullWidth>
//                   <InputLabel>{title}</InputLabel>
//                   <Select
//                     value={
//                       selectedAttributes.find((attr) => attr.title === title)
//                         ?.value
//                     }
//                     onChange={(e) => {
//                       setSelectedAttributes((prev) => {
//                         const existingIndex = prev.findIndex(
//                           (attr) => attr.title === title,
//                         );

//                         if (existingIndex >= 0) {
//                           const newAttributes = [...prev];
//                           newAttributes[existingIndex] = {
//                             title,
//                             value: e.target.value as string,
//                           };
//                           return newAttributes;
//                         }

//                         return [
//                           ...prev,
//                           {
//                             title,
//                             value: e.target.value as string,
//                           },
//                         ];
//                       });
//                     }}
//                     label={title}
//                   >
//                     {values.map((attr) => (
//                       <MenuItem key={attr.value} value={attr.value}>
//                         {attr.value}
//                       </MenuItem>
//                     ))}
//                   </Select>
//                 </FormControl>
//               </Grid>
//             ))}

//           <Grid item xs={12}>
//             <Typography variant="subtitle1">Thumbnail</Typography>
//             <Controller
//               name="thumbnail"
//               control={control}
//               render={({ field }) => (
//                 <ImageUpload value={field.value} onChange={field.onChange} />
//               )}
//             />
//           </Grid>
//           <Grid item xs={12}>
//             <Typography variant="subtitle1">Images</Typography>
//             <Controller
//               name="images"
//               control={control}
//               render={({ field }) => (
//                 <ImageUpload
//                   multiple
//                   value={field.value}
//                   onChange={field.onChange}
//                 />
//               )}
//             />
//           </Grid>
//         </Grid>
//       </DialogContent>
//       <DialogActions>
//         <Button onClick={onClose}>Cancel</Button>
//         <Button
//           onClick={handleVariantSubmit(onVariantSubmit)}
//           type="submit"
//           variant="contained"
//           color="primary"
//         >
//           Save
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// };
