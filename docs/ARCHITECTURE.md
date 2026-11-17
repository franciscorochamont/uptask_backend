# Arquitectura del backend

UpTask expone una **API REST** organizada por capas, al estilo MVC pero sin vistas: el frontend es un proyecto aparte que consume la API por HTTP.

```
React (Vite) ──HTTP/JSON──▶ Express REST API ──Mongoose──▶ MongoDB
                               │
                               ├─ routes       (endpoints + validación)
                               ├─ middleware   (validación, carga de recursos)
                               └─ controllers  (lógica de cada endpoint)
```

## Capas

| Capa | Carpeta | Responsabilidad |
|---|---|---|
| Arranque | `src/index.ts` | Lee `PORT` e inicia el servidor |
| Aplicación | `src/server.ts` | Carga `.env`, conecta la BD, activa `express.json()` y monta las rutas en `/api/projects` |
| Configuración | `src/config/` | Conexión a MongoDB. Si falla, el proceso termina con `exit(1)` |
| Rutas | `src/routes/` | Definen los endpoints y sus reglas de `express-validator` |
| Middleware | `src/middleware/` | Revisan los errores de validación y cargan recursos en `req` |
| Controladores | `src/controllers/` | Ejecutan la lógica del endpoint y responden al cliente |
| Modelos | `src/models/` | Esquemas de Mongoose e interfaces de TypeScript |

**Capas pendientes:** `emails/` (plantillas y envío de correos) y `utils/` (generación de JWT y tokens, hash de passwords).

## Flujo de una petición

Ejemplo: `PUT /api/projects/:projectId/tasks/:taskId`

1. **`router.param('projectId', projectExist)`**: busca el proyecto. Si no existe, responde `404`. Si existe, lo guarda en `req.project`.
2. **`router.param('taskId', taskExist)`**: busca la tarea. Si no existe, responde `404`. Si existe, la guarda en `req.task`.
3. **`router.param('taskId', taskBelongsToProject)`**: compara `req.task.project` con `req.project._id`. Si la tarea no pertenece al proyecto, responde `400`.
4. **Validadores de `express-validator`**: revisan `params` y `body`.
5. **`handleInputsErros`**: si hubo errores de validación, responde `400` con `{ errors: [...] }`.
6. **Controlador**: trabaja directamente con `req.project` y `req.task`, sin volver a consultar la base de datos.

Como los middlewares de `router.param` se ejecutan antes que el controlador, los controladores de tareas no repiten las búsquedas ni las verificaciones de pertenencia.

### Extensión de `Request`

Los middlewares agregan propiedades al objeto `Request` de Express con *declaration merging*:

```ts
declare global {
    namespace Express {
        interface Request {
            project: IProject   // middleware/project.ts
            task: ITask         // middleware/task.ts
        }
    }
}
```

## Modelos y relaciones

```
Project 1 ───────────── * Task
  tasks: [ObjectId] ──▶    project: ObjectId ──▶ Project
```

La relación es **bidireccional**. El proyecto guarda un arreglo con los IDs de sus tareas, y cada tarea guarda el ID de su proyecto. Por eso, al crear o eliminar una tarea, se actualizan los dos documentos al mismo tiempo con `Promise.all`.

### Project

| Campo | Tipo | Reglas |
|---|---|---|
| `projectName` | String | requerido, `trim` |
| `clientName` | String | requerido, `trim` |
| `description` | String | requerido, `trim` |
| `tasks` | `[ObjectId]` → `Task` | se llena con `populate('tasks')` |
| `createdAt` / `updatedAt` | Date | automáticos (`timestamps`) |

### Task

| Campo | Tipo | Reglas |
|---|---|---|
| `name` | String | requerido, `trim` |
| `description` | String | requerido, `trim` |
| `project` | ObjectId → `Project` | se asigna desde `req.project._id` |
| `status` | String (enum) | por defecto `pending` |
| `createdAt` / `updatedAt` | Date | automáticos (`timestamps`) |

Valores de `status`:

| Valor | Significado |
|---|---|
| `pending` | Pendiente |
| `onHold` | En espera |
| `inProgress` | En progreso |
| `underReview` | En revisión |
| `completed` | Completada |

El enum se define una sola vez como objeto `as const`, y de ahí se deriva el tipo `TaskStatus`. Así, el esquema de Mongoose y el tipo de TypeScript no se desincronizan.

### Modelos pendientes

- **User**: nombre, email, password hasheado y `confirmed`.
- **Token**: token de 6 dígitos ligado a un usuario, con expiración. Se usa para confirmar la cuenta y restablecer el password.
- **Project** (cambios): agregar `manager` (ObjectId → User) y `team` ([ObjectId] → User).

## Manejo de errores

| Situación | Código | Cuerpo |
|---|---|---|
| Validación fallida | `400` | `{ errors: [...] }` (formato de express-validator) |
| Proyecto o tarea no encontrados | `404` | `{ message: "..." }` |
| La tarea no pertenece al proyecto | `400` | `{ error: "..." }` |
| Error inesperado (tareas) | `500` | `{ message: "Ocurrio un error" }` |

**Mejoras pendientes:**

- Los controladores de proyectos solo hacen `console.log(error)` en el `catch` y no responden. Si ocurre un error, la petición se queda colgada.
- Unificar la llave del error: hoy se usan `message`, `error` y `errors`.

## Decisiones de diseño

- **Seguridad añadida después:** el CRUD se construye primero sin autenticación. JWT, `manager` y `team` se agregarán encima en etapas posteriores.
- **Rutas anidadas:** las tareas solo existen dentro de un proyecto (`/api/projects/:projectId/tasks/:taskId`). Esto refleja la relación de los datos y permite verificar la pertenencia en un solo lugar.
- **`strict: false` en `tsconfig.json`:** por ahora el modo estricto de TypeScript está desactivado.
