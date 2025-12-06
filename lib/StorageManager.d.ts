/**
 * Manages local storage for the Incentivly SDK
 */
export declare class StorageManager {
    /**
     * Get the stored user identifier
     */
    getUserIdentifier(): Promise<string | null>;
    /**
     * Set the user identifier
     */
    setUserIdentifier(userIdentifier: string): Promise<void>;
    /**
     * Get the stored developer key
     */
    getDevKey(): Promise<string | null>;
    /**
     * Set the developer key
     */
    setDevKey(devKey: string): Promise<void>;
    /**
     * Check if a transaction has already been processed
     */
    isTransactionProcessed(transactionId: string): Promise<boolean>;
    /**
     * Mark a transaction as processed
     */
    markTransactionProcessed(transactionId: string): Promise<void>;
    /**
     * Clear all stored data (useful for testing or logout)
     */
    clearAll(): Promise<void>;
}
