"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NetworkError = exports.APIError = exports.TransactionAlreadyProcessedError = exports.InvalidTransactionIdError = exports.DevKeyNotFoundError = exports.UserNotRegisteredError = exports.IncentivlyError = void 0;
/**
 * Base error class for all Incentivly SDK errors
 */
class IncentivlyError extends Error {
    constructor(message) {
        super(message);
        this.name = 'IncentivlyError';
        Object.setPrototypeOf(this, IncentivlyError.prototype);
    }
}
exports.IncentivlyError = IncentivlyError;
/**
 * Error thrown when user is not registered
 */
class UserNotRegisteredError extends IncentivlyError {
    constructor(message = 'User must be registered before performing this operation') {
        super(message);
        this.name = 'UserNotRegisteredError';
        Object.setPrototypeOf(this, UserNotRegisteredError.prototype);
    }
}
exports.UserNotRegisteredError = UserNotRegisteredError;
/**
 * Error thrown when developer key is not found
 */
class DevKeyNotFoundError extends IncentivlyError {
    constructor(message = 'Developer key not found. Please register user first.') {
        super(message);
        this.name = 'DevKeyNotFoundError';
        Object.setPrototypeOf(this, DevKeyNotFoundError.prototype);
    }
}
exports.DevKeyNotFoundError = DevKeyNotFoundError;
/**
 * Error thrown when transaction ID is invalid
 */
class InvalidTransactionIdError extends IncentivlyError {
    constructor(message = 'Invalid transaction ID provided.') {
        super(message);
        this.name = 'InvalidTransactionIdError';
        Object.setPrototypeOf(this, InvalidTransactionIdError.prototype);
    }
}
exports.InvalidTransactionIdError = InvalidTransactionIdError;
/**
 * Error thrown when transaction has already been processed
 */
class TransactionAlreadyProcessedError extends IncentivlyError {
    constructor(message = 'This transaction has already been processed.') {
        super(message);
        this.name = 'TransactionAlreadyProcessedError';
        Object.setPrototypeOf(this, TransactionAlreadyProcessedError.prototype);
    }
}
exports.TransactionAlreadyProcessedError = TransactionAlreadyProcessedError;
/**
 * Error thrown for API-related issues
 */
class APIError extends IncentivlyError {
    constructor(statusCode, message = 'API request failed') {
        super(message);
        this.name = 'APIError';
        this.statusCode = statusCode;
        Object.setPrototypeOf(this, APIError.prototype);
    }
}
exports.APIError = APIError;
/**
 * Error thrown for network-related issues
 */
class NetworkError extends IncentivlyError {
    constructor(message = 'Network request failed') {
        super(message);
        this.name = 'NetworkError';
        Object.setPrototypeOf(this, NetworkError.prototype);
    }
}
exports.NetworkError = NetworkError;
