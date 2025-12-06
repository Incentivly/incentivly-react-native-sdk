import { RegisterUserResponse, UpdateUserIdentifierResponse, ReportPaymentResponse, InitializeOptions } from './types';
/**
 * Main SDK class for Incentivly revenue sharing
 */
export declare class IncentivlySDK {
    private static instance;
    private storageManager;
    private apiClient;
    private loggingEnabled;
    private constructor();
    /**
     * Initialize the SDK
     * Call this early in your app lifecycle (e.g., in App.tsx or index.js)
     */
    static initialize(options?: InitializeOptions): void;
    /**
     * Get the shared SDK instance
     */
    static get shared(): IncentivlySDK;
    /**
     * Enable or disable detailed logging
     */
    setLoggingEnabled(enabled: boolean): void;
    /**
     * Check if user is registered
     */
    isUserRegistered(): Promise<boolean>;
    /**
     * Get the current user identifier
     */
    getUserIdentifier(): Promise<string | null>;
    /**
     * Register a user with the Incentivly platform
     * This only happens once per device - subsequent calls return stored identifier
     */
    registerUser(devKey: string, userIdentifier?: string): Promise<RegisterUserResponse>;
    /**
     * Update user identifier
     */
    updateUserIdentifier(newUserIdentifier: string): Promise<UpdateUserIdentifierResponse>;
    /**
     * Report a payment for iOS using StoreKit transaction ID
     */
    reportPaymentIOS(productId: string, iosTransactionId: string): Promise<ReportPaymentResponse>;
    /**
     * Report a payment for Android using Google Play purchase details
     */
    reportPaymentAndroid(productId: string, androidPurchaseToken: string, androidPackageName: string, androidOrderId: string): Promise<ReportPaymentResponse>;
    /**
     * Clear all stored data (useful for testing or logout)
     */
    clearAll(): Promise<void>;
}
