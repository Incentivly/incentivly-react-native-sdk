/**
 * Incentivly React Native SDK
 *
 * A React Native SDK for revenue sharing that allows manual reporting
 * of transactions to the Incentivly API.
 */
export { IncentivlySDK } from './IncentivlySDK';
export { IncentivlyError, UserNotRegisteredError, DevKeyNotFoundError, InvalidTransactionIdError, TransactionAlreadyProcessedError, APIError, NetworkError, } from './Errors';
export type { RegisterUserResponse, UpdateUserIdentifierResponse, ReportPaymentResponse, InitializeOptions, } from './types';
import { IncentivlySDK } from './IncentivlySDK';
export default IncentivlySDK;
