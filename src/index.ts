/**
 * Incentivly React Native SDK
 * 
 * A React Native SDK for revenue sharing that allows manual reporting
 * of transactions to the Incentivly API.
 */

// Main SDK class
export { IncentivlySDK } from './IncentivlySDK';

// Error types
export {
  IncentivlyError,
  UserNotRegisteredError,
  DevKeyNotFoundError,
  InvalidTransactionIdError,
  TransactionAlreadyProcessedError,
  APIError,
  NetworkError,
} from './Errors';

// Type definitions
export type {
  RegisterUserResponse,
  UpdateUserIdentifierResponse,
  ReportPaymentResponse,
  InitializeOptions,
} from './types';

// Default export for convenience
import { IncentivlySDK } from './IncentivlySDK';
export default IncentivlySDK;

