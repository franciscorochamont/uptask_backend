import { NextFunction, Request, Response } from "express";
import Task, { ITask } from "../models/Task";

// Se declara global que modifica la interfaz Request de Express
declare global {
    // Usamos namespace para modificar la interface de Express
    namespace Express {
        // Extendemos la interface de Request para agregar el proyecto
        interface Request {
            task: ITask
        }
    }
}

export async function taskExist(req: Request, res: Response, next: NextFunction) {

    try{
        const { taskId } = req.params // Obtiene el ID del proyecto con el que se va a trabajar
        const task = await Task.findById(taskId) // Busca el proyecto en la base de datos

        // Si no existe el proyecto, retorna un Error 400
        if(!task){
            const error = new Error('Tarea no encontrado')
            return res.status(404).json({ message: error.message })
        }
        req.task = task // Se asigna el proyecto al request
        next() // Pasa al siguiente middleware
    }catch(error){
        res.status(500).json({ message: 'Ocurrio un error'})
    }

}

export function taskBelongsToProject(req: Request, res: Response, next: NextFunction) {
    // Verifica que la tarea perteneza al proyecto
    // task.project.toString() es el id del proyecto al que pertenece la tarea
    // req.project._id.toString() es el id del proyecto
    if(req.task.project.toString() !== req.project._id.toString()){
        const error = new Error('No tienes permisos para acceder a esta tarea')
        return res.status(400).json({ error: error.message})
    }
    next()
}


