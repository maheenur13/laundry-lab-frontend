import * as SecureStore from 'expo-secure-store';

const KEYS = {
  TOKEN: 'auth_token',
  USER: 'user_data',
  LANGUAGE: 'app_language',
} as const;

/**
 * Secure storage wrapper for sensitive data.
 */
export const storage = {
  /**
   * Save auth token.
   */
  async saveToken(token: string): Promise<void> {
    await SecureStore.setItemAsync(KEYS.TOKEN, token);
  },

  /**
   * Get auth token.
   */
  async getToken(): Promise<string | null> {
    return SecureStore.getItemAsync(KEYS.TOKEN);
  },

  /**
   * Remove auth token.
   */
  async removeToken(): Promise<void> {
    await SecureStore.deleteItemAsync(KEYS.TOKEN);
  },

  /**
   * Save user data.
   */
  async saveUser(user: object): Promise<void> {
    await SecureStore.setItemAsync(KEYS.USER, JSON.stringify(user));
  },

  /**
   * Get user data.
   */
  async getUser<T>(): Promise<T | null> {
    const data = await SecureStore.getItemAsync(KEYS.USER);
    return data ? JSON.parse(data) : null;
  },

  /**
   * Remove user data.
   */
  async removeUser(): Promise<void> {
    await SecureStore.deleteItemAsync(KEYS.USER);
  },

  /**
   * Save language preference.
   */
  async saveLanguage(lang: string): Promise<void> {
    await SecureStore.setItemAsync(KEYS.LANGUAGE, lang);
  },

  /**
   * Get language preference.
   */
  async getLanguage(): Promise<string | null> {
    return SecureStore.getItemAsync(KEYS.LANGUAGE);
  },

  /**
   * Clear all stored data (for logout).
   */
  async clearAll(): Promise<void> {
    await Promise.all([
      SecureStore.deleteItemAsync(KEYS.TOKEN),
      SecureStore.deleteItemAsync(KEYS.USER),
    ]);
  },
};
