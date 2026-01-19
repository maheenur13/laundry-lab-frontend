/**
 * Order status constants - must match backend enum.
 */
export enum OrderStatus {
  REQUESTED = 'requested',
  PICKED_UP = 'picked_up',
  IN_LAUNDRY = 'in_laundry',
  OUT_FOR_DELIVERY = 'out_for_delivery',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
}

/**
 * Order status display configuration.
 */
export const ORDER_STATUS_CONFIG: Record<
  OrderStatus,
  {
    label: { en: string; bn: string };
    color: string;
    bgColor: string;
    icon: string;
  }
> = {
  [OrderStatus.REQUESTED]: {
    label: { en: 'Order Placed', bn: 'অর্ডার দেওয়া হয়েছে' },
    color: '#F59E0B',
    bgColor: '#FEF3C7',
    icon: 'clock',
  },
  [OrderStatus.PICKED_UP]: {
    label: { en: 'Picked Up', bn: 'তোলা হয়েছে' },
    color: '#3B82F6',
    bgColor: '#DBEAFE',
    icon: 'truck',
  },
  [OrderStatus.IN_LAUNDRY]: {
    label: { en: 'In Laundry', bn: 'লন্ড্রিতে আছে' },
    color: '#8B5CF6',
    bgColor: '#EDE9FE',
    icon: 'loader',
  },
  [OrderStatus.OUT_FOR_DELIVERY]: {
    label: { en: 'Out for Delivery', bn: 'ডেলিভারির জন্য বের হয়েছে' },
    color: '#10B981',
    bgColor: '#D1FAE5',
    icon: 'package',
  },
  [OrderStatus.DELIVERED]: {
    label: { en: 'Delivered', bn: 'ডেলিভারি হয়েছে' },
    color: '#059669',
    bgColor: '#A7F3D0',
    icon: 'check-circle',
  },
  [OrderStatus.CANCELLED]: {
    label: { en: 'Cancelled', bn: 'বাতিল' },
    color: '#EF4444',
    bgColor: '#FEE2E2',
    icon: 'x-circle',
  },
};

/**
 * Get next valid status for delivery flow.
 */
export function getNextDeliveryStatus(currentStatus: OrderStatus): OrderStatus | null {
  const flow: Record<OrderStatus, OrderStatus | null> = {
    [OrderStatus.REQUESTED]: OrderStatus.PICKED_UP,
    [OrderStatus.PICKED_UP]: OrderStatus.IN_LAUNDRY,
    [OrderStatus.IN_LAUNDRY]: OrderStatus.OUT_FOR_DELIVERY,
    [OrderStatus.OUT_FOR_DELIVERY]: OrderStatus.DELIVERED,
    [OrderStatus.DELIVERED]: null,
    [OrderStatus.CANCELLED]: null,
  };
  return flow[currentStatus];
}
