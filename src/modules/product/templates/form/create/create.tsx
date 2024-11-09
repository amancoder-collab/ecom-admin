'use client';
import { api } from '@/api';
import { FormTextField } from '@/app/(dashboard)/components/forms/theme-elements/FormTextField';
import { ConfirmationDialog } from '@/modules/common/components/ConfirmationDialog';
import { ImageUpload } from '@/modules/common/components/ImageUpload';
import { useProduct } from '@/modules/product/queries/use-product';
import { zodResolver } from '@hookform/resolvers/zod';
import { Add, Delete, ExpandMore } from '@mui/icons-material';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Autocomplete,
  Button,
  Checkbox,
  Chip,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useProducts } from '../../../queries/use-products';
import {
  createProductSchemaWithoutVariants,
  CreateProductSchemaWithoutVariants,
  createProductSchemaWithVariants,
  CreateProductSchemaWithVariants,
  updateProductSchemaWithoutVariants,
  UpdateProductSchemaWithoutVariants,
  updateProductSchemaWithVariants,
  UpdateProductSchemaWithVariants,
} from './schema';

interface ProductCreateEditTemplateProps {
  id?: string;
}

export const ProductCreateEditTemplate: React.FC<
  ProductCreateEditTemplateProps
> = ({ id }) => {
  const router = useRouter();
  const { refetchProducts } = useProducts();
  const { product, refetchProduct } = useProduct(id as string);
  const [hasVariants, setHasVariants] = useState(true);
  const [isEdit, setIsEdit] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [variantToDelete, setVariantToDelete] = useState<{
    id: string;
    index: number;
  } | null>(null);

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm<
    | CreateProductSchemaWithoutVariants
    | CreateProductSchemaWithVariants
    | UpdateProductSchemaWithoutVariants
    | UpdateProductSchemaWithVariants
  >({
    resolver: zodResolver(
      hasVariants
        ? isEdit
          ? updateProductSchemaWithVariants
          : createProductSchemaWithVariants
        : isEdit
        ? updateProductSchemaWithoutVariants
        : createProductSchemaWithoutVariants,
    ),
    defaultValues: {
      name: 'Default for Create Test',
      description: 'Test',
      isActive: true,
      attributes: [
        { title: 'Color', values: ['Red', 'Blue', 'Green'] },
        { title: 'Size', values: ['S', 'M', 'L'] },
      ],
      variants: [
        {
          sku: '1234567890',
          weight: 100,
          width: 1,
          height: 1,
          isActive: true,
          length: 1,
          stock: 1,
          price: 1599,
          thumbnail:
            'https://res.cloudinary.com/ddnodytow/image/upload/v1729609053/images/m1gyeinkydfdcm45crlb.jpg',
          images: [
            'https://res.cloudinary.com/ddnodytow/image/upload/v1729609133/images/ggksgbcc9acnb1dr6jb9.jpg',
            'https://res.cloudinary.com/ddnodytow/image/upload/v1729609133/images/amw5rxkzo4zlguw2i8la.jpg',
            'https://res.cloudinary.com/ddnodytow/image/upload/v1729609133/images/valsiuznkj5zkln5ngnc.jpg',
          ],
          attributes: [
            { title: 'Color', value: 'Red' },
            { title: 'Size', value: 'S' },
          ],
        },
        {
          sku: 'SKU7890',
          weight: 200,
          width: 2,
          height: 2,
          length: 2,
          stock: 2,
          price: 1599,
          discountedPrice: 1299,
          isActive: true,
          thumbnail:
            'https://res.cloudinary.com/ddnodytow/image/upload/v1729609637/images/zgf1gzgdb3wi2cmjsjxd.jpg',
          images: [
            'https://res.cloudinary.com/ddnodytow/image/upload/v1729609654/images/cluyytizzz7z8mfychki.jpg',
            'https://res.cloudinary.com/ddnodytow/image/upload/v1729609654/images/kxzjs1tok3xzm9glktoh.jpg',
            'https://res.cloudinary.com/ddnodytow/image/upload/v1729609654/images/zeoujfm1uivni5z5iyuv.jpg',
          ],
          attributes: [
            { title: 'Color', value: 'Blue' },
            { title: 'Size', value: 'M' },
          ],
        },
      ],
    },
  });

  const {
    fields: variantFields,
    append: appendVariant,
    remove: removeVariant,
  } = useFieldArray({
    control,
    name: 'variants',
  });

  const {
    fields: attributeFields,
    append: appendAttribute,
    remove: removeAttribute,
  } = useFieldArray({
    control,
    name: 'attributes',
  });

  const createEditProductMutation = useMutation({
    mutationFn: (
      data:
        | CreateProductSchemaWithVariants
        | (CreateProductSchemaWithoutVariants & { hasVariants: boolean }),
    ) => {
      return api.product.create(data);
    },
    onSuccess: () => {
      toast.success(`Product created successfully`);
      refetchProducts();
      router.push('/products');
    },
    onError: (error) => {
      console.log(error, 'error');
      toast.error(`Failed to create product`);
    },
  });

  const updateProductMutation = useMutation({
    mutationFn: (
      data:
        | UpdateProductSchemaWithVariants
        | UpdateProductSchemaWithoutVariants
        | { hasVariants: boolean },
    ) => {
      return api.product.update(id as string, data);
    },
    onSuccess: () => {
      toast.success(`Product updated successfully`);
      refetchProducts();
      router.push('/products');
    },
    onError: (error) => {
      console.log(error, 'error');
      toast.error(`Failed to update product`);
    },
  });

  const deleteVariantMutation = useMutation({
    mutationFn: (variantId: string) => {
      return api.product.deleteVariantById(variantId);
    },
    onSuccess: () => {
      toast.success('Variant deleted successfully');
      refetchProduct();
      setDeleteDialogOpen(false);
      setVariantToDelete(null);
    },
    onError: (error) => {
      console.error('Error deleting variant:', error);
      toast.error('Failed to delete variant');
    },
  });

  const onDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
    setVariantToDelete(null);
  };

  const onDeleteDialogConfirm = () => {
    if (variantToDelete?.id) {
      deleteVariantMutation.mutate(variantToDelete.id);
    } else {
      setValue(
        'variants',
        watch('variants').filter(
          (_, index) => index !== variantToDelete?.index,
        ),
      );
      setDeleteDialogOpen(false);
      setVariantToDelete(null);
    }
  };

  const onSubmit = (
    data:
      | CreateProductSchemaWithVariants
      | CreateProductSchemaWithoutVariants
      | UpdateProductSchemaWithVariants
      | UpdateProductSchemaWithoutVariants,
  ) => {
    if (isEdit) {
      updateProductMutation.mutate({
        ...data,
        hasVariants,
      });
    } else {
      createEditProductMutation.mutate({
        ...data,
        hasVariants,
      });
    }
  };

  console.log('errors', errors);

  useEffect(() => {
    if (id) {
      setIsEdit(true);
    }
  }, [id]);

  useEffect(() => {
    if (product) {
      reset({
        id: product.id,
        name: product.name,
        description: product.description,
        thumbnail: product.thumbnail,
        images: product.images,
        price: product.price,
        discountedPrice: product.discountedPrice,
        weight: product.weight,
        width: product.width,
        height: product.height,
        length: product.length,
        isActive: product.isActive,
        attributes: product.attributes?.map((e) => ({
          title: e.title,
          values: e.values.map((v) => v.value),
        })),
        variants: product.variants?.map((e) => ({
          ...e,
          attributes: e.attributeValues?.map((attr) => ({
            title: attr.attribute?.title,
            value: attr.value,
          })),
        })),
      });

      setHasVariants(product.hasVariants);
    }
  }, [reset, product]);

  const renderAttributeSection = () => {
    return (
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography variant="h6">Product Attributes</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              {attributeFields.map((field, index) => (
                <Grid container marginBottom={2} spacing={2} key={field.id}>
                  <Grid item xs={5}>
                    <FormTextField
                      name={`attributes.${index}.title`}
                      control={control}
                      label="Attribute Title"
                      required
                    />
                  </Grid>
                  <Grid item xs={5}>
                    <Controller
                      name={`attributes.${index}.values`}
                      control={control}
                      defaultValue={[]}
                      render={({ field }) => (
                        <Autocomplete
                          multiple
                          freeSolo
                          options={[]}
                          value={field.value}
                          onChange={(_, newValue) => {
                            field.onChange(newValue);
                          }}
                          renderTags={(value: string[], getTagProps) =>
                            value.map((option: string, index: number) => {
                              const { key, ...otherTagProps } = getTagProps({
                                index,
                              });
                              return (
                                <Chip
                                  key={key}
                                  variant="outlined"
                                  label={option}
                                  {...otherTagProps}
                                />
                              );
                            })
                          }
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              variant="outlined"
                              label="Attribute Values"
                              placeholder="Type and press enter"
                            />
                          )}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <IconButton onClick={() => removeAttribute(index)}>
                      <Delete />
                    </IconButton>
                  </Grid>
                </Grid>
              ))}
              <Button
                startIcon={<Add />}
                onClick={() => appendAttribute({ title: '', values: [] })}
              >
                Add Attribute
              </Button>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
    );
  };

  const renderVariantsSection = () => {
    return (
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography variant="h6">Variants</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {attributeFields.length > 0 &&
            variantFields.map((field, index) => (
              <Grid container spacing={2} key={field.id}>
                <Grid
                  display={'flex'}
                  direction={'row'}
                  justifyContent={'space-between'}
                  alignItems={'center'}
                  item
                  xs={12}
                >
                  <Grid item xs={12}>
                    <Typography variant="h6">Variant {index + 1}</Typography>
                  </Grid>
                  <Grid item xs={12} display={'flex'} alignItems={'end'}>
                    <IconButton
                      color="error"
                      onClick={() => {
                        const variant = watch(`variants.${index}`);

                        if (variant?.id) {
                          setVariantToDelete({
                            id: variant.id as string,
                            index,
                          });
                          setDeleteDialogOpen(true);
                        } else {
                          removeVariant(index);
                        }
                      }}
                    >
                      <Delete />
                    </IconButton>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={watch(`variants.${index}.isActive`)}
                          onChange={(e) =>
                            setValue(
                              `variants.${index}.isActive`,
                              e.target.checked,
                            )
                          }
                        />
                      }
                      label="Is Active"
                    />
                  </Grid>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormTextField
                    name={`variants.${index}.sku`}
                    control={control}
                    label="SKU"
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormTextField
                    name={`variants.${index}.stock`}
                    control={control}
                    label="Stock"
                    type="number"
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <FormTextField
                    name={`variants.${index}.weight`}
                    control={control}
                    label="Weight (in grams)"
                    type="number"
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <FormTextField
                    name={`variants.${index}.width`}
                    control={control}
                    label="Width (in cm)"
                    type="number"
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <FormTextField
                    name={`variants.${index}.height`}
                    control={control}
                    label="Height (in cm)"
                    type="number"
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <FormTextField
                    name={`variants.${index}.length`}
                    control={control}
                    label="Length (in cm)"
                    type="number"
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <FormTextField
                    name={`variants.${index}.price`}
                    control={control}
                    label="Price"
                    type="number"
                    required
                  />
                </Grid>

                <Grid item xs={12} sm={3}>
                  <FormTextField
                    name={`variants.${index}.discountedPrice`}
                    control={control}
                    label="Discounted Price"
                    type="number"
                  />
                </Grid>

                {attributeFields.map((attr, attrIndex) => {
                  const attributeTitle = watch(`attributes.${attrIndex}.title`);

                  const variantAttribute = watch(
                    `variants.${index}.attributes`,
                  )?.find((varAttr) => varAttr?.title === attributeTitle);

                  return (
                    <Grid item xs={12} sm={6} key={attr.id}>
                      <Controller
                        name={`variants.${index}.attributes.${attrIndex}`}
                        // name={`variants.${index}.attributes.${attrIndex}.value`}
                        control={control}
                        render={({ field }) => {
                          const handleChange = (newValue: string) => {
                            field.onChange({
                              title: attributeTitle,
                              value: newValue,
                            });
                          };

                          return (
                            <FormControl fullWidth>
                              <InputLabel>
                                {/* {watch(`attributes.${attrIndex}.title`)} */}
                                {attributeTitle}
                              </InputLabel>
                              {/* {console.log(
                              'attribute title logs 66666',
                              watch(`attributes.${attrIndex}.title`),
                              'field.value',
                              field.value,
                              'currentAttributeValue',
                              currentAttributeValue,
                            )} */}
                              <Select
                                value={variantAttribute?.value || ''}
                                label={attributeTitle}
                                onChange={(e) => handleChange(e.target.value)}

                                // {...field}
                                // value={
                                //   field.value || currentAttributeValue || ''
                                // }
                                // label={watch(`attributes.${attrIndex}.title`)}
                              >
                                {watch(`attributes.${attrIndex}.values`).map(
                                  (value: string) => (
                                    <MenuItem key={value} value={value}>
                                      {value}
                                    </MenuItem>
                                  ),
                                )}
                              </Select>
                            </FormControl>
                          );
                        }}
                      />
                    </Grid>
                  );
                })}
                <Grid item xs={12}>
                  <Typography variant="subtitle1">Thumbnail</Typography>
                  <Controller
                    name={`variants.${index}.thumbnail`}
                    control={control}
                    render={({ field }) => (
                      <ImageUpload
                        value={field.value}
                        onChange={field.onChange}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle1">Images</Typography>
                  <Controller
                    name={`variants.${index}.images`}
                    control={control}
                    render={({ field }) => (
                      <ImageUpload
                        multiple
                        value={field.value}
                        onChange={field.onChange}
                      />
                    )}
                  />
                </Grid>
              </Grid>
            ))}

          {attributeFields.length > 0 && (
            <Button
              startIcon={<Add />}
              onClick={() =>
                appendVariant({
                  sku: '',
                  weight: 0,
                  isActive: true,
                  width: 0,
                  height: 0,
                  length: 0,
                  stock: 0,
                  thumbnail: '',
                  images: [],
                  price: 0,
                  discountedPrice: 0,
                  attributes: attributeFields.map((attr) => ({
                    title: attr.title,
                    value: '',
                  })),
                })
              }
              disabled={attributeFields.length === 0}
            >
              Add Variant
            </Button>
          )}
          {attributeFields.length === 0 && (
            <Typography color="error">
              Please add at least one attribute before creating variants.
            </Typography>
          )}
        </AccordionDetails>
      </Accordion>
    );
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' && e.target instanceof HTMLInputElement) {
          e.preventDefault();
        }
      }}
    >
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h4">
            {id ? 'Update Product' : 'Create Product'}
          </Typography>

          <FormControlLabel
            control={
              <Checkbox
                checked={hasVariants}
                onChange={(e) => setHasVariants(e.target.checked)}
              />
            }
            label="Has Variants"
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={watch('isActive')}
                onChange={(e) => setValue('isActive', e.target.checked)}
              />
            }
            label="Is Active"
          />
        </Grid>

        <Grid display={'flex'} flexDirection={'column'} item xs={12}>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="h6">Product Details</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormTextField
                    name="description"
                    control={control}
                    label="Description"
                    variant="outlined"
                    required
                    multiline
                    rows={4}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormTextField
                    name="name"
                    control={control}
                    label="Name"
                    required
                  />
                </Grid>
                {!hasVariants && (
                  <>
                    <Grid item xs={12} sm={6}>
                      <FormTextField
                        name="price"
                        control={control}
                        label="Price"
                        type="number"
                        required
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormTextField
                        name="discountedPrice"
                        control={control}
                        label="Discounted Price"
                        type="number"
                      />
                    </Grid>

                    <Grid item xs={12} sm={3}>
                      <FormTextField
                        name="weight"
                        control={control}
                        label="Weight (in grams)"
                        type="number"
                        required
                      />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <FormTextField
                        name="width"
                        control={control}
                        label="Width (in cm)"
                        type="number"
                        required
                      />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <FormTextField
                        name="height"
                        control={control}
                        label="Height (in cm)"
                        type="number"
                        required
                      />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <FormTextField
                        name="length"
                        control={control}
                        label="Length (in cm)"
                        type="number"
                        required
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <Typography variant="subtitle1">Thumbnail</Typography>
                      <Controller
                        name={`thumbnail`}
                        control={control}
                        render={({ field }) => (
                          <ImageUpload
                            value={field.value}
                            onChange={field.onChange}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="subtitle1">Images</Typography>
                      <Controller
                        name={`images`}
                        control={control}
                        render={({ field }) => (
                          <ImageUpload
                            multiple
                            value={field.value}
                            onChange={field.onChange}
                          />
                        )}
                      />
                    </Grid>
                  </>
                )}
              </Grid>
            </AccordionDetails>
          </Accordion>
        </Grid>
        {hasVariants && (
          <>
            <Grid item xs={12}>
              {renderAttributeSection()}
            </Grid>

            <Grid item xs={12}>
              {renderVariantsSection()}
            </Grid>
          </>
        )}
        <Grid item xs={12}>
          <Button type="submit" variant="contained" color="primary">
            {id ? 'Update Product' : 'Create Product'}
          </Button>
        </Grid>
      </Grid>

      <ConfirmationDialog
        open={deleteDialogOpen}
        onClose={onDeleteDialogClose}
        onConfirm={onDeleteDialogConfirm}
      />
    </form>
  );
};
