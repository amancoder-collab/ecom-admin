import { api } from '@/api';
import { useQuery } from '@tanstack/react-query';

const QUERY_KEY = ['products'];

export const useProducts = () => {
  const { data, isLoading, refetch } = useQuery({
    queryKey: QUERY_KEY,
    queryFn: () => api.product.all(),
    retry: false,
  });

  return {
    products: data?.data?.data,
    isLoading,
    refetchProducts: refetch,
  };
};
