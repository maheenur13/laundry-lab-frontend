import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

const KEYS = {
  TOKEN: 'auth_token',
  USER: 'user_data',
  LANGUAGE: 'app_language',
} as const;

/**
 * Platform-aware storage adapter.
 * Uses SecureStore on native (iOS/Android) and localStorage on web.
 */
const storageAdapter = {
  getItem: async (key: string): Promise<string | null> => {
    if (Platform.OS === 'web') {
      return localStorage.getItem(key);
    }
    return SecureStore.getItemAsync(key);
  },
  setItem: async (key: string, value: string): Promise<void> => {
    if (Platform.OS === 'web') {
      localStorage.setItem(key, value);
      return;
    }
    await SecureStore.setItemAsync(key, value);
  },
  deleteItem: async (key: string): Promise<void> => {
    if (Platform.OS === 'web') {
      localStorage.removeItem(key);
      return;
    }
    await SecureStore.deleteItemAsync(key);
  },
};

/**
 * Secure storage wrapper for sensitive data.
 */
export const storage = {
  /**
   * Save auth token.
   */
  async saveToken(token: string): Promise<void> {
    await storageAdapter.setItem(KEYS.TOKEN, token);
  },

  /**
   * Get auth token.
   */
  async getToken(): Promise<string | null> {
    return storageAdapter.getItem(KEYS.TOKEN);
  },

  /**
   * Remove auth token.
   */
  async removeToken(): Promise<void> {
    await storageAdapter.deleteItem(KEYS.TOKEN);
  },

  /**
   * Save user data.
   */
  async saveUser(user: object): Promise<void> {
    await storageAdapter.setItem(KEYS.USER, JSON.stringify(user));
  },

  /**
   * Get user data.
   */
  async getUser<T>(): Promise<T | null> {
    const data = await storageAdapter.getItem(KEYS.USER);
    return data ? JSON.parse(data) : null;
  },

  /**
   * Remove user data.
   */
  async removeUser(): Promise<void> {
    await storageAdapter.deleteItem(KEYS.USER);
  },

  /**
   * Save language preference.
   */
  async saveLanguage(lang: string): Promise<void> {
    await storageAdapter.setItem(KEYS.LANGUAGE, lang);
  },

  /**
   * Get language preference.
   */
  async getLanguage(): Promise<string | null> {
    return storageAdapter.getItem(KEYS.LANGUAGE);
  },

  /**
   * Clear all stored data (for logout).
   */
  async clearAll(): Promise<void> {
    await Promise.all([
      storageAdapter.deleteItem(KEYS.TOKEN),
      storageAdapter.deleteItem(KEYS.USER),
    ]);
  },
};
