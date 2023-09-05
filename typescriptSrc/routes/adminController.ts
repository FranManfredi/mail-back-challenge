import { Router } from "express";
import { getStats } from "../client/prismaClient.js";

const router = Router();

router.get("/stats", async (req, res) => {

    return res.status(200).send( await getStats() );
    
});

export default router;

