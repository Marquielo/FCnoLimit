import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.fcnolimit.mobile',
  appName: 'FCnoLimit',
  webDir: 'dist',
  // Comentamos el servidor local para usar la app estática
  // server: {
  //   androidScheme: 'https',
  //   url: 'http://192.168.1.204:8100',
  //   cleartext: true
  // },
  android: {
    allowMixedContent: true,
    captureInput: true
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
