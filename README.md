# Proyecto de Gestion de pedidos (salesApp)

Este proyecto es una aplicación web desarrollada con ReactJS que permite a los usuarios crear una cuenta o iniciar sesión con Google para gestionar sus pedidos. La aplicación hace uso de Firebase para autenticación y almacenamiento de datos, junto con otras bibliotecas esenciales para su funcionamiento.

## Tecnologías y Paquetes Utilizados

- **ReactJS** - Biblioteca de JavaScript para crear interfaces de usuario.
- **Firebase** - Plataforma de Google para autenticación y base de datos en tiempo real.
- **React Router Dom** - Para gestionar la navegación y el enrutamiento entre componentes.
- **React Hook Form** - Para manejar formularios y validación de datos de forma sencilla.

## Instalación

Sigue estos pasos para instalar y ejecutar la aplicación en tu entorno local:

### 1. Clonar el Repositorio

```bash
git clone https://github.com/tu-usuario/nombre-del-repositorio.git
cd nombre-del-repositorio


npm install

firebase
react-router-dom
react-hook-form


``` 

### 2. Configuración de Firebase
1. Crea un proyecto en Firebase si aún no lo has hecho.
2. Agrega una aplicación web a tu proyecto de Firebase.
3. Copia la configuración de Firebase y pégala en tu archivo firebase.js en la carpeta /src de tu proyecto.
4. Configura la autenticación en Firebase habilitando los métodos de autenticación con correo electrónico/contraseña y Google.

### 3. Ejecutar la Aplicación
Ejecuta la aplicación en modo de desarrollo con el siguiente comando

```bash
npm start
``` 
La aplicación estará disponible en http://localhost:3000.

#### Características
* Registro de Usuarios: Los usuarios pueden registrarse con su correo electrónico y contraseña.
* Inicio de Sesión con Google: Autenticación rápida usando una cuenta de Google.
* Gestión de Pedidos: Los usuarios pueden realizar pedidos después de iniciar sesión. 
* Dentro del mismo perfil se pueden actualizar los estados de los pedidos y eliminar los pedidos que se consideren necesarios.


## Scripts Disponibles

- npm start - Inicia la aplicación en modo desarrollo.
- npm run build - Compila la aplicación para producción en la carpeta build.
