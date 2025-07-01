import React, { useState, useEffect } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonItem,
  IonLabel,
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonTextarea,
  IonList,
  IonIcon,
  IonBadge
} from '@ionic/react';
import { bug, checkmark, close, refresh } from 'ionicons/icons';

interface TestResult {
  name: string;
  url: string;
  status: number | null;
  success: boolean;
  headers?: Record<string, string>;
  error?: string | null;
  data?: any;
}

interface NetworkTestResults {
  apiUrl: string;
  timestamp: string;
  tests: TestResult[];
  error?: string;
}

const DebugPage: React.FC = () => {
  const [debugInfo, setDebugInfo] = useState<any>({});
  const [networkTest, setNetworkTest] = useState<NetworkTestResults | null>(null);
  const [isTestingNetwork, setIsTestingNetwork] = useState(false);

  useEffect(() => {
    collectDebugInfo();
  }, []);

  const collectDebugInfo = () => {
    const info = {
      // Variables de entorno
      env: {
        VITE_API_URL: import.meta.env.VITE_API_URL,
        MODE: import.meta.env.MODE,
        DEV: import.meta.env.DEV,
        PROD: import.meta.env.PROD,
        BASE_URL: import.meta.env.BASE_URL,
        all_vars: import.meta.env
      },
      // Información del navegador/dispositivo
      browser: {
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        language: navigator.language,
        cookieEnabled: navigator.cookieEnabled,
        onLine: navigator.onLine
      },
      // Información de la aplicación
      app: {
        hostname: window.location.hostname,
        origin: window.location.origin,
        protocol: window.location.protocol,
        port: window.location.port,
        href: window.location.href
      },
      // LocalStorage
      localStorage: {
        keys: Object.keys(localStorage),
        usuario: localStorage.getItem('usuario'),
        accessToken: localStorage.getItem('accessToken') ? '***EXISTS***' : null,
        refreshToken: localStorage.getItem('refreshToken') ? '***EXISTS***' : null,
        token: localStorage.getItem('token') ? '***EXISTS***' : null
      }
    };

    setDebugInfo(info);
  };

  const testNetworkConnection = async () => {
    setIsTestingNetwork(true);
    const apiUrl = import.meta.env.VITE_API_URL || 'https://fcnolimit-back.onrender.com/api';
    
    try {
      console.log('🧪 Testing network connection to:', apiUrl);
      
      const testResults: NetworkTestResults = {
        apiUrl,
        timestamp: new Date().toISOString(),
        tests: []
      };

      // Test 1: Mobile debug endpoint
      try {
        const debugResponse = await fetch(`${apiUrl}/mobile-debug`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        const debugData = debugResponse.ok ? await debugResponse.json() : null;
        
        testResults.tests.push({
          name: 'Mobile Debug Endpoint',
          url: `${apiUrl}/mobile-debug`,
          status: debugResponse.status,
          success: debugResponse.ok,
          headers: Object.fromEntries(debugResponse.headers.entries()),
          error: null,
          data: debugData
        });
      } catch (error) {
        testResults.tests.push({
          name: 'Mobile Debug Endpoint',
          url: `${apiUrl}/mobile-debug`,
          status: null,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }

      // Test 2: CORS preflight
      try {
        const corsResponse = await fetch(`${apiUrl}/usuarios/test`, {
          method: 'OPTIONS',
          headers: {
            'Origin': window.location.origin,
            'Access-Control-Request-Method': 'POST',
            'Access-Control-Request-Headers': 'Content-Type'
          }
        });
        
        testResults.tests.push({
          name: 'CORS Preflight',
          url: `${apiUrl}/usuarios/test`,
          status: corsResponse.status,
          success: corsResponse.ok,
          headers: Object.fromEntries(corsResponse.headers.entries()),
          error: null
        });
      } catch (error) {
        testResults.tests.push({
          name: 'CORS Preflight',
          url: `${apiUrl}/usuarios/test`,
          status: null,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }

      // Test 3: Login endpoint availability
      try {
        const loginResponse = await fetch(`${apiUrl}/usuarios/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ correo: 'test@test.com', contraseña: 'invalid' })
        });
        
        testResults.tests.push({
          name: 'Login Endpoint',
          url: `${apiUrl}/usuarios/login`,
          status: loginResponse.status,
          success: loginResponse.status !== 0, // Cualquier respuesta del servidor es buena
          headers: Object.fromEntries(loginResponse.headers.entries()),
          error: null
        });
      } catch (error) {
        testResults.tests.push({
          name: 'Login Endpoint',
          url: `${apiUrl}/usuarios/login`,
          status: null,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }

      setNetworkTest(testResults);
      console.log('🧪 Network test results:', testResults);
      
    } catch (error) {
      console.error('❌ Error testing network:', error);
      const errorResult: NetworkTestResults = {
        apiUrl,
        timestamp: new Date().toISOString(),
        tests: [],
        error: error instanceof Error ? error.message : 'Unknown error'
      };
      setNetworkTest(errorResult);
    } finally {
      setIsTestingNetwork(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      console.log('📋 Copied to clipboard');
    }).catch(() => {
      console.log('❌ Failed to copy to clipboard');
    });
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>
            <IonIcon icon={bug} slot="start" />
            Debug Info
          </IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>🔧 Environment Variables</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonList>
              <IonItem>
                <IonLabel>
                  <h3>VITE_API_URL</h3>
                  <p>{debugInfo.env?.VITE_API_URL || 'NOT SET'}</p>
                </IonLabel>
                <IonBadge color={debugInfo.env?.VITE_API_URL ? 'success' : 'danger'}>
                  {debugInfo.env?.VITE_API_URL ? 'SET' : 'MISSING'}
                </IonBadge>
              </IonItem>
              <IonItem>
                <IonLabel>
                  <h3>MODE</h3>
                  <p>{debugInfo.env?.MODE}</p>
                </IonLabel>
              </IonItem>
              <IonItem>
                <IonLabel>
                  <h3>PROD</h3>
                  <p>{debugInfo.env?.PROD ? 'Yes' : 'No'}</p>
                </IonLabel>
              </IonItem>
            </IonList>
          </IonCardContent>
        </IonCard>

        <IonCard>
          <IonCardHeader>
            <IonCardTitle>📱 App Info</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonList>
              <IonItem>
                <IonLabel>
                  <h3>Origin</h3>
                  <p>{debugInfo.app?.origin}</p>
                </IonLabel>
              </IonItem>
              <IonItem>
                <IonLabel>
                  <h3>Hostname</h3>
                  <p>{debugInfo.app?.hostname}</p>
                </IonLabel>
              </IonItem>
              <IonItem>
                <IonLabel>
                  <h3>Protocol</h3>
                  <p>{debugInfo.app?.protocol}</p>
                </IonLabel>
              </IonItem>
              <IonItem>
                <IonLabel>
                  <h3>Full URL</h3>
                  <p style={{ fontSize: '12px', wordBreak: 'break-all' }}>
                    {debugInfo.app?.href}
                  </p>
                </IonLabel>
              </IonItem>
            </IonList>
          </IonCardContent>
        </IonCard>

        <IonCard>
          <IonCardHeader>
            <IonCardTitle>🌐 Network Test</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonButton 
              expand="block" 
              onClick={testNetworkConnection}
              disabled={isTestingNetwork}
            >
              <IonIcon icon={refresh} slot="start" />
              {isTestingNetwork ? 'Testing...' : 'Test Network Connection'}
            </IonButton>
            
            {networkTest && (
              <div style={{ marginTop: '16px' }}>
                <p><strong>API URL:</strong> {networkTest.apiUrl}</p>
                <p><strong>Timestamp:</strong> {networkTest.timestamp}</p>
                
                {networkTest.tests && networkTest.tests.map((test: TestResult, index: number) => (
                  <IonItem key={index}>
                    <IonIcon 
                      icon={test.success ? checkmark : close} 
                      color={test.success ? 'success' : 'danger'}
                      slot="start" 
                    />
                    <IonLabel>
                      <h3>{test.name}</h3>
                      <p>Status: {test.status || 'Failed'}</p>
                      {test.error && <p style={{ color: 'red' }}>Error: {test.error}</p>}
                      {test.data && (
                        <div style={{ marginTop: '8px' }}>
                          <h4>Response Data:</h4>
                          <pre style={{ fontSize: '10px', overflow: 'auto', maxHeight: '100px' }}>
                            {JSON.stringify(test.data, null, 2)}
                          </pre>
                        </div>
                      )}
                    </IonLabel>
                  </IonItem>
                ))}
              </div>
            )}
          </IonCardContent>
        </IonCard>

        <IonCard>
          <IonCardHeader>
            <IonCardTitle>📄 Raw Debug Data</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonTextarea
              value={JSON.stringify(debugInfo, null, 2)}
              rows={10}
              readonly
              style={{ fontSize: '10px' }}
            />
            <IonButton 
              fill="outline" 
              size="small"
              onClick={() => copyToClipboard(JSON.stringify(debugInfo, null, 2))}
            >
              Copy to Clipboard
            </IonButton>
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default DebugPage;
