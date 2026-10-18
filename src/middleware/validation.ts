import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";

export const handleInputsErros = (req: Request, res: Response, next: NextFunction) => {

    // Valida que los datos ingrresados sean correctos
    let errors = validationResult(req);

    // Si hay errores, retornara un error 400 y el array de errores
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array()})
    }
    
    next(); // Si no hay errores, continua con la siguiente función

}

