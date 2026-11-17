import mongoose from 'mongoose';
import { Schema, Document, Types } from 'mongoose';

// Estatus de la Tareas
const taskStatus = {
   PENDING: 'pending',
   ON_HOLD: 'onHold',
   IN_PROGRESS: 'inProgress',
   UNDER_REVIEW: 'underReview',
   COMPLETED: 'completed'
} as const

export type TaskStatus = typeof taskStatus[keyof typeof taskStatus]

export interface ITask extends Document {
    name: string;
    description: string;
    project: Types.ObjectId;
    status: TaskStatus;
}

const TaskSchema = new Schema({
    name: {
        type: String,
        trim: true,
        required: true,
    },
    description: {
        type: String,
        trim: true,
        required: true
    },
    project: {
        type: Schema.Types.ObjectId,
        ref: 'Project'
    },
    status: {
        type: String,
        enum: Object.values(taskStatus), // Enum para los estatus de la tarea
        default: taskStatus.PENDING
    }
}, {timestamps: true}) // timestamps: true es para que se agreguen las fechas de creacion y actualizacionz

const Task = mongoose.model<ITask>('Task', TaskSchema);
export default Task;
