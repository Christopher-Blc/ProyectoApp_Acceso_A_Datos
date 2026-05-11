# ProyectoApp_Acceso_A_Datos

Backend REST desarrollado con NestJS, TypeORM y MariaDB para gestionar una aplicacion de reservas deportivas. El proyecto cubre usuarios, autenticacion JWT, reservas, pistas, instalaciones, membresias, pagos, comentarios, notificaciones y carga de datos iniciales mediante seeders.

Tambien incluye:

- documentacion Swagger en `/api`
- pagina de bienvenida en `/`
- despliegue con Docker Compose + PM2
- phpMyAdmin para inspeccion de la base de datos
- rate limiting global con reglas especificas para autenticacion

## Stack

- NestJS 11
- TypeORM 0.3
- MySQL/MariaDB mediante `mysql2`
- JWT con `@nestjs/jwt`
- Swagger con `@nestjs/swagger`
- Throttler para rate limiting
- Docker y Docker Compose
- PM2 Runtime
- TypeORM Extension para seeders

## Funcionalidad principal

El backend expone modulos para:

- `auth`: registro, login, refresh token y logout
- `users`: CRUD de usuarios
- `reserva`: gestion de reservas
- `pista`: gestion de pistas deportivas
- `instalacion`: gestion de instalaciones
- `horario-pista`: franjas y disponibilidad de pista
- `membresia`: membresias de usuario
- `pago`: pagos asociados a reservas
- `comentario`: comentarios y valoraciones
- `noti`: notificaciones

## Estructura real del proyecto

```text
src/
  main.ts
  app.module.ts
  app.controller.ts
  app.service.ts
  seed.ts
  common/
    constants/
    decorators/
  database/
    inventory/
    seeding/
      seeds/
  modules/
    auth/
    comentario/
    horario_pista/
    instalacion/
    membresia/
    noti/
    pago/
    pista/
    reserva/
    users/
test/
  app.e2e-spec.ts
```

## Requisitos

- Node.js y npm
- Docker Desktop si quieres ejecutar el entorno completo con contenedores
- MariaDB/MySQL si prefieres ejecutar la API localmente sin Docker

## Variables de entorno

La aplicacion utiliza un archivo `.env` en la raiz. Un ejemplo valido, coherente con el proyecto actual, es este:

```env
WEB_SERVER_PORT=8000
DB_HOST=database
DB_PORT=3306
DB_ROOT_PASSWORD=my-secret
DB_DATABASE=respi
DB_USER=respi
DB_PASSWORD=my-secret
JWT_ACCESS_SECRET=super_clave_larga_y_segura
JWT_EXPIRES_IN=1h
JWT_REFRESH_SECRET=super_clave_muy_larga_y_mas_segura
JWT_REFRESH_EXPIRES_IN=7d
FRONTEND_URL=https://respi.es
EMAIL_VERIFICATION_TTL_MINUTES=10
NODE_ENV=development
SMTP_HOST=smtp.tudominio.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=no-reply@respi.es
SMTP_PASS=tu_password_smtp
SMTP_FROM=Respi <no-reply@respi.es>
```

Notas importantes:

- En Docker, la API escucha dentro del contenedor en el puerto `3000` y se publica hacia el host usando `WEB_SERVER_PORT`.
- En ejecucion local, `main.ts` usa `PORT` si existe; si no, arranca en `3000`.
- Para ejecutar seeders fuera de Docker normalmente tendras que usar `DB_HOST=localhost`.
- Las claves JWT deben cambiarse por valores seguros fuera de desarrollo.
- Si `NODE_ENV=production` y falta configuracion SMTP, el registro devolvera error para no dejar usuarios sin correo de verificacion.
- En desarrollo, si falta SMTP, el backend devuelve `verification_url` en el register para pruebas manuales.

## Instalacion local

```bash
npm install
```

### Arranque en desarrollo

```bash
npm run start:dev
```

### Build de produccion

```bash
npm run build
npm run start:prod
```

## Docker

El `docker-compose.yml` levanta tres servicios:

- `web_server`: backend NestJS ejecutado con PM2
- `database`: MariaDB 11.4
- `phpmyadmin`: interfaz web para la base de datos

### Levantar el entorno completo

```bash
docker compose up -d --build
```

### Detener contenedores

```bash
docker compose down
```

### Eliminar tambien el volumen de MariaDB

```bash
docker compose down -v
```

Accesos por defecto:

- API: `http://localhost:8000` si `WEB_SERVER_PORT=8000`
- Swagger: `http://localhost:8000/api`
- phpMyAdmin: `http://localhost:8081`

## Scripts disponibles

```bash
npm run build
npm run format
npm run start
npm run start:dev
npm run start:debug
npm run start:prod
npm run seed
npm run lint
npm run test
npm run test:watch
npm run test:cov
npm run test:debug
npm run test:e2e
```

## Base de datos y TypeORM

La conexion principal se configura en `AppModule` con `TypeOrmModule.forRoot()`.

Caracteristicas actuales:

- `type: 'mysql'`
- `autoLoadEntities: true`
- `synchronize: true`

`synchronize: true` es comodo en desarrollo, pero no deberia mantenerse asi en produccion.

## Seeders

El script `src/seed.ts` inicializa un `DataSource`, sincroniza entidades y ejecuta los seeders definidos en `src/database/seeding/seeds`.

Actualmente se cargan datos para:

- usuarios
- instalaciones
- pistas
- membresias
- horarios de pista
- reservas
- pagos
- comentarios
- notificaciones

### Ejecutar seeders en local

```bash
npm run seed
```

### Ejecutar seeders dentro del contenedor

```bash
docker exec -it respi-webserver npm run seed
```

## Seguridad y autenticacion

El modulo `auth` implementa:

- `POST /auth/register`
- `POST /auth/verify-email`
- `POST /auth/resend-verification`
- `POST /auth/login`
- `POST /auth/refresh`
- `POST /auth/logout`

Ademas:

- se usan access token y refresh token
- los refresh tokens se guardan hasheados en usuario
- el logout revoca el access token mediante blacklist persistida
- Swagger esta configurado con Bearer Auth

Rate limiting configurado actualmente:

- perfil `default`: 100 peticiones cada 15 minutos
- perfil `auth`: 10 peticiones cada 1 hora

Los endpoints de autenticacion sensibles usan el perfil `auth`.

## Documentacion API

La documentacion OpenAPI se genera automaticamente con Swagger y queda disponible en:

```text
/api
```

Si ejecutas el proyecto en local con la configuracion por defecto:

```text
http://localhost:3000/api
```

Si ejecutas el proyecto con Docker y `WEB_SERVER_PORT=8000`:

```text
http://localhost:8000/api
```

## Rutas base expuestas

- `GET /` pagina HTML de bienvenida
- `POST /auth/*` autenticacion
- `GET|POST|PUT|DELETE /users` usuarios
- `GET|POST|PUT|DELETE /reserva` reservas
- `GET|POST|PUT|DELETE /pista` pistas
- `GET|POST|PUT|DELETE /instalacion` instalaciones
- `GET|POST|PUT|DELETE /horario-pista` horarios
- `GET|POST|PUT|DELETE /membresia` membresias
- `GET|POST|PUT|DELETE /pago` pagos
- `GET|POST|PUT|DELETE /comentario` comentarios
- `GET|POST|PUT|DELETE /noti` notificaciones

Nota: el modulo `users` esta protegido con `AuthGuard` + `RolesGuard` y restringido al rol `SUPER_ADMIN`.

## Testing

El proyecto incluye tests unitarios y e2e con Jest.

```bash
npm run test
npm run test:e2e
```

## Observaciones

- El contenedor backend se arranca con `pm2-runtime start pm2.json`.
- `pm2.json` ejecuta `npm i && npm run start:dev`, por lo que el servicio Docker esta pensado principalmente para desarrollo.
- Existe un archivo `env`, pero la configuracion estandar de Nest y Docker Compose usa `.env` en la raiz.

## Autores

Proyecto desarrollado por Christopher, Mauro y Javi.

Repositorio asociado:

- Backend: `https://github.com/Christopher-Blc/ProyectoApp_Acceso_A_Datos.git`
- Frontend: `https://github.com/Christopher-Blc/Respi_Frontend.git`
