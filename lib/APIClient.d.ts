import { RegisterUserResponse, UpdateUserIdentifierResponse, ReportPaymentResponse } from './types';
/**
 * Client for making API requests to Incentivly
 */
export declare class APIClient {
    private baseUrl;
    private loggingEnabled;
    constructor(baseUrl?: string, loggingEnabled?: boolean);
    /**
     * Enable or disable detailed logging
     */
    setLoggingEnabled(enabled: boolean): void;
    /**
     * Log a message if logging is enabled
     */
    private log;
    /**
     * Make an API request
     */
    private request;
    /**
     * Register a user with the Incentivly platform
     */
    registerUser(devKey: string, userIdentifier?: string): Promise<RegisterUserResponse>;
    /**
     * Update user identifier
     */
    updateUserIdentifier(currentUserIdentifier: string, newUserIdentifier: string, devKey: string): Promise<UpdateUserIdentifierResponse>;
    /**
     * Report a payment/transaction for iOS
     */
    reportPaymentIOS(userIdentifier: string, productId: string, iosTransactionId: string, devKey: string): Promise<ReportPaymentResponse>;
    /**
     * Report a payment/transaction for Android
     */
    reportPaymentAndroid(userIdentifier: string, productId: string, androidPurchaseToken: string, androidPackageName: string, androidOrderId: string, devKey: string): Promise<ReportPaymentResponse>;
}
