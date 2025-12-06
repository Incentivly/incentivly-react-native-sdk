import AsyncStorage from '@react-native-async-storage/async-storage';
import { StorageKeys } from './types';

/**
 * Manages local storage for the Incentivly SDK
 */
export class StorageManager {
  /**
   * Get the stored user identifier
   */
  async getUserIdentifier(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(StorageKeys.USER_IDENTIFIER);
    } catch (error) {
      console.error('[IncentivlySDK] Failed to get user identifier:', error);
      return null;
    }
  }

  /**
   * Set the user identifier
   */
  async setUserIdentifier(userIdentifier: string): Promise<void> {
    try {
      await AsyncStorage.setItem(StorageKeys.USER_IDENTIFIER, userIdentifier);
    } catch (error) {
      console.error('[IncentivlySDK] Failed to set user identifier:', error);
      throw error;
    }
  }

  /**
   * Get the stored developer key
   */
  async getDevKey(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(StorageKeys.DEV_KEY);
    } catch (error) {
      console.error('[IncentivlySDK] Failed to get dev key:', error);
      return null;
    }
  }

  /**
   * Set the developer key
   */
  async setDevKey(devKey: string): Promise<void> {
    try {
      await AsyncStorage.setItem(StorageKeys.DEV_KEY, devKey);
    } catch (error) {
      console.error('[IncentivlySDK] Failed to set dev key:', error);
      throw error;
    }
  }

  /**
   * Check if a transaction has already been processed
   */
  async isTransactionProcessed(transactionId: string): Promise<boolean> {
    try {
      const processedJson = await AsyncStorage.getItem(StorageKeys.PROCESSED_TRANSACTIONS);
      if (!processedJson) {
        return false;
      }
      const processed: string[] = JSON.parse(processedJson);
      return processed.includes(transactionId);
    } catch (error) {
      console.error('[IncentivlySDK] Failed to check transaction status:', error);
      return false;
    }
  }

  /**
   * Mark a transaction as processed
   */
  async markTransactionProcessed(transactionId: string): Promise<void> {
    try {
      const processedJson = await AsyncStorage.getItem(StorageKeys.PROCESSED_TRANSACTIONS);
      let processed: string[] = [];
      
      if (processedJson) {
        try {
          processed = JSON.parse(processedJson);
        } catch (parseError) {
          // If parsing fails, start with empty array
          processed = [];
        }
      }

      if (!processed.includes(transactionId)) {
        processed.push(transactionId);
        // Keep only last 1000 transaction IDs to prevent storage bloat
        if (processed.length > 1000) {
          processed = processed.slice(-1000);
        }
        await AsyncStorage.setItem(StorageKeys.PROCESSED_TRANSACTIONS, JSON.stringify(processed));
      }
    } catch (error) {
      console.error('[IncentivlySDK] Failed to mark transaction as processed:', error);
      throw error;
    }
  }

  /**
   * Clear all stored data (useful for testing or logout)
   */
  async clearAll(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        StorageKeys.USER_IDENTIFIER,
        StorageKeys.DEV_KEY,
        StorageKeys.PROCESSED_TRANSACTIONS,
      ]);
    } catch (error) {
      console.error('[IncentivlySDK] Failed to clear storage:', error);
      throw error;
    }
  }
}
