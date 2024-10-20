'use client';
import { api } from '@/api';
import { useQuery, useQueryClient } from '@tanstack/react-query';

export const useProduct = (id: string) => {
  const QUERY_KEY = ['product', id];
  const queryClient = useQueryClient();

  const {
    data,
    isLoading,
    refetch: originalRefetch,
  } = useQuery({
    queryKey: QUERY_KEY,
    queryFn: () => api.product.one(id),
    enabled: !!id,
  });

  const refetchProduct = async () => {
    if (id) {
      await originalRefetch();
      await queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    }
  };

  return {
    product: data?.data?.data,
    isLoading,
    refetchProduct,
  };
};
