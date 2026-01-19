/**
 * Clothing category enum.
 */
export enum ClothingCategory {
  MEN = 'men',
  WOMEN = 'women',
  CHILDREN = 'children',
}

/**
 * Service type enum.
 */
export enum ServiceType {
  WASHING = 'washing',
  IRONING = 'ironing',
}

/**
 * Localized text interface.
 */
export interface LocalizedText {
  en: string;
  bn: string;
}

/**
 * Clothing item interface.
 */
export interface ClothingItem {
  id: string;
  name: LocalizedText;
  category: ClothingCategory;
  icon: string;
  availableServices: ServiceType[];
  isActive: boolean;
}

/**
 * Laundry service interface.
 */
export interface LaundryService {
  id: string;
  name: LocalizedText;
  type: ServiceType;
  description?: string;
  icon?: string;
  isActive: boolean;
}

/**
 * Pricing interface.
 */
export interface Pricing {
  id: string;
  clothingItem: ClothingItem | string;
  serviceType: ServiceType;
  category: ClothingCategory;
  price: number;
  isActive: boolean;
}
