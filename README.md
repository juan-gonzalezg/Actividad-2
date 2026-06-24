# Portal Multiverso — Rick & Morty Streaming System

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/es/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/es/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/es/docs/Web/JavaScript)
[![API](https://img.shields.io/badge/API-Rick_&_Morty-11b7cd?style=for-the-badge)](https://rickandmortyapi.com/)

Este repositorio contiene la entrega de la **Actividad #2** para la asignatura **Programación Orientada a la Web** (Universidad Católica Andrés Bello). Consiste en una aplicación web interactiva tipo SPA (Single Page Application) que consume la API de Rick and Morty. El sistema está construido enteramente utilizando tecnologías nativas y puras, implementando capacidades resilientes sin conexión (offline mode), tematización dual, y una interfaz de usuario fluida con diseño adaptativo.

## 🚀 Demo en Vivo

Puedes ver el proyecto desplegado en línea a través de GitHub Pages aquí:
[https://juan-gonzalezg.github.io/Actividad-2/](https://juan-gonzalezg.github.io/Actividad-2/)

---

## 🔑 Credenciales de Prueba

Para facilitar la evaluación y revisión del sistema de autenticación, el sistema pre-carga automáticamente las siguientes credenciales en el almacenamiento local al iniciar la aplicación:

- **Rick Sanchez (Administrador):**
  - **Correo:** `admin@ucab.com`
  - **Contraseña:** `password123`
- **Morty Smith:**
  - **Correo:** `morty@smith.com`
  - **Contraseña:** `password123`

_Nota: También es posible crear nuevas cuentas en tiempo real a través del formulario de Registro de la aplicación._

---

## 🚀 Características del Proyecto

### 1. Módulo de Autenticación

Gestiona el acceso seguro y persistencia de sesión a nivel de cliente:

- **Inicio de Sesión (Login):** Validación interactiva de formato de correo y contraseña contra usuarios guardados.
- **Registro de Usuarios:** Creación de cuentas validando nombres de usuario (mínimo 3 caracteres), coincidencia de contraseñas y unicidad de correo.
- **Recuperación de Contraseña:** Flujo que simula el envío de coordenadas de reinicio y restablecimiento.
- **Seguridad en Perfil:** Posibilidad de cambiar la contraseña actual del usuario activo validando credenciales antiguas.
- **Cierre de Sesión (Logout):** Limpieza segura de datos de sesión activa en memoria y redirección automática.

### 2. Gestión de Personajes

Pantalla de exploración del catálogo de personajes principales:

- **Visualización en Grilla:** Presentación visual con tarjetas adaptativas que muestran la imagen, ID, nombre, especie y estado (con colores condicionales).
- **Personaje del Día (Spotlight):** Selección aleatoria de un personaje en cada carga de catálogo para destacar información de manera estelar.
- **Buscador Funcional:** Barra de búsqueda en tiempo real que filtra por nombre de personaje a medida que el usuario escribe.
- **Filtros Multicriterio:** Combinación interactiva de búsquedas por Estado (_Alive_, _Dead_, _Unknown_) y Género (_Female_, _Male_, _Genderless_, _Unknown_).
- **Ordenamiento Dinámico:** Capacidad de ordenar la grilla de forma ascendente y descendente por ID, Nombre, Especie o Género.
- **Ficha Técnica Detallada (Drawer):** Panel lateral deslizante que renderiza información adicional (ubicación actual, origen y episodios en los que aparece).
- **Edición Local:** Formulario integrado que permite modificar los datos del personaje consultado y guardar los cambios. Los cambios persisten localmente incluso offline.

### 3. Gestión de Episodios

Sección para administrar los episodios de la serie:

- **Visualización en Tabla Semántica:** Listado estructurado con columnas para ID, Nombre, Fecha de Emisión y Código de Episodio.
- **Buscador Funcional:** Filtrado en tiempo real de episodios por nombre.
- **Ordenamiento Flexible:** Capacidad de reordenar de forma ascendente y descendente por cualquiera de las columnas de la tabla.
- **Ficha Técnica Detallada:** Drawer lateral con la información del episodio y un desglose del reparto de personajes presentes en él.
- **Edición Local:** Edición directa y guardado persistente de campos de episodio (Nombre, Fecha de Emisión y Código).

### 4. Perfil de Usuario

- Panel privado que muestra el avatar inicializado, nombre de usuario y correo de la sesión activa.
- Formulario dedicado a la actualización de la contraseña con validación de seguridad.
- Cierre de sesión local.

---

## 🌐 Resiliencia y Modo Offline

La aplicación está diseñada bajo el principio de resiliencia ante cortes de red:

1. **Detección de Conexión en Tiempo Real:** Mediante escuchadores del ciclo de vida de la ventana (`online`/`offline`), la aplicación detecta el estado del navegador actualizando un indicador visual en el header.
2. **Estrategia de Caché Local:**
   - Si el usuario está **Online**, la aplicación descarga datos de la API pública de Rick and Morty (páginas 1 y 2 de personajes, y página 1 de episodios) y los almacena en `localStorage`.
   - Si el usuario está **Offline** o la conexión con la API falla, el sistema realiza un _graceful fallback_ cargando el catálogo desde la caché local o desde un catálogo estático de respaldo.
3. **Persistencia de Ediciones:** Las modificaciones hechas a personajes o episodios se guardan en variables de cambio local (`ram_custom_characters` y `ram_custom_episodes`). Al refrescar la página, el motor del cliente fusiona automáticamente los datos base (API o Caché) con las modificaciones del usuario.
4. **Notificaciones Dinámicas:** Un banner persistente se despliega al perder conexión y un sistema de Toasts (notificaciones flotantes automáticas) avisa del estado de sincronización y red.

---

## 🎨 Diseño Visual y Experiencia de Usuario (UX/UI)

El diseño visual adopta una estética moderna e híbrida que evoca a las plataformas de streaming de ciencia ficción:

- **Theming Dual Dinámico:** Soporte completo para Modo Claro (Light) y Modo Oscuro (Dark). El cambio de tema se propaga mediante variables CSS globales y guarda la preferencia del usuario.
- **Glassmorphism (Efecto de Cristal):** Aplicado en el header de navegación, el banner destacado, paneles de filtros y drawers mediante propiedades avanzadas de CSS como `backdrop-filter: blur(12px)`.
- **Neumorphism (Efecto Tridimensional):** Reservado para elementos con los que el usuario interactúa físicamente como tarjetas de login/registro, botones de acción y campos de entrada para darles una sensación táctil de relieve.
- **Tipografía Premium:** Uso de la fuente sans-serif _Outfit_ para una legibilidad premium y la fuente monoespaciada _Space Grotesk_ para dar un toque futurista.
- **Interacciones & Micro-animaciones:** Transiciones suaves de color al cambiar de tema, efectos de hover que elevan ligeramente los elementos interactivos con destellos de color de acento y animaciones de entrada fluidas (_fade-in_ y _slide-up_).

---

## 📁 Estructura del Proyecto

El código está organizado de la siguiente manera:

- [index.html](file:///c:/Users/cpustorevzla/Documents/Mar-Jul_25-26/Programacion-Orientada-a-la-Web/Actividad-2/index.html): Documento HTML principal con el marcado semántico estructurado de la aplicación.
- [styles.css](file:///c:/Users/cpustorevzla/Documents/Mar-Jul_25-26/Programacion-Orientada-a-la-Web/Actividad-2/styles.css): Hoja de estilos que aloja el sistema de variables de diseño (tokens), animaciones CSS y layouts responsivos de grid y tabla.
- [app.js](file:///c:/Users/cpustorevzla/Documents/Mar-Jul_25-26/Programacion-Orientada-a-la-Web/Actividad-2/app.js): Núcleo lógico del frontend. Controla el enrutamiento interno de la SPA, simulación de usuarios, llamadas asíncronas a la API de Rick and Morty, ordenación, filtrado y lógica de almacenamiento local.

---

---

## 🛠️ Ejecución Local

Para visualizar y probar este proyecto en tu entorno local:

1. **Obtener los archivos:**
   Clona el repositorio o descarga el directorio del proyecto asegurándote de tener en una misma carpeta los tres archivos principales: `index.html`, `styles.css` y `app.js`.
2. **Despliegue y visualización:**
   Al tratarse de una aplicación web estática pura (Vanilla JS), simplemente puedes hacer doble clic en el archivo **`index.html`** para abrirlo y ejecutarlo de forma nativa en tu navegador web predeterminado (Google Chrome, Brave, Edge, etc.).

   **Nota:** Dado que la aplicación realiza peticiones asíncronas (`fetch`) a la API pública de Rick and Morty para cargar el catálogo inicial, es posible que tu navegador restrinja la carga por políticas de seguridad de origen cruzado (CORS) al abrirlo directamente como archivo local. Si esto ocurre, se recomienda abrir el proyecto utilizando la extensión **Live Server** de Visual Studio Code o Cursor (haciendo clic derecho sobre `index.html` y seleccionando **"Open with Live Server"**), lo cual levantará un entorno local seguro automáticamente.
