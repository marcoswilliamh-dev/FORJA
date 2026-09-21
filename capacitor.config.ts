import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.forja.app',
  appName: 'FORJA',
  webDir: 'dist',
  bundledWebRuntime: false,
  android: { backgroundColor: '#080808' }
};
export default config;