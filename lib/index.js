"use strict";
/**
 * Incentivly React Native SDK
 *
 * A React Native SDK for revenue sharing that allows manual reporting
 * of transactions to the Incentivly API.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.NetworkError = exports.APIError = exports.TransactionAlreadyProcessedError = exports.InvalidTransactionIdError = exports.DevKeyNotFoundError = exports.UserNotRegisteredError = exports.IncentivlyError = exports.IncentivlySDK = void 0;
// Main SDK class
var IncentivlySDK_1 = require("./IncentivlySDK");
Object.defineProperty(exports, "IncentivlySDK", { enumerable: true, get: function () { return IncentivlySDK_1.IncentivlySDK; } });
// Error types
var Errors_1 = require("./Errors");
Object.defineProperty(exports, "IncentivlyError", { enumerable: true, get: function () { return Errors_1.IncentivlyError; } });
Object.defineProperty(exports, "UserNotRegisteredError", { enumerable: true, get: function () { return Errors_1.UserNotRegisteredError; } });
Object.defineProperty(exports, "DevKeyNotFoundError", { enumerable: true, get: function () { return Errors_1.DevKeyNotFoundError; } });
Object.defineProperty(exports, "InvalidTransactionIdError", { enumerable: true, get: function () { return Errors_1.InvalidTransactionIdError; } });
Object.defineProperty(exports, "TransactionAlreadyProcessedError", { enumerable: true, get: function () { return Errors_1.TransactionAlreadyProcessedError; } });
Object.defineProperty(exports, "APIError", { enumerable: true, get: function () { return Errors_1.APIError; } });
Object.defineProperty(exports, "NetworkError", { enumerable: true, get: function () { return Errors_1.NetworkError; } });
// Default export for convenience
const IncentivlySDK_2 = require("./IncentivlySDK");
exports.default = IncentivlySDK_2.IncentivlySDK;
