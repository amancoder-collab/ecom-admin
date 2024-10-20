'use client';
import { api } from '@/api';
import { ImageUpload } from '@/modules/common/components/ImageUpload';
import { zodResolver } from '@hookform/resolvers/zod';
import { Add, Delete } from '@mui/icons-material';
import {
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  IconButton,
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
import { FormTextField } from '@/app/(dashboard)/components/forms/theme-elements/FormTextField';

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
    formState: { errors },
  } = useForm<CreateProductSchema | UpdateProductSchema>({
    resolver: zodResolver(id ? updateSchema : baseSchema),
    defaultValues: {
      name: 'Test',
      description: 'Test',
      priceWithoutTax: 1599,
      tax: 18,
      discountedPrice: 1299,
      isLive: false,
    },
  });

  const { fields, append, remove } = useFieldArray({
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

  useEffect(() => {
    if (product?.id) {
      reset({
        name: product.name,
        description: product.description,
        thumbnail: product.thumbnail,
        priceWithoutTax: product.priceWithoutTax,
        tax: product.tax,
        discountedPrice: product.discountedPrice,
        variants: product.variants,
        isLive: product.isLive,
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
    console.log(data, 'data');
    const newProductData = {
      name: data.name,
      description: data.description,
      thumbnail: data.thumbnail,
      priceWithoutTax: data.priceWithoutTax,
      tax: data.tax,
      discountedPrice: data.discountedPrice,
      variants: data.variants,
      attributes: data.attributes,
      isLive: data.isLive,
    };
    createEditProductMutation.mutate(newProductData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h4">
            {id ? 'Edit Product' : 'Create Product'}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormTextField name="name" control={control} label="Name" required />
        </Grid>
        <Grid item xs={12}>
          <FormTextField
            name="description"
            control={control}
            label="Description"
            required
            multiline
            rows={4}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormTextField
            name="priceWithoutTax"
            control={control}
            label="Price Without Tax"
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

        <Grid item xs={12} sm={6}>
          <FormTextField
            name="tax"
            control={control}
            label="Tax (in %)"
            type="number"
            required
          />
        </Grid>

        <Grid item xs={12}>
          <Typography variant="h6" marginBottom={2}>
            Product Attributes
          </Typography>
          {attributeFields.map((field, index) => (
            <Grid container spacing={2} key={field.id}>
              <Grid item xs={5}>
                <FormTextField
                  name={`attributes.${index}.name`}
                  control={control}
                  label="Attribute Name"
                  required
                />
              </Grid>
              <Grid item xs={5}>
                <FormTextField
                  name={`attributes.${index}.value`}
                  control={control}
                  label="Attribute Value"
                  required
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
            onClick={() => appendAttribute({ title: '', value: '' })}
          >
            Add Attribute
          </Button>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="subtitle1">Thumbnail</Typography>
          <Controller
            name={`thumbnail`}
            control={control}
            render={({ field }) => (
              <ImageUpload value={field.value} onChange={field.onChange} />
            )}
          />
        </Grid>

        {fields.map((field, index) => (
          <React.Fragment key={field.id}>
            <Grid
              direction={'row'}
              style={{ display: 'flex', alignItems: 'center' }}
              item
              xs={12}
            >
              <Typography variant="h6">Variant {index + 1}</Typography>
              <IconButton onClick={() => remove(index)}>
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
            <Grid item xs={12} sm={3}>
              <FormTextField
                name={`variants.${index}.color`}
                control={control}
                label="Color"
                required
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <FormTextField
                name={`variants.${index}.size`}
                control={control}
                label="Size"
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
                name={`variants.${index}.breadth`}
                control={control}
                label="Breadth (in cm)"
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
            <Grid item xs={12} sm={6}>
              <FormTextField
                name={`variants.${index}.stock`}
                control={control}
                label="Stock"
                type="number"
                required
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
          </React.Fragment>
        ))}
        <Grid item xs={12}>
          <Button
            startIcon={<Add />}
            onClick={() =>
              append({
                sku: '',
                weight: 0,
                breadth: 0,
                height: 0,
                length: 0,
                stock: 0,
                images: [],
                attributes: [],
              })
            }
          >
            Add Variant
          </Button>
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
