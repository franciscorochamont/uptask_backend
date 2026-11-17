# Referencia de la API

URL base: `http://localhost:4000/api`

Todas las peticiones con cuerpo deben enviar `Content-Type: application/json`.

> Por ahora ningún endpoint requiere autenticación. Cuando se implemente JWT, esta guía se actualizará con el header `Authorization`.

## Proyectos

### Crear proyecto

`POST /projects`

```json
{
  "projectName": "Tienda en línea",
  "clientName": "Juan Pérez",
  "description": "Ecommerce para la tienda de Juan"
}
```

| Campo | Validación |
|---|---|
| `projectName` | requerido |
| `clientName` | requerido |
| `description` | requerido |

**Respuesta `200`:** `Proyecto creado correctamente` (texto)

### Listar proyectos

`GET /projects`

**Respuesta `200`:** arreglo de proyectos, con sus `tasks` ya populadas.

### Obtener proyecto

`GET /projects/:id`

| Param | Validación |
|---|---|
| `id` | ObjectId de MongoDB válido |

**Respuestas:** `200` con el proyecto · `400` si el ID no es válido · `404` si el proyecto no existe

### Actualizar proyecto

`PUT /projects/:id`

Usa el mismo cuerpo y las mismas validaciones que al crear, más la validación de `id`.

**Respuestas:** `200` con `Proyecto Actualizado` · `400` · `404`

### Eliminar proyecto

`DELETE /projects/:id`

**Respuestas:** `200` con `Proyecto Eliminado` · `400` · `404`

## Tareas

Todas las rutas de tareas están anidadas dentro de un proyecto. Antes de llegar al controlador, el middleware `projectExist` valida `:projectId` y responde `404` si el proyecto no existe.

En las rutas que incluyen `:taskId` también se ejecutan dos middlewares más:

- `taskExist`: responde `404` si la tarea no existe.
- `taskBelongsToProject`: responde `400` si la tarea pertenece a otro proyecto.

### Crear tarea

`POST /projects/:projectId/tasks`

```json
{
  "name": "Diseñar el carrito",
  "description": "Maquetar la vista del carrito de compras"
}
```

| Campo | Validación |
|---|---|
| `name` | requerido |
| `description` | requerido |

**Respuesta `200`:** `Tarea creada correctamente`

### Listar las tareas de un proyecto

`GET /projects/:projectId/tasks`

**Respuesta `200`:** arreglo de tareas, cada una con su `project` populado.

### Obtener tarea

`GET /projects/:projectId/tasks/:taskId`

**Respuestas:** `200` con la tarea · `400` · `404`

### Actualizar tarea

`PUT /projects/:projectId/tasks/:taskId`

Usa el mismo cuerpo y las mismas validaciones que al crear.

**Respuestas:** `200` · `400` · `404`

### Eliminar tarea

`DELETE /projects/:projectId/tasks/:taskId`

Borra la tarea y también la quita del arreglo `tasks` de su proyecto.

**Respuesta `200`:** `Tarea eliminada correctamente`

### Cambiar el estado de una tarea

`POST /projects/:projectId/tasks/:taskId/status`

```json
{ "status": "inProgress" }
```

Valores permitidos: `pending`, `onHold`, `inProgress`, `underReview`, `completed`.

**Respuesta `200`:** `Tarea Actualizada`

> La ruta solo valida que `status` no venga vacío. Si llega un valor fuera del enum, Mongoose lo rechaza al guardar y la API responde `500`. Pendiente: validarlo en la ruta con `isIn()` para responder `400`.

## Formato de los errores

Validación (`400`):

```json
{
  "errors": [
    { "type": "field", "msg": "El nombre del proyecto es requerido", "path": "projectName", "location": "body" }
  ]
}
```

Recurso no encontrado (`404`):

```json
{ "message": "Proyecto no encontrado" }
```

## Endpoints pendientes

| Método | Ruta | Descripción |
|---|---|---|
| POST | `/auth/create-account` | Registro de usuario |
| POST | `/auth/confirm-account` | Confirmar cuenta con el token |
| POST | `/auth/login` | Iniciar sesión y obtener el JWT |
| POST | `/auth/request-code` | Reenviar el token de confirmación |
| POST | `/auth/forgot-password` | Solicitar un token para restablecer el password |
| POST | `/auth/validate-token` | Validar el token de restablecimiento |
| POST | `/auth/update-password/:token` | Guardar el nuevo password |
| GET | `/auth/user` | Usuario autenticado |
| GET/POST/DELETE | `/projects/:projectId/team` | Administrar colaboradores |

Las rutas de esta tabla son tentativas y se ajustarán conforme se implementen.
