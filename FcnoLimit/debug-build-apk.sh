#!/bin/bash
# FCnoLimit - Debug Mobile APK Builder (Bash)
echo "========================================"
echo "     FCnoLimit - Debug APK Builder"
echo "========================================"
echo ""

# Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    echo "❌ Error: No se encuentra package.json"
    echo "Asegurate de ejecutar este script desde la carpeta raiz del proyecto"
    read -p "Presiona Enter para continuar"
    exit 1
fi

echo "📋 Configuración de debug:"
echo "- Modo: PRODUCTION"
echo "- Backend: https://fcnolimit-back.onrender.com"
echo "- Variables de entorno incluidas en el build"
echo ""

# Mostrar variables de entorno actuales
echo "🔧 Variables de entorno actuales:"
if [ -f ".env" ]; then
    cat .env
else
    echo "❌ Archivo .env no encontrado"
fi
echo ""

# Verificar configuración de Capacitor
echo "📱 Configuración de Capacitor:"
echo "- Live reload: DESHABILITADO (para dispositivo físico)"
echo "- Archivos estáticos desde dist/"
echo ""

read -p "Presiona Enter para continuar con el build"

echo "🧹 Limpiando build anterior..."
rm -rf dist
rm -rf android/app/build

echo "📦 Instalando dependencias..."
npm install

echo "🏗️ Construyendo aplicación (modo producción)..."
npm run build

echo "📱 Sincronizando con Capacitor..."
npx cap sync android

echo "🔍 Copiando archivos de debug..."
# Crear archivo de debug con información del build
cat > dist/debug-info.json << EOF
{
  "buildTime": "$(date -Iseconds)",
  "environment": "production",
  "backend": "https://fcnolimit-back.onrender.com",
  "buildType": "debug-apk",
  "shellVersion": "bash $BASH_VERSION"
}
EOF

echo "⚙️ Abriendo Android Studio para build final..."
echo ""
echo "📌 PASOS SIGUIENTES EN ANDROID STUDIO:"
echo "1. Esperar a que termine de cargar e indexar"
echo "2. Ir a Build > Build Bundle(s)/APK(s) > Build APK(s)"
echo "3. Esperar a que termine el build (aprox 2-5 min)"
echo "4. Instalar el APK en tu dispositivo"
echo "5. Abrir la app y ir a 'Debug Info (Dev)' desde la home"
echo "6. Revisar la URL que está usando la app"
echo ""

# Abrir Android Studio
npx cap open android

echo ""
echo "✅ Script completado. Android Studio debería abrirse automáticamente."
echo ""
echo "🔍 Para verificar la URL en tu celular:"
echo "1. Instala el APK generado"
echo "2. Abre la app FCnoLimit"
echo "3. Toca el botón 'Debug Info (Dev)'"
echo "4. Revisa la sección 'Environment Variables' - VITE_API_URL"
echo "5. Toca 'Test Network Connection' para probar conectividad"
echo ""

echo "🌐 URL del backend que debería aparecer:"
echo "https://fcnolimit-back.onrender.com/api"
echo ""

read -p "Presiona Enter para finalizar"
