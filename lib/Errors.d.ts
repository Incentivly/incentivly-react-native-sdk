/**
 * Base error class for all Incentivly SDK errors
 */
export declare class IncentivlyError extends Error {
    constructor(message: string);
}
/**
 * Error thrown when user is not registered
 */
export declare class UserNotRegisteredError extends IncentivlyError {
    constructor(message?: string);
}
/**
 * Error thrown when developer key is not found
 */
export declare class DevKeyNotFoundError extends IncentivlyError {
    constructor(message?: string);
}
/**
 * Error thrown when transaction ID is invalid
 */
export declare class InvalidTransactionIdError extends IncentivlyError {
    constructor(message?: string);
}
/**
 * Error thrown when transaction has already been processed
 */
export declare class TransactionAlreadyProcessedError extends IncentivlyError {
    constructor(message?: string);
}
/**
 * Error thrown for API-related issues
 */
export declare class APIError extends IncentivlyError {
    statusCode: number;
    constructor(statusCode: number, message?: string);
}
/**
 * Error thrown for network-related issues
 */
export declare class NetworkError extends IncentivlyError {
    constructor(message?: string);
}
