import { NextFunction , Request, Response} from "express";
import { validateToken, decodeToken } from "../client/jwtClient";

export default async function tokenValidation(req: Request, res: Response, next: NextFunction) {

    const myToken = req.headers.authorization ?? ""; // Obtiene el token de los headers

    if (myToken  === "" ) { // Comprueba que el token no esté vacío
        return res.status(403).send("Invalid token");
    }
    
    const token = myToken.split(" ")[1]; // Separa el token del "Bearer "
    
    try {
        await validateToken(token); // Valida el token
    } catch (error) {
        return res.status(403).send("Invalid token"); // Si falla, devuelve una respuesta de error
    }

    const decodedToken : any = await decodeToken( token ) ?? res.status(403).send("Invalid token"); // Decodifica el token y lo guarda en una variable o devuelve una respuesta de error

    req.body.decodedToken = decodedToken; // Guarda el token decodificado en el body

    next(); // Continua con el siguiente middleware
}