/**
 * Collects device and app metadata for API requests
 */
export declare class MetadataCollector {
    private static sdkVersion;
    /**
     * Get app version from expo-constants if available
     */
    private static getAppVersion;
    /**
     * Get platform version (OS version)
     */
    private static getPlatformVersion;
    /**
     * Get device model if available
     */
    private static getDeviceModel;
    /**
     * Collect all metadata for API requests
     */
    static collectMetadata(): Record<string, any>;
}
