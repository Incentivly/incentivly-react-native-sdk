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
export const StorageKeys = {
  USER_IDENTIFIER: '@incentivly:userIdentifier',
  DEV_KEY: '@incentivly:devKey',
  PROCESSED_TRANSACTIONS: '@incentivly:processedTransactions',
} as const;
