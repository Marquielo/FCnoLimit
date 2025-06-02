# FCNO LIMIT

## Descripción del Proyecto
FCNO LIMIT es una aplicación web diseñada para gestionar perfiles de jugadores de fútbol. La aplicación permite visualizar información detallada sobre cada jugador, incluyendo estadísticas, datos personales y su estado actual en el equipo.

## Estructura del Proyecto
El proyecto está organizado de la siguiente manera:

```
FcnoLimit
├── src
│   └── pages
│       └── admin
│           └── jugador
│               └── perfil
│                   ├── JugadorPerfil.tsx
│                   └── JugadorPerfil.css
└── README.md
```

- **JugadorPerfil.tsx**: Componente funcional de React que maneja los datos del perfil del jugador. Se encarga de obtener el perfil desde el almacenamiento local, calcular la edad del jugador y gestionar el cierre de sesión del usuario. Utiliza componentes de Ionic para la interfaz de usuario y muestra estadísticas y detalles del jugador.
  
- **JugadorPerfil.css**: Archivo de estilos CSS para el componente JugadorPerfil. Define estilos para varios elementos, incluyendo diseño, colores, tipografía y diseño responsivo para asegurar que la tarjeta de perfil y su contenido sean visualmente atractivos y se adapten a diferentes tamaños de pantalla.

## Instrucciones de Configuración
1. Clona el repositorio:
   ```
   git clone <URL_DEL_REPOSITORIO>
   ```
2. Navega al directorio del proyecto:
   ```
   cd FcnoLimit
   ```
3. Instala las dependencias:
   ```
   npm install
   ```
4. Inicia la aplicación:
   ```
   npm start
   ```

## Uso
Una vez que la aplicación esté en funcionamiento, podrás acceder a la sección de administración donde podrás ver y gestionar los perfiles de los jugadores. La interfaz es intuitiva y permite una fácil navegación entre los diferentes perfiles.

## Contribuciones
Las contribuciones son bienvenidas. Si deseas contribuir, por favor abre un issue o envía un pull request con tus cambios.

## Licencia
Este proyecto está bajo la Licencia MIT.