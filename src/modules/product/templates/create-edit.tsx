'use client';
import { api } from '@/api';
import { FormTextField } from '@/app/(dashboard)/components/forms/theme-elements/FormTextField';
import { ImageUpload } from '@/modules/common/components/ImageUpload';
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
import React, { useEffect } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useProduct } from '../queries/use-product';
import { useProducts } from '../queries/use-products';
import {
  baseSchema,
  CreateProductSchema,
  UpdateProductSchema,
  updateSchema,
} from './schema';
import { IAttribute, IVariant } from '@/modules/types/product';

interface ProductCreateEditTemplateProps {
  id?: string;
}

export const ProductCreateEditTemplate: React.FC<
  ProductCreateEditTemplateProps
> = ({ id }) => {
  const router = useRouter();
  const { refetchProducts } = useProducts();
  const { product, refetchProduct } = useProduct(id as string);

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<CreateProductSchema | UpdateProductSchema>({
    resolver: zodResolver(id ? updateSchema : baseSchema),
    // defaultValues: {
    //   name: 'Test',
    //   description: 'Test',
    //   price: 1599,
    //   discountedPrice: 1299,
    //   weight: 100,
    //   width: 1,
    //   height: 1,
    //   length: 1,
    //   isLive: false,
    //   thumbnail:
    //     'https://res.cloudinary.com/ddnodytow/image/upload/v1729609053/images/m1gyeinkydfdcm45crlb.jpg',
    //   images: [
    //     'https://res.cloudinary.com/ddnodytow/image/upload/v1729609133/images/ggksgbcc9acnb1dr6jb9.jpg',
    //     'https://res.cloudinary.com/ddnodytow/image/upload/v1729609133/images/amw5rxkzo4zlguw2i8la.jpg',
    //     'https://res.cloudinary.com/ddnodytow/image/upload/v1729609133/images/valsiuznkj5zkln5ngnc.jpg',
    //   ],
    //   attributes: [
    //     { title: 'Color', values: ['Red', 'Blue', 'Green'] },
    //     { title: 'Size', values: ['S', 'M', 'L'] },
    //   ],
    //   variants: [
    //     {
    //       sku: '1234567890',
    //       weight: 100,
    //       width: 1,
    //       height: 1,
    //       length: 1,
    //       stock: 1,
    //       thumbnail:
    //         'https://res.cloudinary.com/ddnodytow/image/upload/v1729609053/images/m1gyeinkydfdcm45crlb.jpg',
    //       images: [
    //         'https://res.cloudinary.com/ddnodytow/image/upload/v1729609133/images/ggksgbcc9acnb1dr6jb9.jpg',
    //         'https://res.cloudinary.com/ddnodytow/image/upload/v1729609133/images/amw5rxkzo4zlguw2i8la.jpg',
    //         'https://res.cloudinary.com/ddnodytow/image/upload/v1729609133/images/valsiuznkj5zkln5ngnc.jpg',
    //       ],
    //       attributes: [
    //         { title: 'Color', value: 'Red' },
    //         { title: 'Size', value: 'S' },
    //       ],
    //     },
    //     {
    //       sku: 'SKU7890',
    //       weight: 200,
    //       width: 2,
    //       height: 2,
    //       length: 2,
    //       stock: 2,
    //       thumbnail:
    //         'https://res.cloudinary.com/ddnodytow/image/upload/v1729609637/images/zgf1gzgdb3wi2cmjsjxd.jpg',
    //       images: [
    //         'https://res.cloudinary.com/ddnodytow/image/upload/v1729609654/images/cluyytizzz7z8mfychki.jpg',
    //         'https://res.cloudinary.com/ddnodytow/image/upload/v1729609654/images/kxzjs1tok3xzm9glktoh.jpg',
    //         'https://res.cloudinary.com/ddnodytow/image/upload/v1729609654/images/zeoujfm1uivni5z5iyuv.jpg',
    //       ],
    //       attributes: [
    //         { title: 'Color', value: 'Blue' },
    //         { title: 'Size', value: 'M' },
    //       ],
    //     },
    //   ],
    // },
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

  // useEffect(() => {
  //   if (product?.id) {
  //     reset({
  //       name: product.name,
  //       description: product.description,
  //       thumbnail: product.thumbnail,
  //       images: product.images,
  //       price: product.price,
  //       discountedPrice: product.discountedPrice,
  //       weight: product.weight,
  //       width: product.width,
  //       height: product.height,
  //       length: product.length,
  //       attributes: product.attributes,
  //       variants: product.variants,
  //       isLive: product.isLive,
  //     });
  //   }
  // }, [reset, product]);

  useEffect(() => {
    if (product?.id) {
      reset({
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
        variants: product?.variants,
      });
    }
  }, [reset, product]);

  const createEditProductMutation = useMutation({
    mutationFn: (data: UpdateProductSchema | CreateProductSchema) => {
      return id ? api.product.update(id, data) : api.product.create(data);
    },
    onSuccess: () => {
      toast.success(`Product ${id ? 'updated' : 'created'} successfully`);
      refetchProducts();
      if (id) {
        refetchProduct();
      }
      router.push('/products');
    },
    onError: (error) => {
      console.log(error, 'error');
      toast.error(`Failed to ${id ? 'update' : 'create'} product`);
    },
  });

  const onSubmit = (data: CreateProductSchema | UpdateProductSchema) => {
    console.log('Data', data);
    // createEditProductMutation.mutate({
    //   name: data.name,
    //   description: data.description,
    //   thumbnail: data.thumbnail,
    //   images: data.images,
    //   price: data.price,
    //   discountedPrice: data.discountedPrice,
    //   weight: data.weight,
    //   width: data.width,
    //   height: data.height,
    //   length: data.length,
    //   variants: data.variants,
    //   attributes: data.attributes,
    //   isLive: data.isLive,
    // });
  };

  console.log('errors', errors);

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
          {(product?.id || attributeFields.length > 0) &&
            variantFields.map((field, index) => (
              <Grid container spacing={2} key={field.id}>
                <Grid
                  direction={'row'}
                  style={{ display: 'flex', alignItems: 'center' }}
                  item
                  xs={12}
                >
                  <Typography variant="h6">Variant {index + 1}</Typography>
                  <IconButton onClick={() => removeVariant(index)}>
                    <Delete />
                  </IconButton>
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

                {product?.id &&
                watch(`variants.${index}.attributeValues` as any)?.length > 0
                  ? watch(`variants.${index}.attributeValues` as any)?.map(
                      (attrValue: any, attrIndex: number) => (
                        <Grid item xs={12} sm={6} key={attrValue.id}>
                          <TextField
                            fullWidth
                            label={attrValue.attribute.title}
                            value={attrValue.value}
                            disabled
                            variant="outlined"
                          />
                        </Grid>
                      ),
                    )
                  : attributeFields.map((attr, attrIndex) => (
                      <Grid item xs={12} sm={6} key={attr.id}>
                        <Controller
                          name={`variants.${index}.attributes.${attrIndex}.value`}
                          control={control}
                          render={({ field }) => (
                            <FormControl fullWidth>
                              <InputLabel>
                                {watch(`attributes.${attrIndex}.title`)}
                              </InputLabel>
                              <Select
                                {...field}
                                label={watch(`attributes.${attrIndex}.title`)}
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
                          )}
                        />
                      </Grid>
                    ))}
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

          {(product?.id || attributeFields.length > 0) && (
            <Button
              startIcon={<Add />}
              onClick={() =>
                appendVariant({
                  sku: '',
                  weight: 0,
                  width: 0,
                  height: 0,
                  length: 0,
                  stock: 0,
                  thumbnail: '',
                  images: [],
                  attributes: attributeFields.map((attr) => ({
                    title: attr.title,
                    value: '',
                  })),
                })
              }
              disabled={!product?.id && attributeFields.length === 0}
            >
              Add Variant
            </Button>
          )}
          {!product?.id && attributeFields.length === 0 && (
            <Typography color="error">
              Please add at least one attribute before creating variants.
            </Typography>
          )}
        </AccordionDetails>
      </Accordion>
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h4">
            {id ? 'Edit Product' : 'Create Product'}
          </Typography>
        </Grid>

        <Grid display={'flex'} flexDirection={'column'} item gap={2} xs={12}>
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
                    required
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
              </Grid>
            </AccordionDetails>
          </Accordion>
        </Grid>

        <Grid item xs={12}>
          {renderAttributeSection()}
        </Grid>

        <Grid item xs={12}>
          {renderVariantsSection()}
        </Grid>

        <Grid item xs={12}>
          <Controller
            name="isLive"
            control={control}
            render={({ field }) => (
              <FormControlLabel
                control={
                  <Checkbox
                    checked={field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                  />
                }
                label="Is Live"
              />
            )}
          />
        </Grid>
        <Grid item xs={12}>
          <Button type="submit" variant="contained" color="primary">
            {id ? 'Update Product' : 'Create Product'}
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};
