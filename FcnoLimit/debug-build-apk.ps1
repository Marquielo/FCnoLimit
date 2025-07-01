# FCnoLimit - Debug Mobile APK Builder (PowerShell)
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "     FCnoLimit - Debug APK Builder" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Verificar que estamos en el directorio correcto
if (-not (Test-Path "package.json")) {
    Write-Host "❌ Error: No se encuentra package.json" -ForegroundColor Red
    Write-Host "Asegurate de ejecutar este script desde la carpeta raiz del proyecto" -ForegroundColor Red
    Read-Host "Presiona Enter para continuar"
    exit 1
}

Write-Host "📋 Configuración de debug:" -ForegroundColor Yellow
Write-Host "- Modo: PRODUCTION" -ForegroundColor White
Write-Host "- Backend: https://fcnolimit-back.onrender.com" -ForegroundColor White
Write-Host "- Variables de entorno incluidas en el build" -ForegroundColor White
Write-Host ""

# Mostrar variables de entorno actuales
Write-Host "🔧 Variables de entorno actuales:" -ForegroundColor Yellow
if (Test-Path ".env") {
    Get-Content ".env" | Write-Host -ForegroundColor White
} else {
    Write-Host "❌ Archivo .env no encontrado" -ForegroundColor Red
}
Write-Host ""

# Verificar configuración de Capacitor
Write-Host "📱 Configuración de Capacitor:" -ForegroundColor Yellow
Write-Host "- Live reload: DESHABILITADO (para dispositivo físico)" -ForegroundColor White
Write-Host "- Archivos estáticos desde dist/" -ForegroundColor White
Write-Host ""

Read-Host "Presiona Enter para continuar con el build"

Write-Host "🧹 Limpiando build anterior..." -ForegroundColor Yellow
if (Test-Path "dist") { Remove-Item -Recurse -Force "dist" }
if (Test-Path "android\app\build") { Remove-Item -Recurse -Force "android\app\build" }

Write-Host "📦 Instalando dependencias..." -ForegroundColor Yellow
npm install

Write-Host "🏗️ Construyendo aplicación (modo producción)..." -ForegroundColor Yellow
npm run build

Write-Host "📱 Sincronizando con Capacitor..." -ForegroundColor Yellow
npx cap sync android

Write-Host "🔍 Copiando archivos de debug..." -ForegroundColor Yellow
# Crear archivo de debug con información del build
$debugInfo = @{
    buildTime = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    environment = "production"
    backend = "https://fcnolimit-back.onrender.com"
    buildType = "debug-apk"
    powershellVersion = $PSVersionTable.PSVersion.ToString()
} | ConvertTo-Json -Depth 3

$debugInfo | Out-File -FilePath "dist\debug-info.json" -Encoding utf8

Write-Host "⚙️ Abriendo Android Studio para build final..." -ForegroundColor Yellow
Write-Host ""
Write-Host "📌 PASOS SIGUIENTES EN ANDROID STUDIO:" -ForegroundColor Cyan
Write-Host "1. Esperar a que termine de cargar e indexar" -ForegroundColor White
Write-Host "2. Ir a Build > Build Bundle(s)/APK(s) > Build APK(s)" -ForegroundColor White
Write-Host "3. Esperar a que termine el build (aprox 2-5 min)" -ForegroundColor White
Write-Host "4. Instalar el APK en tu dispositivo" -ForegroundColor White
Write-Host "5. Abrir la app y ir a 'Debug Info (Dev)' desde la home" -ForegroundColor White
Write-Host "6. Revisar la URL que está usando la app" -ForegroundColor White
Write-Host ""

# Abrir Android Studio
npx cap open android

Write-Host ""
Write-Host "✅ Script completado. Android Studio debería abrirse automáticamente." -ForegroundColor Green
Write-Host ""
Write-Host "🔍 Para verificar la URL en tu celular:" -ForegroundColor Cyan
Write-Host "1. Instala el APK generado" -ForegroundColor White
Write-Host "2. Abre la app FCnoLimit" -ForegroundColor White
Write-Host "3. Toca el botón 'Debug Info (Dev)'" -ForegroundColor White
Write-Host "4. Revisa la sección 'Environment Variables' - VITE_API_URL" -ForegroundColor White
Write-Host "5. Toca 'Test Network Connection' para probar conectividad" -ForegroundColor White
Write-Host ""

Write-Host "🌐 URL del backend que debería aparecer:" -ForegroundColor Yellow
Write-Host "https://fcnolimit-back.onrender.com/api" -ForegroundColor Green
Write-Host ""

Read-Host "Presiona Enter para finalizar"
