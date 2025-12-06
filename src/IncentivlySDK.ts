import { StorageManager } from './StorageManager';
import { APIClient } from './APIClient';
import {
  RegisterUserResponse,
  UpdateUserIdentifierResponse,
  ReportPaymentResponse,
  InitializeOptions,
} from './types';
import {
  UserNotRegisteredError,
  DevKeyNotFoundError,
  TransactionAlreadyProcessedError,
} from './Errors';

/**
 * Main SDK class for Incentivly revenue sharing
 */
export class IncentivlySDK {
  private static instance: IncentivlySDK | null = null;
  private storageManager: StorageManager;
  private apiClient: APIClient;
  private loggingEnabled: boolean = false;

  private constructor() {
    this.storageManager = new StorageManager();
    this.apiClient = new APIClient(undefined, this.loggingEnabled);
  }

  /**
   * Initialize the SDK
   * Call this early in your app lifecycle (e.g., in App.tsx or index.js)
   */
  static initialize(options: InitializeOptions = {}): void {
    const instance = IncentivlySDK.shared;
    instance.loggingEnabled = options.loggingEnabled ?? false;
    instance.apiClient.setLoggingEnabled(instance.loggingEnabled);

    if (instance.loggingEnabled) {
      console.log('[IncentivlySDK] SDK initialized');
    }
  }

  /**
   * Get the shared SDK instance
   */
  static get shared(): IncentivlySDK {
    if (!IncentivlySDK.instance) {
      IncentivlySDK.instance = new IncentivlySDK();
    }
    return IncentivlySDK.instance;
  }

  /**
   * Enable or disable detailed logging
   */
  setLoggingEnabled(enabled: boolean): void {
    this.loggingEnabled = enabled;
    this.apiClient.setLoggingEnabled(enabled);
  }

  /**
   * Check if user is registered
   */
  async isUserRegistered(): Promise<boolean> {
    const userIdentifier = await this.storageManager.getUserIdentifier();
    return userIdentifier !== null;
  }

  /**
   * Get the current user identifier
   */
  async getUserIdentifier(): Promise<string | null> {
    return this.storageManager.getUserIdentifier();
  }

  /**
   * Register a user with the Incentivly platform
   * This only happens once per device - subsequent calls return stored identifier
   */
  async registerUser(
    devKey: string,
    userIdentifier?: string
  ): Promise<RegisterUserResponse> {
    if (this.loggingEnabled) {
      console.log('[IncentivlySDK] 🔐 Starting user registration...');
      console.log('[IncentivlySDK] 🔐 DevKey:', devKey ? `${devKey.substring(0, 10)}...` : 'missing');
      console.log('[IncentivlySDK] 🔐 UserIdentifier:', userIdentifier || 'not provided');
    }

    // Check if user is already registered
    const existingIdentifier = await this.storageManager.getUserIdentifier();
    if (existingIdentifier) {
      if (this.loggingEnabled) {
        console.log('[IncentivlySDK] ℹ️  User already registered (found in local storage)');
        console.log('[IncentivlySDK] ℹ️  Stored user identifier:', existingIdentifier);
        console.log('[IncentivlySDK] ⏭️  Skipping API request - returning cached identifier');
        console.log('[IncentivlySDK] ✅ No API call made - using existing registration');
      }
      return {
        success: true,
        userIdentifier: existingIdentifier,
        message: 'User already registered',
      };
    }

    // Register new user
    try {
      if (this.loggingEnabled) {
        console.log('[IncentivlySDK] 📡 Calling API to register user...');
      }
      
      const response = await this.apiClient.registerUser(devKey, userIdentifier);
      
      if (this.loggingEnabled) {
        console.log('[IncentivlySDK] ✅ Registration API call completed');
        console.log('[IncentivlySDK] ✅ Response:', JSON.stringify(response, null, 2));
      }
      
      if (response.success && response.userIdentifier) {
        // Store user identifier and dev key
        await this.storageManager.setUserIdentifier(response.userIdentifier);
        await this.storageManager.setDevKey(devKey);

        if (this.loggingEnabled) {
          console.log('[IncentivlySDK] 💾 Stored user identifier:', response.userIdentifier);
        }
      }

      return response;
    } catch (error) {
      if (this.loggingEnabled) {
        console.error('[IncentivlySDK] ❌ Registration failed:', error);
        if (error instanceof Error) {
          console.error('[IncentivlySDK] ❌ Error name:', error.name);
          console.error('[IncentivlySDK] ❌ Error message:', error.message);
          console.error('[IncentivlySDK] ❌ Error stack:', error.stack);
        }
      }
      throw error;
    }
  }

  /**
   * Update user identifier
   */
  async updateUserIdentifier(
    newUserIdentifier: string
  ): Promise<UpdateUserIdentifierResponse> {
    const currentUserIdentifier = await this.storageManager.getUserIdentifier();
    const devKey = await this.storageManager.getDevKey();

    if (!currentUserIdentifier) {
      throw new UserNotRegisteredError();
    }

    if (!devKey) {
      throw new DevKeyNotFoundError();
    }

    try {
      const response = await this.apiClient.updateUserIdentifier(
        currentUserIdentifier,
        newUserIdentifier,
        devKey
      );

      if (response.success) {
        // Update stored identifier
        await this.storageManager.setUserIdentifier(newUserIdentifier);
      }

      return response;
    } catch (error) {
      if (this.loggingEnabled) {
        console.error('[IncentivlySDK] Update user identifier failed:', error);
      }
      throw error;
    }
  }

  /**
   * Report a payment for iOS using StoreKit transaction ID
   */
  async reportPaymentIOS(
    productId: string,
    iosTransactionId: string
  ): Promise<ReportPaymentResponse> {
    // Check if already processed locally
    const isProcessed = await this.storageManager.isTransactionProcessed(iosTransactionId);
    if (isProcessed) {
      if (this.loggingEnabled) {
        console.log('[IncentivlySDK] ✅ iOS transaction already processed:', iosTransactionId);
      }
      throw new TransactionAlreadyProcessedError();
    }

    const userIdentifier = await this.storageManager.getUserIdentifier();
    const devKey = await this.storageManager.getDevKey();

    if (!userIdentifier) {
      throw new UserNotRegisteredError();
    }

    if (!devKey) {
      throw new DevKeyNotFoundError();
    }

    try {
      if (this.loggingEnabled) {
        console.log('[IncentivlySDK] 💳 Reporting iOS payment for transaction:', iosTransactionId);
      }

      const response = await this.apiClient.reportPaymentIOS(
        userIdentifier,
        productId,
        iosTransactionId,
        devKey
      );

      if (response.success) {
        // Mark as processed locally
        await this.storageManager.markTransactionProcessed(iosTransactionId);
      }
      
      if (this.loggingEnabled) {
        console.log('[IncentivlySDK] ✅ iOS payment reported successfully:', iosTransactionId);
      }

      return response;
    } catch (error) {
      if (error instanceof TransactionAlreadyProcessedError) {
        // Mark locally even if server says it's already processed
        await this.storageManager.markTransactionProcessed(iosTransactionId);
      }

      if (this.loggingEnabled) {
        console.error('[IncentivlySDK] ❌ Report iOS payment failed:', error);
      }
      throw error;
    }
  }

  /**
   * Report a payment for Android using Google Play purchase details
   */
  async reportPaymentAndroid(
    productId: string,
    androidPurchaseToken: string,
    androidPackageName: string,
    androidOrderId: string
  ): Promise<ReportPaymentResponse> {
    // Check if already processed locally (using order ID as the unique identifier)
    const isProcessed = await this.storageManager.isTransactionProcessed(androidOrderId);
    if (isProcessed) {
      if (this.loggingEnabled) {
        console.log('[IncentivlySDK] ✅ Android transaction already processed:', androidOrderId);
      }
      throw new TransactionAlreadyProcessedError();
    }

    const userIdentifier = await this.storageManager.getUserIdentifier();
    const devKey = await this.storageManager.getDevKey();

    if (!userIdentifier) {
      throw new UserNotRegisteredError();
    }

    if (!devKey) {
      throw new DevKeyNotFoundError();
    }

    try {
      if (this.loggingEnabled) {
        console.log('[IncentivlySDK] 💳 Reporting Android payment for order:', androidOrderId);
      }

      const response = await this.apiClient.reportPaymentAndroid(
        userIdentifier,
        productId,
        androidPurchaseToken,
        androidPackageName,
        androidOrderId,
        devKey
      );

      if (response.success) {
        // Mark as processed locally
        await this.storageManager.markTransactionProcessed(androidOrderId);
      }
      
      if (this.loggingEnabled) {
        console.log('[IncentivlySDK] ✅ Android payment reported successfully:', androidOrderId);
      }

      return response;
    } catch (error) {
      if (error instanceof TransactionAlreadyProcessedError) {
        // Mark locally even if server says it's already processed
        await this.storageManager.markTransactionProcessed(androidOrderId);
      }

      if (this.loggingEnabled) {
        console.error('[IncentivlySDK] ❌ Report Android payment failed:', error);
      }
      throw error;
    }
  }

  /**
   * Clear all stored data (useful for testing or logout)
   */
  async clearAll(): Promise<void> {
    await this.storageManager.clearAll();
  }
}

