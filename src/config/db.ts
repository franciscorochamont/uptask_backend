import mongoose from "mongoose";
import colors from 'colors';
import { exit  } from 'node:process'

export const connectDB = async () => {
    try {
        // Conecta con la base de datos
        const {connection} = await mongoose.connect(process.env.DATABASE_URL)
        const url = `${connection.host}:${connection.port}`
        console.log(colors.magenta.bold(`MongoDB conectado en: ${url}`));
    } catch (error) {
        console.log(colors.red.bold(error.message));
        exit(1); // 1 Es error y que termine el proceso 0 es exitoso
    }

}

