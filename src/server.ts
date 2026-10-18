import express from 'express'
import { connectDB } from './config/db';
import dotenv from 'dotenv';
import ProjectRoutes from './routes/projectRoutes';

// Configura el entorno
dotenv.config()

// Conecta la base de datos
connectDB();

// Crea el servidor
const app = express()

// Permite el uso de JSON en las peticiones
app.use(express.json())

// Define las rutas
app.use('/api/projects', ProjectRoutes)

export default app;
