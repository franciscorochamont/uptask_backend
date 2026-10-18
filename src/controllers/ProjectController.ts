import { Request, Response } from "express";
import Project from "../models/Project";

export class ProjectController {

    // Crea un nuevo Proyecto
    static createProject = async (req: Request, res: Response) => {

        // Crea un nuevo proyecto
        const project = new Project(req.body)
        
        try {
            // Guarda el nuevo proyecto en la base de datos
            await project.save();
            // Respuesta al cliente
            res.send('Proyecto creado correctamente')
        } catch (error) {
            console.log(error)
        }
    }

    // Obtiene todos los proyectos
    static getAllProjects = async (req: Request, res: Response) => {
        try {
            // Busca todos los proyectos en la base de datos
            const projects = await Project.find();
            res.json(projects)
        } catch (error) {
            console.log(error)
        }
    }

    // Obtiene un proyecto por su ID
    static getAllProjectsById = async (req: Request, res: Response) => {
        const { id } = req.params;
        try {
            // Busca un proyecto por su ID en la base de datos
            const project = await Project.findById(id);
            // Si no existe el proyecto, retorna un Error 400
            if(!project){
                const error = new Error('Proyecto no encontrado')
                return res.status(404).json({ message: error.message })
            }
            res.json(project) // Retorna el proyecto encontrado
        } catch (error) {
            console.log(error)
        }
    }
    
    // Actualiza un proyecto
    static updateProject = async (req: Request, res: Response) => {
        const { id } = req.params;
        try {
            // Busca y actualiza un proyecto por su ID en la base de datos
            const project = await Project.findByIdAndUpdate(id, req.body);
            // Si no existe el proyecto, retorna un Error 400
            if(!project){
                const error = new Error('Proyecto no encontrado')
                return res.status(404).json({ message: error.message })
            }
            await project.save()
            res.send('Proyecto Actualizado') // Retorna el proyecto Actualizado
        } catch (error) {
            console.log(error)
        }
    }
    
    // Eliminar un proyecto
    static deleteProject = async (req: Request, res: Response) => {
        const { id } = req.params;
        try {
            // Busca el proyecto por su ID en la base datos
            const project = await Project.findById(id)
            // Si no existe el proyecto, retorna un Error 400
            if(!project){
                const error = new Error('Proyecto no encontrado')
                return res.status(404).json({ message: error.message })
            }
            await project.deleteOne(); // Elimina el proyecto de la base de datos
            res.send('Proyecto Eliminado');
        } catch (error) {
            console.log(error)
        }
    }

}

