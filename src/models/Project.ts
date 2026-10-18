import mongoose, { Schema, Document } from 'mongoose';

// El type pertenece a TypeScript
export type ProjectType =  Document & {
    projectName: string;
    clientName: string;
    description: string
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
    }
})

const Project = mongoose.model('Project', ProjectSchema)
export default Project;