@echo off
echo 🚀 FCnoLimit Mobile - Live Reload Setup
echo.

REM Usar tu IP de Wi-Fi detectada
set LOCAL_IP=192.168.1.204

echo 📱 Usando IP: %LOCAL_IP%
echo 🔧 Asegúrate de que tu dispositivo esté en la misma red Wi-Fi
echo.

echo 🏗️ Construyendo aplicación...
call ionic build

echo 📱 Iniciando live reload en Android...
echo ⚡ Los cambios se verán automáticamente en tu dispositivo
call ionic cap run android --livereload --external --host=%LOCAL_IP%

echo.
echo ✅ ¡Live reload configurado!
echo 🔄 Ahora cada cambio que hagas se verá en tiempo real en tu teléfono
pause
