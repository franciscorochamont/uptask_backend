import { NextFunction, Request, Response } from "express";
import Project, { IProject } from "../models/Project";

// Se declara global que modifica la interfaz Request de Express
declare global {
    // Usamos namespace para modificar la interface de Express
    namespace Express {
        // Extendemos la interface de Request para agregar el proyecto
        interface Request {
            project: IProject
        }
    }
}

export async function projectExist(req: Request, res: Response, next: NextFunction) {

    try{
        const { projectId } = req.params // Obtiene el ID del proyecto con el que se va a trabajar
        const project = await Project.findById(projectId) // Busca el proyecto en la base de datos

        // Si no existe el proyecto, retorna un Error 400
        if(!project){
            const error = new Error('Proyecto no encontrado')
            return res.status(404).json({ message: error.message })
        }
        req.project = project // Se asigna el proyecto al request
        next() // Pasa al siguiente middleware
    }catch(error){
        res.status(500).json({ message: 'Ocurrio un error'})
    }

}
