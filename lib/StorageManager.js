"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StorageManager = void 0;
const async_storage_1 = __importDefault(require("@react-native-async-storage/async-storage"));
const types_1 = require("./types");
/**
 * Manages local storage for the Incentivly SDK
 */
class StorageManager {
    /**
     * Get the stored user identifier
     */
    async getUserIdentifier() {
        try {
            return await async_storage_1.default.getItem(types_1.StorageKeys.USER_IDENTIFIER);
        }
        catch (error) {
            console.error('[IncentivlySDK] Failed to get user identifier:', error);
            return null;
        }
    }
    /**
     * Set the user identifier
     */
    async setUserIdentifier(userIdentifier) {
        try {
            await async_storage_1.default.setItem(types_1.StorageKeys.USER_IDENTIFIER, userIdentifier);
        }
        catch (error) {
            console.error('[IncentivlySDK] Failed to set user identifier:', error);
            throw error;
        }
    }
    /**
     * Get the stored developer key
     */
    async getDevKey() {
        try {
            return await async_storage_1.default.getItem(types_1.StorageKeys.DEV_KEY);
        }
        catch (error) {
            console.error('[IncentivlySDK] Failed to get dev key:', error);
            return null;
        }
    }
    /**
     * Set the developer key
     */
    async setDevKey(devKey) {
        try {
            await async_storage_1.default.setItem(types_1.StorageKeys.DEV_KEY, devKey);
        }
        catch (error) {
            console.error('[IncentivlySDK] Failed to set dev key:', error);
            throw error;
        }
    }
    /**
     * Check if a transaction has already been processed
     */
    async isTransactionProcessed(transactionId) {
        try {
            const processedJson = await async_storage_1.default.getItem(types_1.StorageKeys.PROCESSED_TRANSACTIONS);
            if (!processedJson) {
                return false;
            }
            const processed = JSON.parse(processedJson);
            return processed.includes(transactionId);
        }
        catch (error) {
            console.error('[IncentivlySDK] Failed to check transaction status:', error);
            return false;
        }
    }
    /**
     * Mark a transaction as processed
     */
    async markTransactionProcessed(transactionId) {
        try {
            const processedJson = await async_storage_1.default.getItem(types_1.StorageKeys.PROCESSED_TRANSACTIONS);
            let processed = [];
            if (processedJson) {
                try {
                    processed = JSON.parse(processedJson);
                }
                catch (parseError) {
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
                await async_storage_1.default.setItem(types_1.StorageKeys.PROCESSED_TRANSACTIONS, JSON.stringify(processed));
            }
        }
        catch (error) {
            console.error('[IncentivlySDK] Failed to mark transaction as processed:', error);
            throw error;
        }
    }
    /**
     * Clear all stored data (useful for testing or logout)
     */
    async clearAll() {
        try {
            await async_storage_1.default.multiRemove([
                types_1.StorageKeys.USER_IDENTIFIER,
                types_1.StorageKeys.DEV_KEY,
                types_1.StorageKeys.PROCESSED_TRANSACTIONS,
            ]);
        }
        catch (error) {
            console.error('[IncentivlySDK] Failed to clear storage:', error);
            throw error;
        }
    }
}
exports.StorageManager = StorageManager;
