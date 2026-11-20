# Biblioteca — TP Integrador TLP IV

**Dominio:** C — Biblioteca (recurso: Libro, estados `DISPONIBLE`, `PRESTADO`, `EN_REPARACION`)
**Base de datos:** PostgreSQL + Sequelize
**Organización del backend:** Carpeta por módulo

## Integrantes
- Ruiz Diaz, Dario — veyrdric
- Cabrera, Dylan — Dylan-Cabrera
- Cruz, Diego — Diegojhiller

## Descripción
Aplicación web para gestionar el catálogo de libros de una biblioteca. Los usuarios se suscriben a
los libros que les interesan y, cada vez que un libro cambia de estado, todos sus suscriptores
reciben una notificación en la aplicación y queda registrada en la consola del backend. El acceso
a cada acción depende del rol del usuario (admin, operador o usuario).

## Requisitos previos
- Docker y Docker Compose
- Git
- (Opcional, para desarrollo local) Node.js 24

## Cómo ejecutar el proyecto

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/veyrdric/tp-integrador-tlp4.git
   cd tp-integrador-tlp4
   ```
2. Crear el archivo de variables de entorno:
   ```bash
   cp .env.example .env
   ```
3. Levantar los servicios:
   ```bash
   docker compose up --build
   ```
4. El seed de roles, permisos, usuarios de prueba y libros de ejemplo se ejecuta solo al iniciar el
   backend. Se puede correr varias veces: solo crea lo que falta.
5. Abrir la aplicación:
   - Frontend: http://localhost:5173
   - API: http://localhost:3000/api

## Ejecución sin Docker (opcional)

1. Levantar solo la base: `docker compose up -d db`.
2. En `.env`, cambiar `DB_HOST=db` por `DB_HOST=localhost`.
3. Backend, desde su carpeta:
   ```bash
   cd backend
   npm install
   npm run dev
   ```
4. Frontend, en otra terminal:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   El frontend queda en http://localhost:5173 y lee `VITE_API_URL` del entorno
   (por defecto `http://localhost:3000/api`).

## Variables de entorno

| Variable | Descripción | Ejemplo |
|---|---|---|
| `DB_HOST` | Host de la base de datos | `db` |
| `DB_PORT` | Puerto de la base de datos | `5432` |
| `DB_USER` | Usuario | `tlp4` |
| `DB_PASSWORD` | Contraseña | `tlp4` |
| `DB_NAME` | Nombre de la base | `tp_integrador` |
| `JWT_SECRET` | Clave para firmar los tokens | `cambiar-esto` |
| `JWT_EXPIRES_IN` | Duración del token | `8h` |
| `API_PORT` | Puerto del backend | `3000` |
| `VITE_API_URL` | URL de la API para el frontend | `http://localhost:3000/api` |

## Usuarios de prueba

| Rol | Email | Contraseña |
|---|---|---|
| admin | admin@tp.com | admin123 |
| operador | operador@tp.com | operador123 |
| usuario | usuario@tp.com | usuario123 |

Todo usuario nuevo que se registra desde la pantalla de registro queda con el rol `usuario`.

## Cómo probar el flujo de notificaciones
1. Ingresar como `usuario` y suscribirse a un libro (botón "Suscribirme" en el detalle).
2. En otra ventana (o en incógnito), ingresar como `operador` y cambiar el estado de ese libro.
3. Volver a la sesión de `usuario`: en pocos segundos la campana muestra el contador y la
   notificación aparece en la bandeja.
4. Verificar la notificación en la consola del backend:
   ```bash
   docker compose logs backend
   ```
   ```
   [NOTIFICACIÓN] Para: usuario@tp.com | Libro "Ficciones" | Estado: DISPONIBLE → PRESTADO
   ```

## Endpoints principales

Todas las rutas, salvo registro y login, requieren el header `Authorization: Bearer <token>`.
Sin token responden `401`; sin el permiso, `403`.

| Método | Ruta | Permiso requerido |
|---|---|---|
| POST | /api/auth/register | — |
| POST | /api/auth/login | — |
| GET | /api/auth/me | sesión iniciada |
| GET | /api/books | book:read |
| GET | /api/books/:id | book:read |
| POST | /api/books | book:create |
| PUT | /api/books/:id | book:update |
| PATCH | /api/books/:id/status | book:change-status |
| DELETE | /api/books/:id | book:delete |
| POST | /api/subscriptions | subscription:create |
| DELETE | /api/subscriptions/:bookId | subscription:delete |
| GET | /api/notifications | notification:read |
| GET | /api/notifications/unread-count | notification:read |
| PATCH | /api/notifications/:id/read | notification:read |
| PATCH | /api/notifications/read-all | notification:read |
| GET | /api/users | user:read |
| GET | /api/users/roles | user:assign-role |
| PATCH | /api/users/:id/role | user:assign-role |

## Patrones y principios SOLID
Ver [PATTERNS.md](./PATTERNS.md).
