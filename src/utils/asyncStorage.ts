/**
 * AsyncStorage Utility
 *
 * Centralized helper for reading/writing AsyncStorage data.
 * Reduces duplication of JSON.parse/getItem patterns across services.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  USER_TOKEN: 'userToken',
  USER_INFO: 'userInfo',
} as const;

export { STORAGE_KEYS };

/**
 * Parse and return stored user info object.
 * Returns an empty object if nothing is stored or parsing fails.
 */
export async function getStoredUserInfo<T = Record<string, any>>(): Promise<T> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEYS.USER_INFO);
    return raw ? (JSON.parse(raw) as T) : ({} as T);
  } catch {
    return {} as T;
  }
}

/**
 * Get the current user's _id from stored user info.
 * Returns `null` if not available.
 */
export async function getUserId(): Promise<string | null> {
  const userInfo = await getStoredUserInfo<{ _id?: string }>();
  return userInfo._id ?? null;
}

/**
 * Get the stored auth token.
 * Returns `null` if not available.
 */
export async function getAuthToken(): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(STORAGE_KEYS.USER_TOKEN);
  } catch {
    return null;
  }
}
