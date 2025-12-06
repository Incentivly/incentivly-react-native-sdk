import { Platform } from 'react-native';

/**
 * Collects device and app metadata for API requests
 */
export class MetadataCollector {
  private static sdkVersion = '1.0.0';

  /**
   * Get app version from expo-constants if available
   */
  private static getAppVersion(): string | undefined {
    try {
      // Try to import expo-constants dynamically
      const Constants = require('expo-constants');
      return Constants.expoConfig?.version || Constants.manifest?.version || undefined;
    } catch {
      return undefined;
    }
  }

  /**
   * Get platform version (OS version)
   */
  private static getPlatformVersion(): string {
    return Platform.Version.toString();
  }

  /**
   * Get device model if available
   */
  private static getDeviceModel(): string | undefined {
    try {
      // Try to get device model from expo-device if available
      const Device = require('expo-device');
      return Device.modelName || Device.deviceName || undefined;
    } catch {
      return undefined;
    }
  }

  /**
   * Collect all metadata for API requests
   */
  static collectMetadata(): Record<string, any> {
    const metadata: Record<string, any> = {
      sdkVersion: this.sdkVersion,
      platform: Platform.OS === 'ios' ? 'ios' : Platform.OS === 'android' ? 'android' : 'unknown',
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

