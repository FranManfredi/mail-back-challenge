import { NextFunction , Request, Response} from "express";

export default async function tokenValidation(req: Request, res: Response, next: NextFunction) {

    if (req.body.decodedToken.role !== "ADMIN") {
        return res.status(403).send("Invalid token");
    }

    next();
}