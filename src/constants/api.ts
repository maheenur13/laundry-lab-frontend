import { Platform } from "react-native";
import Constants from "expo-constants";

/**
 * API configuration constants.
 * Environment variables are loaded from app.config.ts via expo-constants.
 */

// Get environment variables from expo config
const extra = Constants.expoConfig?.extra || {};

const API_URL_DEV = extra.apiUrlDev || "http://192.168.0.102:3000/api/v1";
const API_URL_PROD =
  extra.apiUrlProd || "https://laundry-lab-backend.onrender.com/api/v1";
const API_URL_ANDROID_EMU =
  extra.apiUrlAndroidEmu || "http://10.0.2.2:3000/api/v1";

/**
 * Get the development API URL based on platform.
 * - iOS Simulator: Uses dev URL
 * - Android Emulator: Uses special 10.0.2.2 IP to access host machine
 * - Physical device: Uses dev URL (your computer's local IP)
 */
const getDevApiUrl = () => {
  if (Platform.OS === "android") {
    // Check if running on emulator vs physical device
    // For simplicity, we use the dev URL which should have your local IP
    return API_URL_DEV;
  }
  return API_URL_DEV;
};

// Base URL for the API
export const API_BASE_URL = __DEV__ ? getDevApiUrl() : API_URL_PROD;

// Log the API URL in development for debugging
if (__DEV__) {
  console.log("🔗 API Base URL:", API_BASE_URL);
}

// API endpoints
export const API_ENDPOINTS = {
  // Auth
  REQUEST_OTP: "/auth/request-otp",
  VERIFY_OTP: "/auth/verify-otp",
  COMPLETE_SIGNUP: "/auth/complete-signup",
  REFRESH_TOKEN: "/auth/refresh-token",

  // Users
  GET_PROFILE: "/users/me",
  UPDATE_PROFILE: "/users/me",
  GET_DELIVERY_PERSONNEL: "/users/delivery-personnel",

  // Catalog
  CLOTHING_ITEMS: "/catalog/clothing-items",
  SERVICES: "/catalog/services",
  PRICING: "/catalog/pricing",
  SEED_CATALOG: "/catalog/seed",

  // Orders
  CREATE_ORDER: "/orders",
  MY_ORDERS: "/orders/my",
  ASSIGNED_ORDERS: "/orders/assigned",
  ALL_ORDERS: "/orders",
  ORDER_STATS: "/orders/stats",
  UNASSIGNED_ORDERS: "/orders/unassigned",
} as const;

// Request timeout in milliseconds
export const API_TIMEOUT = 30000;
