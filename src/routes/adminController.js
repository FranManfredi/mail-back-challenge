import { Router } from "express";
import { validateToken, decodeToken} from "../client/jwtClient.js";
import { getStats } from "../client/prismaClient.js";

const router = Router();

router.get("/stats", async (req, res) => {
    const token = req.headers.authorization.split(" ")[1];
    try {
        await validateToken(token);
    } catch (error) {
        return res.status(403).send("Invalid token");
    }
    const decodedToken =  await decodeToken(token);
    if (decodedToken.role !== "ADMIN") {
        return res.status(403).send("Invalid role");
    }

    return res.status(200).send( await getStats() );
    
});

export default router;

