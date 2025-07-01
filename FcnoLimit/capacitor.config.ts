import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.fcnolimit.mobile',
  appName: 'FCnoLimit',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    // Para live reload - tu IP de Wi-Fi
    url: 'http://192.168.1.204:8100',
    cleartext: true
  },
  plugins: {
    StatusBar: {
      style: 'DARK'
    },
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#1976d2',
      androidScaleType: 'CENTER_CROP',
      showSpinner: false
    }
  }
};

export default config;
