import {
  RegisterUserResponse,
  UpdateUserIdentifierResponse,
  ReportPaymentResponse,
} from './types';
import {
  IncentivlyError,
  UserNotRegisteredError,
  DevKeyNotFoundError,
  InvalidTransactionIdError,
  TransactionAlreadyProcessedError,
  APIError,
  NetworkError,
} from './Errors';
import { MetadataCollector } from './MetadataCollector';

const API_BASE_URL = 'https://incentivly.com/api';

/**
 * Client for making API requests to Incentivly
 */
export class APIClient {
  private baseUrl: string;
  private loggingEnabled: boolean;

  constructor(baseUrl: string = API_BASE_URL, loggingEnabled: boolean = false) {
    this.baseUrl = baseUrl;
    this.loggingEnabled = loggingEnabled;
  }

  /**
   * Enable or disable detailed logging
   */
  setLoggingEnabled(enabled: boolean): void {
    this.loggingEnabled = enabled;
  }

  /**
   * Log a message if logging is enabled
   */
  private log(message: string, data?: any): void {
    if (this.loggingEnabled) {
      if (data) {
        console.log(`[IncentivlySDK] ${message}`, data);
      } else {
        console.log(`[IncentivlySDK] ${message}`);
      }
    }
  }

  /**
   * Make an API request
   */
  private async request<T>(
    endpoint: string,
    method: 'GET' | 'POST' = 'POST',
    body?: any
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    this.log(`📤 [API Request] ${method} ${url}`);
    if (body) {
      this.log(`📤 [Request Body]`, JSON.stringify(body, null, 2));
    }

    try {
      const requestBody = body ? JSON.stringify(body) : undefined;
      const headers = {
        'Content-Type': 'application/json',
      };
      
      this.log(`📤 [Request Headers]`, JSON.stringify(headers, null, 2));

      const response = await fetch(url, {
        method,
        headers,
        body: requestBody,
      });

      this.log(`📥 [Response Status] ${response.status} ${response.statusText}`);

      if (!response.ok) {
        const errorText = await response.text();
        this.log(`❌ [Error Response Body]`, errorText);
        
        // Try to parse error response
        let errorMessage = `Server returned status ${response.status}`;
        try {
          const errorJson = JSON.parse(errorText);
          if (errorJson.message) {
            errorMessage = errorJson.message;
          }
          this.log(`❌ [Error Response Parsed]`, JSON.stringify(errorJson, null, 2));
        } catch {
          // Use default error message
        }

        // Handle specific error cases based on response
        if (response.status === 400) {
          if (errorMessage.includes('not registered') || errorMessage.includes('User must be registered')) {
            throw new UserNotRegisteredError(errorMessage);
          }
          if (errorMessage.includes('devKey') || errorMessage.includes('Developer key')) {
            throw new DevKeyNotFoundError(errorMessage);
          }
          if (errorMessage.includes('transaction') && errorMessage.includes('already')) {
            throw new TransactionAlreadyProcessedError(errorMessage);
          }
          if (errorMessage.includes('transaction') && errorMessage.includes('invalid')) {
            throw new InvalidTransactionIdError(errorMessage);
          }
        }

        throw new APIError(response.status, errorMessage);
      }

      const data = await response.json();
      this.log(`✅ [Response Body]`, JSON.stringify(data, null, 2));
      return data as T;
    } catch (error) {
      if (error instanceof IncentivlyError) {
        this.log(`❌ [Error] ${error.name}: ${error.message}`);
        throw error;
      }
      
      // Network or other errors
      if (error instanceof TypeError && error.message.includes('fetch')) {
        this.log(`❌ [Network Error] Network request failed`);
        throw new NetworkError('Network request failed. Please check your internet connection.');
      }
      
      this.log(`❌ [Unknown Error]`, error);
      throw new NetworkError(`Request failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Register a user with the Incentivly platform
   */
  async registerUser(
    devKey: string,
    userIdentifier?: string
  ): Promise<RegisterUserResponse> {
    const metadata = MetadataCollector.collectMetadata();
    const body: any = { 
      devKey,
      timestamp: new Date().toISOString(), // ISO 8601 timestamp
      ...metadata,
    };
    if (userIdentifier) {
      body.userIdentifier = userIdentifier;
    }

    return this.request<RegisterUserResponse>('/register-user', 'POST', body);
  }

  /**
   * Update user identifier
   */
  async updateUserIdentifier(
    currentUserIdentifier: string,
    newUserIdentifier: string,
    devKey: string
  ): Promise<UpdateUserIdentifierResponse> {
    const metadata = MetadataCollector.collectMetadata();
    const body = {
      currentUserIdentifier,
      newUserIdentifier,
      devKey,
      timestamp: new Date().toISOString(), // ISO 8601 timestamp
      ...metadata,
    };

    return this.request<UpdateUserIdentifierResponse>('/update-user-identifier', 'POST', body);
  }

  /**
   * Report a payment/transaction for iOS
   */
  async reportPaymentIOS(
    userIdentifier: string,
    productId: string,
    iosTransactionId: string,
    devKey: string
  ): Promise<ReportPaymentResponse> {
    const metadata = MetadataCollector.collectMetadata();
    const body = {
      userIdentifier,
      productId,
      iosTransactionId,
      devKey,
      timestamp: new Date().toISOString(), // ISO 8601 timestamp
      ...metadata,
    };

    return this.request<ReportPaymentResponse>('/report-payment', 'POST', body);
  }

  /**
   * Report a payment/transaction for Android
   */
  async reportPaymentAndroid(
    userIdentifier: string,
    productId: string,
    androidPurchaseToken: string,
    androidPackageName: string,
    androidOrderId: string,
    devKey: string
  ): Promise<ReportPaymentResponse> {
    const metadata = MetadataCollector.collectMetadata();
    const body = {
      userIdentifier,
      productId,
      androidPurchaseToken,
      androidPackageName,
      androidOrderId,
      devKey,
      timestamp: new Date().toISOString(), // ISO 8601 timestamp
      ...metadata,
    };

    return this.request<ReportPaymentResponse>('/report-payment', 'POST', body);
  }
}

