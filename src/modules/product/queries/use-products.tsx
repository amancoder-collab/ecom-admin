import { api } from '@/api';
import { useQuery } from '@tanstack/react-query';

export const useProducts = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: () => api.product.all(),
    retry: false,
  });

  return {
    products: data?.data?.data,
    isLoading,
  };
};
