import mongoose, { Schema, Document, PopulatedDoc } from 'mongoose';
import { ITask } from './Task';
import { Types } from 'mongoose';

// El type pertenece a TypeScript
export interface IProject extends Document {
    projectName: string;
    clientName: string;
    description: string
    // Relacion de las tareas con el proyecto
    // PopulatedDoc es un tipo que se usa para relacionar un documento con otro
    // ITask & Document es el tipo de dato que se va a relacionar
    // [] es para indicar que es un array de tareas
    tasks: PopulatedDoc<ITask & Document>[];
}

// El Schema pertenece a Mongoose
const ProjectSchema: Schema = new Schema({
    projectName: {
        type: String,
        required: true,
        trim: true
    },
    clientName: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    // Relacion de las tares de un proyecto
    // []: Array de Tareas
    // {}: Objeto de la tarea
    tasks: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Task'
        }
    ]
}, {timestamps: true}) // timestamps: true es para que se agreguen las fechas de creacion y actualizacion

const Project = mongoose.model<IProject>('Project', ProjectSchema)
export default Project;
