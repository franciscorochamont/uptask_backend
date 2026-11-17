# UpTask — Backend

API REST de **UpTask**, un administrador de proyectos y tareas (stack MERN). Este repositorio contiene solo el backend; el frontend (React + Vite + React Query) vive en un proyecto separado y consume esta API.

> **Estado:** en desarrollo. Ya funcionan el CRUD de proyectos y el CRUD de tareas anidadas. La autenticación, los colaboradores y el envío de correos todavía no están implementados (ver [Roadmap](#roadmap)).

## Stack

| Área | Tecnología | Versión | Estado |
|---|---|---|---|
| Runtime | Node.js | — | ✅ |
| Lenguaje | TypeScript | ^7.0 | ✅ |
| Ejecución en desarrollo | tsx (`tsx watch`) | ^4.23 | ✅ |
| Servidor HTTP | Express | ^5.3 | ✅ |
| Base de datos | MongoDB (Atlas) | — | ✅ |
| ODM | Mongoose | ^9.11 | ✅ |
| Validación | express-validator | ^7.3 | ✅ |
| Variables de entorno | dotenv | ^18.0 | ✅ |
| Logs de consola | colors | ^1.4 | ✅ |
| CORS | cors | — | ⏳ Pendiente |
| Logs HTTP | morgan | — | ⏳ Pendiente |
| Hash de passwords | bcrypt | — | ⏳ Pendiente |
| Sesión | jsonwebtoken (JWT) | — | ⏳ Pendiente |
| Correos | Nodemailer / Resend | — | ⏳ Pendiente |

## Requisitos

- Node.js 20 o superior
- Una base de datos MongoDB (local o en MongoDB Atlas)

## Instalación y uso

```bash
npm install
# crea el archivo .env (ver la sección siguiente)
npm run dev
```

El servidor arranca en `http://localhost:4000`, o en el puerto que indique `PORT`.

### Scripts

| Script | Comando | Descripción |
|---|---|---|
| `dev` | `tsx watch src/index.ts` | Levanta el servidor y lo reinicia con cada cambio |

> Pendiente: agregar un script `build` (`tsc`) y otro `start` (`node dist/index.js`) para producción.

## Variables de entorno

Crea un archivo `.env` en la raíz. Está en `.gitignore`, así que nunca se sube al repositorio.

| Variable | Requerida | Descripción |
|---|---|---|
| `DATABASE_URL` | Sí | Cadena de conexión de MongoDB (`mongodb+srv://...`) |
| `PORT` | No | Puerto del servidor (por defecto `4000`) |
| `FRONTEND_URL` | Pendiente | Origen permitido por CORS |
| `JWT_SECRET` | Pendiente | Clave para firmar los JWT |
| Credenciales de correo | Pendiente | Las del servicio de envío de correos |

```env
DATABASE_URL=mongodb+srv://<usuario>:<password>@<cluster>/<base_de_datos>
PORT=4000
```

## Estructura del proyecto

```
src/
├── index.ts              # Punto de entrada: arranca el servidor HTTP
├── server.ts             # Configura Express, conecta la BD y monta las rutas
├── config/
│   └── db.ts             # Conexión a MongoDB con Mongoose
├── models/
│   ├── Project.ts        # Esquema e interfaz de Proyecto
│   └── Task.ts           # Esquema e interfaz de Tarea, y sus estados
├── routes/
│   └── projectRoutes.ts  # Endpoints de proyectos y tareas, con sus validaciones
├── controllers/
│   ├── ProjectController.ts
│   └── TaskController.ts
└── middleware/
    ├── validation.ts     # Devuelve los errores de express-validator
    ├── project.ts        # Carga el proyecto en req.project
    └── task.ts           # Carga la tarea en req.task y valida que pertenezca al proyecto
```

## Documentación

- [Arquitectura](docs/ARCHITECTURE.md): capas, flujo de una petición, modelos y relaciones.
- [Referencia de la API](docs/API.md): endpoints, validaciones y respuestas.

## Roadmap

- [x] Servidor base con Express y conexión a MongoDB
- [x] CRUD de proyectos con validación de entradas
- [x] CRUD de tareas anidadas en proyectos
- [x] Cambio de estado de las tareas
- [x] Middlewares para cargar el proyecto y la tarea en `req`
- [ ] CORS configurado con `FRONTEND_URL`
- [ ] Logs HTTP con morgan
- [ ] Modelo `User` y registro de cuentas (password hasheado con bcrypt)
- [ ] Modelo `Token` y confirmación de cuenta por correo (token de 6 dígitos)
- [ ] Inicio de sesión con JWT y middleware de autenticación (`req.user`)
- [ ] Restablecer password
- [ ] Asociar cada proyecto a su `manager` y mostrar solo los proyectos del usuario
- [ ] Colaboradores (`team`) y permisos por rol
- [ ] Colección de Postman con todos los endpoints
- [ ] Scripts `build` y `start`, y deployment
