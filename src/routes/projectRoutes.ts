import { Router } from "express";
import { ProjectController } from "../controllers/ProjectController";
import { body, param } from 'express-validator';
import { handleInputsErros } from "../middleware/validation";
import { TaskController } from "../controllers/TaskController";
import { projectExist } from "../middleware/project";
import { taskBelongsToProject, taskExist } from "../middleware/task";

const router = Router();

// Define las rutas
router.post(
    '/',
        body('projectName')
            .notEmpty().withMessage('El nombre del proyecto es requerido'),
        body('clientName')
            .notEmpty().withMessage('El nombre del cliente es requerido'),
        body('description')
            .notEmpty().withMessage('La descripcion es obligatoria'),
    handleInputsErros,
    ProjectController.createProject
)

router.get('/', ProjectController.getAllProjects)

router.get(
        '/:id',
        param('id').isMongoId().withMessage('ID Invalido'),
        handleInputsErros,
        ProjectController.getAllProjectsById
)

router.put(
        '/:id',
            param('id').isMongoId().withMessage('ID Invalido'),
            body('projectName')
                .notEmpty().withMessage('El nombre del proyecto es requerido'),
            body('clientName')
                .notEmpty().withMessage('El nombre del cliente es requerido'),
            body('description')
                .notEmpty().withMessage('La descripcion es obligatoria'),
            handleInputsErros,
        ProjectController.updateProject
)

router.delete(
    '/:id',
        param('id').isMongoId().withMessage('ID Invalido'),
    handleInputsErros,
    ProjectController.deleteProject
)

// Rutas para las Tareas
// Ejemplo: /api/projects/6ad529e2d33e4236cf5d2ce6/tasks

// Middleware para validar que un proyecto exista
router.param('projectId', projectExist)

router.post(
    '/:projectId/tasks',
    body('name')
        .notEmpty().withMessage('El nombre de la tarea es requerido'),
    body('description')
        .notEmpty().withMessage('La descripcion es obligatoria'),
     handleInputsErros,
    TaskController.createTask,
)
router.get(
    '/:projectId/tasks',
    TaskController.getProjectTasks,
)

// Middleware para validar que una tarea exista
router.param('taskId', taskExist)
router.param('taskId', taskBelongsToProject)

router.get(
    '/:projectId/tasks/:taskId',
    param('taskId').isMongoId().withMessage('ID Invalido'),
    handleInputsErros,
    TaskController.getTaskById,
)

router.put(
    '/:projectId/tasks/:taskId',
    param('taskId').isMongoId().withMessage('ID Invalido'),
    body('name')
        .notEmpty().withMessage('El nombre de la tarea es requerido'),
    body('description')
        .notEmpty().withMessage('La descripcion es obligatoria'),
    handleInputsErros,
    TaskController.updateTask,
)

router.delete(
    '/:projectId/tasks/:taskId',
    param('taskId').isMongoId().withMessage('ID Invalido'),
    handleInputsErros,
    TaskController.deleteTask,
)

router.post(
    '/:projectId/tasks/:taskId/status',
    param('taskId').isMongoId().withMessage('ID Invalido'),
    body('status')
        .notEmpty().withMessage('El estado es requerido'),
    handleInputsErros,
    TaskController.updateStatus
)

export default router;
