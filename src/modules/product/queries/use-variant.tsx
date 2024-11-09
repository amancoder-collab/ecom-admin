'use client';
import { api } from '@/api';
import { useQuery, useQueryClient } from '@tanstack/react-query';

export const useVariant = (id: string) => {
  const QUERY_KEY = ['variant', id];
  const queryClient = useQueryClient();

  const {
    data,
    isLoading,
    refetch: originalRefetch,
  } = useQuery({
    queryKey: QUERY_KEY,
    queryFn: () => api.product.getVariantById(id),
    enabled: !!id,
  });

  const refetchProduct = async () => {
    if (id) {
      await originalRefetch();
      await queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    }
  };

  return {
    variant: data?.data?.data,
    isLoading,
    refetchProduct,
  };
};
