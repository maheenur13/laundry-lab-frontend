import { OrderStatus } from '../constants/orderStatus';
import { ClothingCategory, ServiceType } from './clothing';
import { User } from './user';

/**
 * Order item interface.
 */
export interface OrderItem {
  clothingItem: string;
  clothingItemName: string;
  category: ClothingCategory;
  services: ServiceType[];
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

/**
 * Order pricing interface.
 */
export interface OrderPricing {
  itemsTotal: number;
  deliveryCharge: number;
  grandTotal: number;
}

/**
 * Order address interface.
 */
export interface OrderAddress {
  fullAddress: string;
  landmark?: string;
  contactPhone?: string;
}

/**
 * Status history entry interface.
 */
export interface StatusHistoryEntry {
  status: OrderStatus;
  timestamp: string;
  note?: string;
  updatedBy?: string;
}

/**
 * Order interface.
 */
export interface Order {
  id: string;
  customer: User | string;
  deliveryPerson?: User | string;
  items: OrderItem[];
  pricing: OrderPricing;
  pickupAddress: OrderAddress;
  deliveryAddress: OrderAddress;
  status: OrderStatus;
  statusHistory: StatusHistoryEntry[];
  notes?: string;
  scheduledPickupTime?: string;
  estimatedDeliveryTime?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Create order request interface.
 */
export interface CreateOrderRequest {
  items: {
    clothingItemId: string;
    category: ClothingCategory;
    services: ServiceType[];
    quantity: number;
  }[];
  pickupAddress: OrderAddress;
  deliveryAddress?: OrderAddress;
  notes?: string;
  scheduledPickupTime?: string;
}

/**
 * Order statistics interface.
 */
export interface OrderStats {
  totalOrders: number;
  pendingOrders: number;
  inProgressOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  todayOrders: number;
  todayRevenue: number;
}
