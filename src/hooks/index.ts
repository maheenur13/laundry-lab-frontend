// Auth hooks
export {
  useRequestOtp,
  useVerifyOtp,
  useCompleteSignup,
  useUpdateProfile,
  useLogout,
} from "./useAuth";

// Responsive hooks
export { useResponsive } from "./useResponsive";

// Catalog hooks
export {
  useClothingItems,
  useServices,
  usePricing,
  useSeedCatalog,
  useGetPrice,
  usePrefetchCatalog,
  catalogKeys,
} from "./useCatalog";

// Order hooks
export {
  useMyOrders,
  useAssignedOrders,
  useDeliveryHistory,
  useDeliveryStats,
  useAllOrders,
  useOrder,
  useOrderStats,
  useUnassignedOrders,
  useCreateOrder,
  useUpdateOrderStatus,
  useAssignDelivery,
  useDeliveryPersonnel,
  orderKeys,
  userKeys,
} from "./useOrders";
