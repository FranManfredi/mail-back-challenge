import mailgun from "mailgun-js";
import {createTransport} from "nodemailer";

interface email { // Interfaz de la clase email
       sendEmails( email: string, subject: string, body: string, ids: number[], recivers: string[]): void;
}

export class mailgunEmail implements email { // Clase mailgunEmail que implementa la interfaz email

    mg = mailgun({ // Instancia de la clase mailgun
        apiKey: process.env.MAILGUN_API_KEY ?? "",
        domain: process.env.MAILGUN_DOMAIN ?? "",
    });

    // Función que envía los emails con la implementación de mailgun
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

export class nodeMailerEmail implements email { // Clase nodeMailerEmail que implementa la interfaz email

    transporter = createTransport({ // Instancia de la clase nodeMailer
        host: "outlook.com",
        auth: {
            user: process.env.SMTP_MAIL ?? "",
            pass: process.env.SMTP_PASS ?? ""
        }
    });

    // Función que envía los emails con la implementación de nodeMailer
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