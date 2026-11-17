import { Request, Response } from 'express'
import Task from '../models/Task'
export class TaskController {

    // Crea un Tarea
    static createTask = async (req: Request, res: Response) => {

        try{
            const task = new Task(req.body)
            task.project = req.project._id // req.project._id -> Se usa req para obtener el proyecto
            req.project.tasks.push(task) // Se agrega la tarea al proyecto
            await Promise.all([task.save(),req.project.save()]) // Se gurdan los cambios en la base de datos
            res.send('Tarea creada correctamente')
        }catch(error){
            res.status(500).json({ message: 'Ocurrio un error'})
        }
    }

    // Obtiene todas las Tarea de un proycto
    static getProjectTasks = async (req: Request, res: Response) => {
        try{
            const task = await Task.find({ project: req.project._id}).populate('project')
            res.json(task)
        }catch(error){
            res.status(500).json({ message: 'Ocurrio un error'})
        }
    }

    // Obtine una Tarea por su ID
    static getTaskById = async (req: Request, res: Response) => {
        try{
            res.json(req.task)
        }catch(error){
            res.status(500).json({ message: 'Ocurrio un error'})
        }
    }
    
    // Actualiza una Tarea por su ID
    static updateTask = async (req: Request, res: Response) => {
        try{
            req.task.name = req.body.name
            req.task.description = req.body.description
            await req.task.save()
            res.send("Tarea actualizada correctamente")
        }catch(error){
            res.status(500).json({ message: 'Ocurrio un error'})
        }
    }

    // Elimina una Tarea por su ID
    static deleteTask = async (req: Request, res: Response) => {
        try{
            // Elimina la tarea del proyecto
            req.project.tasks = req.project.tasks.filter(task => task.toString() !== req.task._id.toString())
            // Elimina la tarea de la base de datos
            await Promise.all([ req.task.deleteOne(), req.project.save() ])

            res.send("Tarea eliminada correctamente")
        }catch(error){
            res.status(500).json({ message: 'Ocurrio un error'})
        }
    }

    // Actualiza el estado de una Tarea
    static updateStatus = async (req: Request, res: Response) => {
        try{
            // Obtiene el nuevo status del body de la petición
            const { status } = req.body
            // Le asigna el status a la tarea
            req.task.status = status
            // Guarda la tarea actualizada en la base de datos
            await req.task.save()
            res.send("Tarea Actualizada")
        }catch(error){
            res.status(500).json({ message: 'Ocurrio un error'})
        }
    }

}
