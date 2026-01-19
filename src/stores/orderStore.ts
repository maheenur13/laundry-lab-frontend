import { create } from 'zustand';
import { Order } from '../types/order';

/**
 * Order store - now only handles client-side state.
 * API calls are handled by TanStack Query hooks in src/hooks/useOrders.ts
 */
interface OrderState {
  currentOrder: Order | null;

  // Actions
  setCurrentOrder: (order: Order | null) => void;
  clearCurrentOrder: () => void;
}

export const useOrderStore = create<OrderState>((set) => ({
  currentOrder: null,

  /**
   * Set current order for detail view.
   */
  setCurrentOrder: (order) => {
    set({ currentOrder: order });
  },

  /**
   * Clear current order.
   */
  clearCurrentOrder: () => {
    set({ currentOrder: null });
  },
}));
