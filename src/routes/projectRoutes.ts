import { Router } from "express";
import { ProjectController } from "../controllers/ProjectController";
import { body, param } from 'express-validator';
import { handleInputsErros } from "../middleware/validation";

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

export default router;