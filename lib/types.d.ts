/**
 * Response type for user registration
 */
export interface RegisterUserResponse {
    success: boolean;
    userIdentifier?: string;
    influencerId?: string;
    referralId?: string;
    message?: string;
}
/**
 * Response type for updating user identifier
 */
export interface UpdateUserIdentifierResponse {
    success: boolean;
    message?: string;
    registrationsUpdated?: number;
    paymentsUpdated?: number;
}
/**
 * Response type for payment reporting
 */
export interface ReportPaymentResponse {
    success: boolean;
    message?: string;
    paymentId?: string;
}
/**
 * Options for SDK initialization
 */
export interface InitializeOptions {
    loggingEnabled?: boolean;
}
/**
 * Internal storage keys
 */
export declare const StorageKeys: {
    readonly USER_IDENTIFIER: "@incentivly:userIdentifier";
    readonly DEV_KEY: "@incentivly:devKey";
    readonly PROCESSED_TRANSACTIONS: "@incentivly:processedTransactions";
};
