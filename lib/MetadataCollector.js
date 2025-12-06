"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetadataCollector = void 0;
const react_native_1 = require("react-native");
/**
 * Collects device and app metadata for API requests
 */
class MetadataCollector {
    /**
     * Get app version from expo-constants if available
     */
    static getAppVersion() {
        try {
            // Try to import expo-constants dynamically
            const Constants = require('expo-constants');
            return Constants.expoConfig?.version || Constants.manifest?.version || undefined;
        }
        catch {
            return undefined;
        }
    }
    /**
     * Get platform version (OS version)
     */
    static getPlatformVersion() {
        return react_native_1.Platform.Version.toString();
    }
    /**
     * Get device model if available
     */
    static getDeviceModel() {
        try {
            // Try to get device model from expo-device if available
            const Device = require('expo-device');
            return Device.modelName || Device.deviceName || undefined;
        }
        catch {
            return undefined;
        }
    }
    /**
     * Collect all metadata for API requests
     */
    static collectMetadata() {
        const metadata = {
            sdkVersion: this.sdkVersion,
            platform: react_native_1.Platform.OS === 'ios' ? 'ios' : react_native_1.Platform.OS === 'android' ? 'android' : 'unknown',
            platformVersion: this.getPlatformVersion(),
        };
        const appVersion = this.getAppVersion();
        if (appVersion) {
            metadata.appVersion = appVersion;
        }
        const deviceModel = this.getDeviceModel();
        if (deviceModel) {
            metadata.deviceModel = deviceModel;
        }
        return metadata;
    }
}
exports.MetadataCollector = MetadataCollector;
MetadataCollector.sdkVersion = '1.0.0';
