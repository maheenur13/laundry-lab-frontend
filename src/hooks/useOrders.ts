import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/axios';
import { API_ENDPOINTS } from '../constants/api';
import { Order, CreateOrderRequest, OrderStats } from '../types/order';
import { OrderStatus } from '../constants/orderStatus';

// Query keys
export const orderKeys = {
  all: ['orders'] as const,
  myOrders: () => [...orderKeys.all, 'my'] as const,
  assignedOrders: () => [...orderKeys.all, 'assigned'] as const,
  allOrders: (status?: OrderStatus, page?: number) =>
    [...orderKeys.all, 'all', status, page] as const,
  detail: (id: string) => [...orderKeys.all, 'detail', id] as const,
  stats: () => [...orderKeys.all, 'stats'] as const,
  unassigned: () => [...orderKeys.all, 'unassigned'] as const,
};

/**
 * Hook for fetching customer's orders.
 */
export function useMyOrders() {
  return useQuery({
    queryKey: orderKeys.myOrders(),
    queryFn: () => api.get<Order[]>(API_ENDPOINTS.MY_ORDERS),
  });
}

/**
 * Hook for fetching orders assigned to delivery person.
 */
export function useAssignedOrders() {
  return useQuery({
    queryKey: orderKeys.assignedOrders(),
    queryFn: () => api.get<Order[]>(API_ENDPOINTS.ASSIGNED_ORDERS),
  });
}

interface AllOrdersResponse {
  orders: Order[];
  total: number;
  page: number;
  totalPages: number;
}

/**
 * Hook for fetching all orders (admin).
 */
export function useAllOrders(status?: OrderStatus, page = 1) {
  return useQuery({
    queryKey: orderKeys.allOrders(status, page),
    queryFn: () => {
      const params: Record<string, string> = { page: String(page) };
      if (status) params.status = status;
      return api.get<AllOrdersResponse>(API_ENDPOINTS.ALL_ORDERS, params);
    },
  });
}

/**
 * Hook for fetching a single order by ID.
 */
export function useOrder(orderId: string) {
  return useQuery({
    queryKey: orderKeys.detail(orderId),
    queryFn: () => api.get<Order>(`${API_ENDPOINTS.ALL_ORDERS}/${orderId}`),
    enabled: !!orderId,
  });
}

/**
 * Hook for fetching order statistics (admin).
 */
export function useOrderStats() {
  return useQuery({
    queryKey: orderKeys.stats(),
    queryFn: () => api.get<OrderStats>(API_ENDPOINTS.ORDER_STATS),
  });
}

/**
 * Hook for fetching unassigned orders (admin).
 */
export function useUnassignedOrders() {
  return useQuery({
    queryKey: orderKeys.unassigned(),
    queryFn: () => api.get<Order[]>(API_ENDPOINTS.UNASSIGNED_ORDERS),
  });
}

/**
 * Hook for creating a new order.
 */
export function useCreateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateOrderRequest) =>
      api.post<Order>(API_ENDPOINTS.CREATE_ORDER, data),
    onSuccess: (newOrder) => {
      // Add to my orders cache
      queryClient.setQueryData<Order[]>(orderKeys.myOrders(), (old = []) => [
        newOrder,
        ...old,
      ]);
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: orderKeys.all });
    },
  });
}

interface UpdateStatusRequest {
  orderId: string;
  status: OrderStatus;
  note?: string;
}

/**
 * Hook for updating order status.
 */
export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderId, status, note }: UpdateStatusRequest) =>
      api.patch<Order>(`${API_ENDPOINTS.ALL_ORDERS}/${orderId}/status`, {
        status,
        note,
      }),
    onSuccess: (updatedOrder, { orderId }) => {
      // Update the order in cache
      queryClient.setQueryData<Order>(
        orderKeys.detail(orderId),
        updatedOrder,
      );
      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: orderKeys.myOrders() });
      queryClient.invalidateQueries({ queryKey: orderKeys.assignedOrders() });
      queryClient.invalidateQueries({ queryKey: orderKeys.allOrders() });
    },
  });
}

interface AssignDeliveryRequest {
  orderId: string;
  deliveryPersonId: string;
}

/**
 * Hook for assigning delivery person to order (admin).
 */
export function useAssignDelivery() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderId, deliveryPersonId }: AssignDeliveryRequest) =>
      api.patch<Order>(`${API_ENDPOINTS.ALL_ORDERS}/${orderId}/assign`, {
        deliveryPersonId,
      }),
    onSuccess: (updatedOrder, { orderId }) => {
      // Update the order in cache
      queryClient.setQueryData<Order>(
        orderKeys.detail(orderId),
        updatedOrder,
      );
      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: orderKeys.all });
    },
  });
}
