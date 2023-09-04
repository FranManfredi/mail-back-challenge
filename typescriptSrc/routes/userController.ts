import { Router } from "express";
import { validateToken, decodeToken} from "../../src/client/jwtClient.js";
import { getUserByEmail, getUsersByEmail, postEmail, getEmails, getNumMailsToday} from "../../src/client/prismaClient.js";
import mailgun from 'mailgun-js';

const router = Router();

const mg = mailgun({
    apiKey: process.env.MAILGUN_API_KEY ?? "",
    domain: process.env.MAILGUN_DOMAIN ?? "",
  });

router.post("/sendEmail", async (req, res) => {
    const {subject, body, recivers} = req.body;
    const ftoken = req.headers.authorization ?? "";
    if (ftoken === "") {
        return res.status(403).send("Invalid token");
    }
    const token = ftoken.split(" ")[1];
    
    try {
        await validateToken(token);
    } catch (error) {
        return res.status(403).send("Invalid token");
    }

    const decodedToken =  await decodeToken(token);

    const user = await getUserByEmail( decodedToken?.username );

    const userTo = await getUsersByEmail(recivers);

    if ( !user ){
        return res.status(401).send("User not found");
    }

    if ( await getNumMailsToday( user.id ) >= 10 ) {
        return res.status(400).send("You have reached the limit of 10 emails per day");
    }

    await mg.messages().send({
        from: `emailChallenge <${user.email}>`,
        to: recivers,
        subject: subject,
        text: body
    }
    , (error, body) => {
        if (error) {
            console.log(error);
            res.status(500).send(error);
        }
        else {
            console.log(body);
            return res.status(200).send( postEmail(user, subject, body, userTo) );
        }
    })
});

router.get("/getEmails", async (req, res) => {

    const ftoken = req.headers.authorization ?? "";
    if (ftoken === "") {
        return res.status(403).send("Invalid token");
    }
    const token = ftoken.split(" ")[1];
    
    try {
        await validateToken(token);
    } catch (error) {
        return res.status(403).send("Invalid token");
    }

    const decodedToken =  await decodeToken(token);

    const user = await getUserByEmail( decodedToken?.username );

    if ( !user ){
        return res.status(401).send("User not found");
    }
    return res.status(200).send( await getEmails(user.id) );
    
});



export default router;

