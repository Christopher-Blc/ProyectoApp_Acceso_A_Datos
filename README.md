# ProyectoApp_Acceso_A_Datos

Aplicación backend desarrollada en **Node.js + NestJS + TypeORM** que gestiona usuarios, reservas, instalaciones deportivas, membresías, pagos, notificaciones y comentarios.
Incluye **integración con Docker**, **MariaDB**, **phpMyAdmin**, y un sistema completo de **seeders** para cargar datos iniciales.

---

## 🚀 Tecnologías utilizadas

* **Node.js**
* **NestJS**
* **TypeORM**
* **TypeORM-Extension (seeders)**
* **MariaDB**
* **Docker & Docker Compose**
* **phpMyAdmin**
* **PM2 Runtime**

---

## 📁 Estructura del proyecto

```
src/
 ├── db/
 │   └── seeding/
 │       └── seeds/
 │           ├── users.seeder.ts
 │           ├── reservas.seeder.ts
 │           ├── pista.seeder.ts
 │           ├── pago.seeder.ts
 │           ├── membresia.seeder.ts
 │           ├── instalacion.seeder.ts
 │           ├── comentario.seeder.ts
 │           ├── horario_pista.seeder.ts
 │           └── noti.seeder.ts
 │
 ├── users/
 ├── reserva/
 ├── pista/
 ├── pago/
 ├── noti/
 ├── membresia/
 ├── comentario/
 ├── instalacion/
 ├── horario_pista/
 │
 └── seed.ts          # Script para ejecutar seeders
```

---

## ⚙️ Configuración del entorno

El archivo `.env` debe contener:

```env
WEB_SERVER_PORT=8000

DB_HOST=database
DB_PORT=3306
DB_ROOT_PASSWORD=my-secret
DB_DATABASE=respi
DB_USER=respi
DB_PASSWORD=my-secret
```

> **Nota:**
> Para ejecutar los seeds fuera de Docker, cambia temporalmente `DB_HOST=localhost`.

---

## 🐳 Uso con Docker

El proyecto incluye un entorno completo con:

* **Servidor NestJS**
* **MariaDB**
* **phpMyAdmin**
* **Volúmenes persistentes**

### 🔧 Levantar todo el entorno

```bash
docker compose up -d --build
```

### 🛑 Detener los servicios

```bash
docker compose down
```

### 🗑 Si quieres borrar la base de datos (volumen)

```bash
docker compose down -v
```

> Esto hará que MariaDB recree el usuario y la base de datos definidos en `.env`.

---

## 🧪 Ejecutar seeders

### 👉 Opción A — Ejecutar seeds **dentro de Docker** (recomendado)

1. Entrar al contenedor del servidor:

```bash
docker exec -it respi-webserver sh
```

2. Ejecutar los seeds:

```bash
npx ts-node src/seed.ts
```

---

### 👉 Opción B — Ejecutar seeds **fuera de Docker**

1. Cambia en `.env`:

```
DB_HOST=localhost
```

2. Asegúrate de que MariaDB está corriendo:

```bash
docker compose up -d database
```

3. Ejecuta:

```bash
ts-node src/seed.ts
```

---

## 🔥 Endpoints (pendiente de documentación)

El proyecto incluye controladores para:

* Usuarios
* Reservas
* Pistas
* Membresías
* Instalaciones
* Horarios de pista
* Pagos
* Comentarios
* Notificaciones

> Se añadirá la documentación completa de endpoints más adelante.

---

## 📌 Scripts útiles

### Iniciar proyecto localmente

```bash
npm run start:dev
```

### Ejecutar build

```bash
npm run build
```

### Ejecutar seeds dentro del contenedor

```bash
docker exec -it respi-webserver npx ts-node src/seed.ts
```

---

## 💾 Gestión de la base de datos

Puedes acceder a **phpMyAdmin** en:

👉 **[http://localhost:8081](http://localhost:8081)**

Credenciales:

* **Usuario:** root
* **Contraseña:** (valor en `DB_ROOT_PASSWORD`)

---

## 🧑‍💻 Autores

Proyecto desarrollado por **Christopher , Mauro y Javi**
🔗 GitHub: [https://github.com/Christopher-Blc](https://github.com/Christopher-Blc)

