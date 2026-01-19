import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/axios';
import { API_ENDPOINTS } from '../constants/api';
import {
  ClothingItem,
  LaundryService,
  Pricing,
  ClothingCategory,
  ServiceType,
} from '../types/clothing';

// Query keys
export const catalogKeys = {
  all: ['catalog'] as const,
  clothingItems: (category?: ClothingCategory) =>
    [...catalogKeys.all, 'clothingItems', category] as const,
  services: () => [...catalogKeys.all, 'services'] as const,
  pricing: () => [...catalogKeys.all, 'pricing'] as const,
};

/**
 * Hook for fetching clothing items.
 */
export function useClothingItems(category?: ClothingCategory) {
  return useQuery({
    queryKey: catalogKeys.clothingItems(category),
    queryFn: async () => {
      const params = category ? { category } : undefined;
      return api.get<ClothingItem[]>(API_ENDPOINTS.CLOTHING_ITEMS, params);
    },
  });
}

/**
 * Hook for fetching laundry services.
 */
export function useServices() {
  return useQuery({
    queryKey: catalogKeys.services(),
    queryFn: () => api.get<LaundryService[]>(API_ENDPOINTS.SERVICES),
  });
}

/**
 * Hook for fetching pricing data.
 */
export function usePricing() {
  return useQuery({
    queryKey: catalogKeys.pricing(),
    queryFn: () => api.get<Pricing[]>(API_ENDPOINTS.PRICING),
  });
}

/**
 * Hook for seeding catalog data (development only).
 */
export function useSeedCatalog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => api.post(API_ENDPOINTS.SEED_CATALOG),
    onSuccess: () => {
      // Invalidate all catalog queries to refetch
      queryClient.invalidateQueries({ queryKey: catalogKeys.all });
    },
  });
}

/**
 * Helper hook to get price for a specific item + service combination.
 */
export function useGetPrice() {
  const { data: pricing = [] } = usePricing();

  return (
    clothingItemId: string,
    serviceType: ServiceType,
    category: ClothingCategory,
  ): number => {
    const priceEntry = pricing.find(
      (p) =>
        (typeof p.clothingItem === 'string'
          ? p.clothingItem
          : p.clothingItem.id) === clothingItemId &&
        p.serviceType === serviceType &&
        p.category === category,
    );
    return priceEntry?.price ?? 0;
  };
}

/**
 * Hook to prefetch all catalog data.
 */
export function usePrefetchCatalog() {
  const queryClient = useQueryClient();

  return () => {
    queryClient.prefetchQuery({
      queryKey: catalogKeys.clothingItems(),
      queryFn: () => api.get<ClothingItem[]>(API_ENDPOINTS.CLOTHING_ITEMS),
    });
    queryClient.prefetchQuery({
      queryKey: catalogKeys.services(),
      queryFn: () => api.get<LaundryService[]>(API_ENDPOINTS.SERVICES),
    });
    queryClient.prefetchQuery({
      queryKey: catalogKeys.pricing(),
      queryFn: () => api.get<Pricing[]>(API_ENDPOINTS.PRICING),
    });
  };
}
