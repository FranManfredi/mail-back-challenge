import { NextFunction , Request, Response} from "express";

export default async function tokenValidation(req: Request, res: Response, next: NextFunction) {

    if (req.body.decodedToken.role !== "ADMIN") { // Comprueba que el usuario sea administrador
        return res.status(403).send("Invalid token"); // Si no, devuelve una respuesta de error
    }

    next(); // Continua con el siguiente middleware
}