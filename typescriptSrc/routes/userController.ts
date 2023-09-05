import { Router } from "express";
import { getUserByEmail, getUsersByEmail, postEmail, getEmails, getNumMailsToday} from "../client/prismaClient.js";
import mailgun = require("mailgun-js");
import {createTransport} from "nodemailer";
import { isTypeOfExpression } from "typescript";

const router = Router();

const mg = mailgun({
    apiKey: process.env.MAILGUN_API_KEY ?? "",
    domain: process.env.MAILGUN_DOMAIN ?? "",
  });


const transporter = createTransport({
    host: "outlook.com",
    auth: {
        user: process.env.SMTP_MAIL ?? "",
        pass: process.env.SMTP_PASS ?? ""
    }
});

async function sendEmails( email: string, subject: string, body: string, ids: number[], recivers: string[], res: any ){

    await mg.messages().send({
        from: `${email} <${email}>`,
        to: recivers,
        subject: subject,
        text: body
    }
    , async (error, thisbody) => {
        if (error) {
            console.log(error);
            transporter.sendMail({
                from: `${email} <${process.env.SMTP_MAIL ?? ""}>`,
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
                    return res.status(200).send( await postEmail(email, subject, body, ids));
                }
            });
        }
        else {
            console.log(thisbody);
            return res.status(200).send( await postEmail(email, subject, body, ids) );
        }
    })

}

router.post("/sendEmail", async (req, res) => {
    const {subject, body, recivers} : {subject: string, body: string, recivers:string[]} = req.body;

    const user : any = await getUserByEmail( req.body.decodedToken.username ) ?? res.status(401).send("User not found");

    if ( !subject || !body || !recivers ) {
        return res.status(400).send("Missing fields");
    }
    else if ( typeof subject !== "string" || typeof body !== "string" ) {
        return res.status(400).send("invalid fields");
    }
    else if (await getNumMailsToday( user.id ) >= 10 ) {
        return res.status(400).send("You have reached the limit of 10 emails per day");
    }

    try {

        const ids =  (await getUsersByEmail(recivers)).map((user: any) => user.id); // Array of ids from users

        sendEmails(user.email, subject, body, ids, recivers, res);

    }
    catch (error) {
        return res.status(400).send("One or more users not found");
    }});

router.get("/getEmails", async (req, res) => {

    const user : any = await getUserByEmail( req.body.decodedToken.username ) ?? res.status(401).send("User not found");

    return res.status(200).send( await getEmails(user.id) );
    
});


export default router;
