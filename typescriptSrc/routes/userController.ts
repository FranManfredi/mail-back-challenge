import { Router } from "express";
import { validateToken, decodeToken} from "../client/jwtClient.js";
import { getUserByEmail, getUsersByEmail, postEmail, getEmails, getNumMailsToday} from "../client/prismaClient.js";
import mailgun = require('mailgun-js');
import nodemailer = require('nodemailer');

const router = Router();

const mg = mailgun({
    apiKey: process.env.MAILGUN_API_KEY ?? "",
    domain: process.env.MAILGUN_DOMAIN ?? "",
  });


const transporter = nodemailer.createTransport({
    host: "outlook.com",
    auth: {
        user: "franmanfredi@hotmail.com",
        pass: process.env.SMTP_PASS ?? ""
    }
});


router.post("/sendEmail", async (req, res) => {
    const {subject, body, recivers} : {subject: string, body: string, recivers:string[]} = req.body;
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

    const decodedToken =  await decodeToken(token) as {role: string, username: string};

    if ( !decodedToken ){
        return res.status(401).send("User not found");
    }

    const user = await getUserByEmail( decodedToken.username );

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
    , async (error, thisbody) => {
        if (error) {
            console.log(error);
            transporter.sendMail({
                from: `${user.email} <franmanfredi@hotmail.com>`,
                to: recivers,
                subject: subject,
                text: body
            }, async (err, info) => {
                if (err) {
                    console.log(err);
                    return res.status(400).send(err);
                }
                else {
                    console.log(info);
                    return res.status(200).send( await postEmail(user, subject, body, userTo));
                }
            });
        }
        else {
            console.log(thisbody);
            return res.status(200).send( await postEmail(user, subject, body, userTo) );
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

    const decodedToken =  await decodeToken(token) as {role: string, username: string};

    if ( !decodedToken ){
        return res.status(401).send("User not found");
    }

    const user = await getUserByEmail( decodedToken.username );

    if ( !user ){
        return res.status(401).send("User not found");
    }
    return res.status(200).send( await getEmails(user.id) );
    
});



export default router;

