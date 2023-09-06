import mailgun from "mailgun-js";
import {createTransport} from "nodemailer";

interface email {
       sendEmails( email: string, subject: string, body: string, ids: number[], recivers: string[]): void;
}

export class mailgunEmail implements email {

    mg = mailgun({
        apiKey: process.env.MAILGUN_API_KEY ?? "",
        domain: process.env.MAILGUN_DOMAIN ?? "",
    });

    async sendEmails(email: string, subject: string, body: string, ids: number[], recivers: string[]): Promise<void> {
        try{
            await this.mg.messages().send({
            from: `${email} <${email}>`,
            to: recivers,
            subject: subject,
            text: body
            });
        }
        catch (error) {
            throw new Error("One or more users not found");
        }
    }

}

export class nodeMailerEmail implements email {

    transporter = createTransport({
        host: "outlook.com",
        auth: {
            user: process.env.SMTP_MAIL ?? "",
            pass: process.env.SMTP_PASS ?? ""
        }
    });

    async sendEmails(email: string, subject: string, body: string, ids: number[], recivers: string[]): Promise<void> {
        try{
            await this.transporter.sendMail({
                from: `${email} <${process.env.SMTP_MAIL ?? ""}>`,
                to: recivers,
                subject: subject,
                text: body
            });

        }
        catch (error) {
            throw new Error("One or more users not found");
        }
    }
}