/**
 * Catalog store - DEPRECATED
 *
 * All catalog data fetching is now handled by TanStack Query hooks:
 * - useClothingItems() - fetch clothing items
 * - useServices() - fetch laundry services
 * - usePricing() - fetch pricing data
 * - useGetPrice() - helper to get price for item/service combo
 * - useSeedCatalog() - seed catalog data (dev only)
 *
 * Import from: src/hooks/useCatalog.ts
 *
 * This file is kept for backwards compatibility but should not be used.
 * All imports should be migrated to use the hooks directly.
 */

import { ClothingCategory, ServiceType } from '../types/clothing';

// Re-export for backwards compatibility - will be removed
export const useCatalogStore = () => {
  console.warn(
    'useCatalogStore is deprecated. Use hooks from src/hooks/useCatalog.ts instead.',
  );
  return {
    clothingItems: [],
    services: [],
    pricing: [],
    isLoading: false,
    error: null,
    fetchClothingItems: async () => {},
    fetchServices: async () => {},
    fetchPricing: async () => {},
    getPrice: () => 0,
    seedCatalog: async () => {},
  };
};
