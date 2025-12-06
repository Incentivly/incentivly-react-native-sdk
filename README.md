# Incentivly React Native SDK

A React Native SDK for iOS and Android revenue sharing that allows manual reporting of transactions to the Incentivly API.

## Features

* 🌐 API client for handling network requests
* 🔧 Easy setup and initialization
* ✅ Comprehensive error handling
* 📝 Detailed logging for debugging API requests
* 👤 User registration and management
* 💾 Local storage for user identifiers
* 💳 Manual payment reporting and verification
* 🔄 User identifier updates

## Requirements

* React Native 0.60+
* iOS 15.0+ / Android API 21+
* `@react-native-async-storage/async-storage` ^2.0.0

## Installation

### npm

```bash
npm install @incentivly/react-native-sdk @react-native-async-storage/async-storage
```

### yarn

```bash
yarn add @incentivly/react-native-sdk @react-native-async-storage/async-storage
```

### Local Package (Development)

If using as a local package in a monorepo:

```json
{
  "dependencies": {
    "@incentivly/react-native-sdk": "file:./packages/incentivly-react-native-sdk"
  }
}
```

## Usage

### 1. Initialize the SDK

Import and initialize the SDK early in your app lifecycle (e.g., in `App.tsx` or `index.js`):

```typescript
import IncentivlySDK from '@incentivly/react-native-sdk';

// Initialize the SDK with optional logging (call this early in your app lifecycle)
IncentivlySDK.initialize({ loggingEnabled: true });

// Enable or disable detailed logging for debugging (optional)
IncentivlySDK.shared.setLoggingEnabled(true);
```

### 2. User Registration

Register users with your revenue sharing platform. The SDK automatically handles local storage to prevent multiple registrations:

```typescript
import IncentivlySDK from '@incentivly/react-native-sdk';

// Register a user with a developer key
try {
  const response = await IncentivlySDK.shared.registerUser(
    'dk_1a2b3c4d5e_f6g7h8i9j0',
    'user_unique_id_123' // Optional
  );
  
  if (response.success) {
    console.log('User registered successfully!');
    console.log('User ID:', response.userIdentifier);
    console.log('Influencer ID:', response.influencerId);
    console.log('Referral ID:', response.referralId);
    console.log('Message:', response.message);
  }
} catch (error) {
  console.error('Registration failed:', error);
}

// Check if user is already registered
if (await IncentivlySDK.shared.isUserRegistered()) {
  const userID = await IncentivlySDK.shared.getUserIdentifier();
  console.log('User already registered with ID:', userID);
}
```

**Important**: User registration only happens once per device. Subsequent calls will return the stored user identifier without making API requests.

### 3. Update User Identifier

Update the user identifier both on the server and locally:

```typescript
// Update user identifier
try {
  const response = await IncentivlySDK.shared.updateUserIdentifier(
    'updated_user_identifier_12345'
  );
  
  if (response.success) {
    console.log('User identifier updated successfully!');
    console.log(`Updated ${response.registrationsUpdated} registration(s)`);
    console.log(`Updated ${response.paymentsUpdated} payment(s)`);
    console.log('Message:', response.message);
  }
} catch (error) {
  console.error('Failed to update user identifier:', error);
}
```

**Note**: Users must be registered before updating their identifier. The SDK will automatically use the current stored user identifier and developer key.

### 4. Payment Reporting

You must manually report payments after a successful purchase. The SDK provides separate methods for iOS and Android to send the correct platform-specific variables.

#### iOS Payment Reporting

For iOS, use `reportPaymentIOS` with the StoreKit transaction ID:

```typescript
try {
  const response = await IncentivlySDK.shared.reportPaymentIOS(
    'com.yourapp.product1',
    '2000000123456789' // iOS StoreKit transaction ID
  );
  
  if (response.success) {
    console.log('iOS payment reported successfully with ID:', response.paymentId);
    console.log('Message:', response.message);
  }
} catch (error) {
  console.error('Failed to report iOS payment:', error);
}
```

#### Android Payment Reporting

For Android, use `reportPaymentAndroid` with the Google Play purchase details:

```typescript
try {
  const response = await IncentivlySDK.shared.reportPaymentAndroid(
    'com.yourapp.product1',
    'purchase-token-string', // Android purchase token
    'com.yourapp.package', // Android package name
    'GPA.1234-5678-9012-34567' // Android order ID
  );
  
  if (response.success) {
    console.log('Android payment reported successfully with ID:', response.paymentId);
    console.log('Message:', response.message);
  }
} catch (error) {
  console.error('Failed to report Android payment:', error);
}
```


## API Integration

### User Registration Endpoint

The SDK sends POST requests to `https://incentivly.com/api/register-user` with the following JSON structure:

```json
{
  "devKey": "dk_1a2b3c4d5e_f6g7h8i9j0",
  "userIdentifier": "user_unique_id_123"
}
```

Expected response:

```json
{
  "success": true,
  "userIdentifier": "user_generated_or_provided_id",
  "influencerId": "influencer_user_id",
  "referralId": "ref_used_for_registration",
  "message": "User successfully registered to influencer"
}
```

### Update User Identifier Endpoint

The SDK sends POST requests to `https://incentivly.com/api/update-user-identifier` with the following JSON structure:

```json
{
  "currentUserIdentifier": "user_ccecb23e-83e1-4e4b-a8da-6864f1248e59",
  "newUserIdentifier": "updated_user_identifier_12345",
  "devKey": "dk_mdugwwgg_nhkc6lvqwgs"
}
```

Expected response:

```json
{
  "success": true,
  "message": "Successfully updated userIdentifier. Updated 1 registration(s) and 0 payment(s).",
  "registrationsUpdated": 1,
  "paymentsUpdated": 0
}
```

### Payment Reporting Endpoint

The SDK sends POST requests to `https://incentivly.com/api/report-payment` with platform-specific JSON structures:

#### iOS Payment Request

```json
{
  "userIdentifier": "user_unique_id_123",
  "productId": "com.yourapp.premium_subscription",
  "iosTransactionId": "2000000123456789",
  "devKey": "dk_1a2b3c4d5e_f6g7h8i9j0",
  "timestamp": "2023-12-06T10:30:00.000Z",
  "sdkVersion": "1.0.0",
  "platform": "ios",
  "platformVersion": "17.0"
}
```

#### Android Payment Request

```json
{
  "userIdentifier": "user_unique_id_123",
  "productId": "com.yourapp.premium_subscription",
  "androidPurchaseToken": "android-purchase-token-string",
  "androidPackageName": "com.yourapp.package",
  "androidOrderId": "GPA.1234-5678-9012-34567",
  "devKey": "dk_1a2b3c4d5e_f6g7h8i9j0",
  "timestamp": "2023-12-06T10:30:00.000Z",
  "sdkVersion": "1.0.0",
  "platform": "android",
  "platformVersion": "33"
}
```

#### Expected Response

```json
{
  "success": true,
  "message": "Payment successfully verified and processed",
  "paymentId": "payment_abc123def456"
}
```

## Error Handling

The SDK provides comprehensive error handling for API operations:

### Payment Errors

* `UserNotRegisteredError`: User must be registered before reporting payments
* `DevKeyNotFoundError`: Developer key not found. Please register user first.
* `InvalidTransactionIdError`: Invalid transaction ID provided.
* `TransactionAlreadyProcessedError`: This transaction has already been processed.

### User Errors

* `UserNotRegisteredError`: User must be registered before updating identifier
* `DevKeyNotFoundError`: Developer key not found. Please register user first.

### API Errors

* `APIError`: Server returned an error status code (includes `statusCode` property)
* `NetworkError`: Network request failed

Example error handling:

```typescript
import {
  UserNotRegisteredError,
  DevKeyNotFoundError,
  TransactionAlreadyProcessedError,
  APIError,
  NetworkError,
} from '@incentivly/react-native-sdk';

try {
  await IncentivlySDK.shared.reportPayment(productId, transactionId);
} catch (error) {
  if (error instanceof UserNotRegisteredError) {
    // Handle user not registered
  } else if (error instanceof TransactionAlreadyProcessedError) {
    // Transaction already processed, this is OK
  } else if (error instanceof APIError) {
    console.error('API error:', error.statusCode, error.message);
  } else if (error instanceof NetworkError) {
    console.error('Network error:', error.message);
  } else {
    console.error('Unknown error:', error);
  }
}
```

## Duplicate Prevention

The SDK automatically prevents duplicate transaction reporting by:

* Tracking processed transaction IDs in local storage
* Checking for duplicates before sending to the server
* Throwing a `TransactionAlreadyProcessedError` if a transaction has already been reported
* Persisting transaction data across app restarts (stores last 1000 transactions)

This ensures that even if your purchase callback fires multiple times for the same transaction, it will only be reported to the API once.

## Integration with Existing IAP Setup

The SDK is designed to work alongside your existing in-app purchase implementation. Simply call `reportPaymentIOS` or `reportPaymentAndroid` after a successful purchase to report transactions to the Incentivly API.

## TypeScript Support

The SDK is written in TypeScript and includes full type definitions:

```typescript
import IncentivlySDK, {
  RegisterUserResponse,
  UpdateUserIdentifierResponse,
  ReportPaymentResponse,
  UserNotRegisteredError,
} from '@incentivly/react-native-sdk';
```

## Testing

For testing purposes, you can clear all stored data:

```typescript
await IncentivlySDK.shared.clearAll();
```

This will:
* Clear user identifier
* Clear developer key
* Clear processed transaction IDs

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## About

The React Native SDK for connecting with the Incentivly revenue sharing platform.

