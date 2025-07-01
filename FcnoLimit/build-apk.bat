@echo off
echo 🏗️ FCnoLimit Mobile - Generar APK
echo.

echo 🔧 Construyendo aplicación...
call ionic build

echo 📱 Sincronizando con Android...
call ionic cap sync android

echo 🚀 Abriendo Android Studio para generar APK...
call ionic cap open android

echo.
echo ✅ Proceso completado!
echo 📋 En Android Studio:
echo    1. Build → Generate Signed Bundle / APK
echo    2. Selecciona APK
echo    3. Configura tu certificado
echo    4. ¡Genera tu APK!

pause
