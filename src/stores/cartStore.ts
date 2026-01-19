import { create } from 'zustand';
import { ClothingItem, ServiceType, ClothingCategory } from '../types/clothing';

/**
 * Cart item interface.
 */
export interface CartItem {
  id: string; // Unique ID for cart item
  clothingItem: ClothingItem;
  category: ClothingCategory;
  services: ServiceType[];
  quantity: number;
  unitPrice: number;
}

interface CartState {
  items: CartItem[];
  deliveryCharge: number;

  // Computed
  itemsTotal: number;
  grandTotal: number;
  itemCount: number;

  // Actions
  addItem: (item: Omit<CartItem, 'id'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  updateServices: (id: string, services: ServiceType[]) => void;
  clearCart: () => void;
  setDeliveryCharge: (charge: number) => void;
}

const DEFAULT_DELIVERY_CHARGE = 60;

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  deliveryCharge: DEFAULT_DELIVERY_CHARGE,
  itemsTotal: 0,
  grandTotal: 0,
  itemCount: 0,

  /**
   * Add item to cart.
   */
  addItem: (item) => {
    const { items } = get();

    // Check if same item with same services exists
    const existingIndex = items.findIndex(
      (i) =>
        i.clothingItem.id === item.clothingItem.id &&
        i.category === item.category &&
        JSON.stringify(i.services.sort()) === JSON.stringify(item.services.sort()),
    );

    let newItems: CartItem[];

    if (existingIndex >= 0) {
      // Update quantity of existing item
      newItems = items.map((i, index) =>
        index === existingIndex
          ? { ...i, quantity: i.quantity + item.quantity }
          : i,
      );
    } else {
      // Add new item
      const id = `${item.clothingItem.id}-${item.category}-${Date.now()}`;
      newItems = [...items, { ...item, id }];
    }

    const itemsTotal = calculateItemsTotal(newItems);
    const { deliveryCharge } = get();

    set({
      items: newItems,
      itemsTotal,
      grandTotal: itemsTotal + deliveryCharge,
      itemCount: newItems.reduce((sum, i) => sum + i.quantity, 0),
    });
  },

  /**
   * Remove item from cart.
   */
  removeItem: (id) => {
    const { items, deliveryCharge } = get();
    const newItems = items.filter((i) => i.id !== id);
    const itemsTotal = calculateItemsTotal(newItems);

    set({
      items: newItems,
      itemsTotal,
      grandTotal: newItems.length > 0 ? itemsTotal + deliveryCharge : 0,
      itemCount: newItems.reduce((sum, i) => sum + i.quantity, 0),
    });
  },

  /**
   * Update item quantity.
   */
  updateQuantity: (id, quantity) => {
    if (quantity < 1) return;

    const { items, deliveryCharge } = get();
    const newItems = items.map((i) =>
      i.id === id ? { ...i, quantity } : i,
    );
    const itemsTotal = calculateItemsTotal(newItems);

    set({
      items: newItems,
      itemsTotal,
      grandTotal: itemsTotal + deliveryCharge,
      itemCount: newItems.reduce((sum, i) => sum + i.quantity, 0),
    });
  },

  /**
   * Update item services.
   */
  updateServices: (id, services) => {
    const { items, deliveryCharge } = get();
    const newItems = items.map((i) =>
      i.id === id ? { ...i, services } : i,
    );
    const itemsTotal = calculateItemsTotal(newItems);

    set({
      items: newItems,
      itemsTotal,
      grandTotal: itemsTotal + deliveryCharge,
    });
  },

  /**
   * Clear all items from cart.
   */
  clearCart: () => {
    set({
      items: [],
      itemsTotal: 0,
      grandTotal: 0,
      itemCount: 0,
    });
  },

  /**
   * Set delivery charge.
   */
  setDeliveryCharge: (charge) => {
    const { itemsTotal, items } = get();
    set({
      deliveryCharge: charge,
      grandTotal: items.length > 0 ? itemsTotal + charge : 0,
    });
  },
}));

/**
 * Calculate total price of items.
 */
function calculateItemsTotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
}
