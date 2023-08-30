import { Router } from "express";
import { validateToken, decodeToken} from "../client/jwtClient.js";
import { getUserByEmail, getUsersByEmail, postEmail, getEmails, getNumMailsToday} from "../client/prismaClient.js";

const router = Router();

router.post("/sendEmail", async (req, res) => {
    const {subject, body, recivers} = req.body;
    const token = req.headers.authorization.split(" ")[1];
    
    try {
        await validateToken(token);
    } catch (error) {
        return res.status(403).send("Invalid token");
    }

    const decodedToken =  await decodeToken(token);
    const user = await getUserByEmail( decodedToken.username );

    const userTo = await getUsersByEmail(recivers);

    if ( await getNumMailsToday( user.id ) >= 10 ) {
        return res.status(400).send("You have reached the limit of 10 emails per day");
    }
    
    return res.status(200).send( await postEmail(user, subject, body, userTo) );
    
});

router.get("/getEmails", async (req, res) => {

    const token = req.headers.authorization.split(" ")[1];
    
    try {
        await validateToken(token);
    } catch (error) {
        return res.status(403).send("Invalid token");
    }

    const decodedToken =  await decodeToken(token);
    const user = await getUserByEmail( decodedToken.username );
    return res.status(200).send( await getEmails(user.id) );
    
});



export default router;

