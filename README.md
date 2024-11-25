# RIFF API

Este es un proyecto desarrollado con Express, TypeScript, Prisma, PostgreSQL y JWT. Asegúrate de configurar las variables de entorno necesarias antes de ejecutar el proyecto.
Ademas se utilizo los servicios de DigitalOcean para la subida de archivos

## Variables de Entorno

Este proyecto requiere las siguientes variables de entorno para funcionar correctamente:

- **`DATABASE_URL`**: URL de conexión a la base de datos. Ejemplo: `postgres://usuario:contraseña@servidor:puerto/nombre_db`.
- **`JWT_SECRET`**: Clave secreta para firmar y verificar tokens JWT.
- **`PORT`**: Puerto en el que se ejecutará el servidor. Ejemplo: `3000`.
- **`ACCESS_KEY`**: Clave de acceso para integraciones con servicios externos en este caso DigitalOcean.
- **`SECRET_KEY`**: Clave secreta para integraciones con servicios externos en este caso DigitalOcean.
- **`SPACE_NAME`**: Nombre del espacio o recurso específico en el servicio externo en este caso DigitalOcean.

## Configuración

1. Crea un archivo `.env` en la raíz del proyecto.
2. Añade las variables de entorno requeridas al archivo `.env`, siguiendo el formato:

   ```env
   DATABASE_URL=
   JWT_SECRET=
   PORT=
   ACCESS_KEY=
   SECRET_KEY=
   SPACE_NAME=
   ```
