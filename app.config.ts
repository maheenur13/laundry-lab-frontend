import { ExpoConfig, ConfigContext } from 'expo/config';

// Load environment variables
const API_URL_DEV = process.env.API_URL_DEV || 'http://10.140.143.213:3000/api/v1';
const API_URL_PROD = process.env.API_URL_PROD || 'https://laundry-lab-backend.onrender.com/api/v1';
const API_URL_ANDROID_EMU = process.env.API_URL_ANDROID_EMU || 'http://10.0.2.2:3000/api/v1';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'LaundryBD',
  slug: 'laundrybd',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'automatic',
  newArchEnabled: true,
  scheme: 'laundrybd',
  splash: {
    image: './assets/splash-icon.png',
    resizeMode: 'contain',
    backgroundColor: '#0D9488',
  },
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.laundrybd.app',
  },
  android: {
    package: 'com.laundrybd.app',
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#0D9488',
    },
    edgeToEdgeEnabled: true,
  },
  web: {
    favicon: './assets/favicon.png',
    bundler: 'metro',
  },
  plugins: ['expo-router', 'expo-secure-store'],
  experiments: {
    typedRoutes: true,
  },
  extra: {
    router: {
      origin: false,
    },
    eas: {
      projectId: 'd1a9516a-998e-4266-b2b8-a0c0f5c676e3',
    },
    // Environment variables accessible via Constants.expoConfig.extra
    apiUrlDev: API_URL_DEV,
    apiUrlProd: API_URL_PROD,
    apiUrlAndroidEmu: API_URL_ANDROID_EMU,
  },
});
