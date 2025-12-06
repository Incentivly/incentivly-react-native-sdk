/**
 * Base error class for all Incentivly SDK errors
 */
export class IncentivlyError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'IncentivlyError';
    Object.setPrototypeOf(this, IncentivlyError.prototype);
  }
}

/**
 * Error thrown when user is not registered
 */
export class UserNotRegisteredError extends IncentivlyError {
  constructor(message: string = 'User must be registered before performing this operation') {
    super(message);
    this.name = 'UserNotRegisteredError';
    Object.setPrototypeOf(this, UserNotRegisteredError.prototype);
  }
}

/**
 * Error thrown when developer key is not found
 */
export class DevKeyNotFoundError extends IncentivlyError {
  constructor(message: string = 'Developer key not found. Please register user first.') {
    super(message);
    this.name = 'DevKeyNotFoundError';
    Object.setPrototypeOf(this, DevKeyNotFoundError.prototype);
  }
}

/**
 * Error thrown when transaction ID is invalid
 */
export class InvalidTransactionIdError extends IncentivlyError {
  constructor(message: string = 'Invalid transaction ID provided.') {
    super(message);
    this.name = 'InvalidTransactionIdError';
    Object.setPrototypeOf(this, InvalidTransactionIdError.prototype);
  }
}

/**
 * Error thrown when transaction has already been processed
 */
export class TransactionAlreadyProcessedError extends IncentivlyError {
  constructor(message: string = 'This transaction has already been processed.') {
    super(message);
    this.name = 'TransactionAlreadyProcessedError';
    Object.setPrototypeOf(this, TransactionAlreadyProcessedError.prototype);
  }
}

/**
 * Error thrown for API-related issues
 */
export class APIError extends IncentivlyError {
  public statusCode: number;

  constructor(statusCode: number, message: string = 'API request failed') {
    super(message);
    this.name = 'APIError';
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, APIError.prototype);
  }
}

/**
 * Error thrown for network-related issues
 */
export class NetworkError extends IncentivlyError {
  constructor(message: string = 'Network request failed') {
    super(message);
    this.name = 'NetworkError';
    Object.setPrototypeOf(this, NetworkError.prototype);
  }
}

