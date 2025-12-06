"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.APIClient = void 0;
const Errors_1 = require("./Errors");
const MetadataCollector_1 = require("./MetadataCollector");
const API_BASE_URL = 'https://incentivly.com/api';
/**
 * Client for making API requests to Incentivly
 */
class APIClient {
    constructor(baseUrl = API_BASE_URL, loggingEnabled = false) {
        this.baseUrl = baseUrl;
        this.loggingEnabled = loggingEnabled;
    }
    /**
     * Enable or disable detailed logging
     */
    setLoggingEnabled(enabled) {
        this.loggingEnabled = enabled;
    }
    /**
     * Log a message if logging is enabled
     */
    log(message, data) {
        if (this.loggingEnabled) {
            if (data) {
                console.log(`[IncentivlySDK] ${message}`, data);
            }
            else {
                console.log(`[IncentivlySDK] ${message}`);
            }
        }
    }
    /**
     * Make an API request
     */
    async request(endpoint, method = 'POST', body) {
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
                }
                catch {
                    // Use default error message
                }
                // Handle specific error cases based on response
                if (response.status === 400) {
                    if (errorMessage.includes('not registered') || errorMessage.includes('User must be registered')) {
                        throw new Errors_1.UserNotRegisteredError(errorMessage);
                    }
                    if (errorMessage.includes('devKey') || errorMessage.includes('Developer key')) {
                        throw new Errors_1.DevKeyNotFoundError(errorMessage);
                    }
                    if (errorMessage.includes('transaction') && errorMessage.includes('already')) {
                        throw new Errors_1.TransactionAlreadyProcessedError(errorMessage);
                    }
                    if (errorMessage.includes('transaction') && errorMessage.includes('invalid')) {
                        throw new Errors_1.InvalidTransactionIdError(errorMessage);
                    }
                }
                throw new Errors_1.APIError(response.status, errorMessage);
            }
            const data = await response.json();
            this.log(`✅ [Response Body]`, JSON.stringify(data, null, 2));
            return data;
        }
        catch (error) {
            if (error instanceof Errors_1.IncentivlyError) {
                this.log(`❌ [Error] ${error.name}: ${error.message}`);
                throw error;
            }
            // Network or other errors
            if (error instanceof TypeError && error.message.includes('fetch')) {
                this.log(`❌ [Network Error] Network request failed`);
                throw new Errors_1.NetworkError('Network request failed. Please check your internet connection.');
            }
            this.log(`❌ [Unknown Error]`, error);
            throw new Errors_1.NetworkError(`Request failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    /**
     * Register a user with the Incentivly platform
     */
    async registerUser(devKey, userIdentifier) {
        const metadata = MetadataCollector_1.MetadataCollector.collectMetadata();
        const body = {
            devKey,
            timestamp: new Date().toISOString(), // ISO 8601 timestamp
            ...metadata,
        };
        if (userIdentifier) {
            body.userIdentifier = userIdentifier;
        }
        return this.request('/register-user', 'POST', body);
    }
    /**
     * Update user identifier
     */
    async updateUserIdentifier(currentUserIdentifier, newUserIdentifier, devKey) {
        const metadata = MetadataCollector_1.MetadataCollector.collectMetadata();
        const body = {
            currentUserIdentifier,
            newUserIdentifier,
            devKey,
            timestamp: new Date().toISOString(), // ISO 8601 timestamp
            ...metadata,
        };
        return this.request('/update-user-identifier', 'POST', body);
    }
    /**
     * Report a payment/transaction for iOS
     */
    async reportPaymentIOS(userIdentifier, productId, iosTransactionId, devKey) {
        const metadata = MetadataCollector_1.MetadataCollector.collectMetadata();
        const body = {
            userIdentifier,
            productId,
            iosTransactionId,
            devKey,
            timestamp: new Date().toISOString(), // ISO 8601 timestamp
            ...metadata,
        };
        return this.request('/report-payment', 'POST', body);
    }
    /**
     * Report a payment/transaction for Android
     */
    async reportPaymentAndroid(userIdentifier, productId, androidPurchaseToken, androidPackageName, androidOrderId, devKey) {
        const metadata = MetadataCollector_1.MetadataCollector.collectMetadata();
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
        return this.request('/report-payment', 'POST', body);
    }
}
exports.APIClient = APIClient;
