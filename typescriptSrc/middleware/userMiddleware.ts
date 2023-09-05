import { NextFunction , Request, Response} from "express";
import { validateToken, decodeToken } from "../client/jwtClient";

export default async function tokenValidation(req: Request, res: Response, next: NextFunction) {

    const myToken = req.headers.authorization ?? "";

    if (myToken  === "" ) {
        return res.status(403).send("Invalid token");
    }
    
    const token = myToken.split(" ")[1];
    
    try {
        await validateToken(token);
    } catch (error) {
        return res.status(403).send("Invalid token");
    }

    const decodedToken : any = await decodeToken( token ) ?? res.status(403).send("Invalid token");

    req.body.decodedToken = decodedToken;

    next();
}