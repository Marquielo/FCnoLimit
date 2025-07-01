@echo off
title FCnoLimit - Debug Mobile APK Builder
echo.
echo ========================================
echo     FCnoLimit - Debug APK Builder
echo ========================================
echo.

REM Verificar que estamos en el directorio correcto
if not exist "package.json" (
    echo ❌ Error: No se encuentra package.json
    echo Asegurate de ejecutar este script desde la carpeta raiz del proyecto
    pause
    exit /b 1
)

echo 📋 Configuración de debug:
echo - Modo: PRODUCTION
echo - Backend: https://fcnolimit-back.onrender.com
echo - Variables de entorno incluidas en el build
echo.

REM Mostrar variables de entorno actuales
echo 🔧 Variables de entorno actuales:
type .env
echo.

REM Verificar configuración de Capacitor
echo 📱 Configuración de Capacitor:
echo - Live reload: DESHABILITADO (para dispositivo físico)
echo - Archivos estáticos desde dist/
echo.

pause

echo 🧹 Limpiando build anterior...
if exist "dist" rmdir /s /q dist
if exist "android\app\build" rmdir /s /q android\app\build

echo 📦 Instalando dependencias...
call npm install

echo 🏗️ Construyendo aplicación (modo producción)...
call npm run build

echo 📱 Sincronizando con Capacitor...
call npx cap sync android

echo 🔍 Copiando archivos de debug...
REM Crear archivo de debug con información del build
echo {> dist\debug-info.json
echo   "buildTime": "%date% %time%",>> dist\debug-info.json
echo   "environment": "production",>> dist\debug-info.json
echo   "backend": "https://fcnolimit-back.onrender.com",>> dist\debug-info.json
echo   "buildType": "debug-apk">> dist\debug-info.json
echo }>> dist\debug-info.json

echo ⚙️ Abriendo Android Studio para build final...
echo.
echo 📌 PASOS SIGUIENTES EN ANDROID STUDIO:
echo 1. Esperar a que termine de cargar e indexar
echo 2. Ir a Build ^> Build Bundle(s)/APK(s) ^> Build APK(s)
echo 3. Esperar a que termine el build (aprox 2-5 min)
echo 4. Instalar el APK en tu dispositivo
echo 5. Abrir la app y ir a "Debug Info (Dev)" desde la home
echo 6. Revisar la URL que está usando la app
echo.

REM Abrir Android Studio
call npx cap open android

echo.
echo ✅ Script completado. Android Studio debería abrirse automáticamente.
echo.
echo 🔍 Para verificar la URL en tu celular:
echo 1. Instala el APK generado
echo 2. Abre la app FCnoLimit
echo 3. Toca el botón "Debug Info (Dev)"
echo 4. Revisa la sección "Environment Variables" - VITE_API_URL
echo 5. Toca "Test Network Connection" para probar conectividad
echo.
pause
