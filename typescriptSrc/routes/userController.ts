import { Router } from "express";
import { getUserByEmail, getUsersByEmail, postEmail, getEmails, getNumMailsToday } from "../client/prismaClient.js";
import { mailgunEmail, nodeMailerEmail } from "../client/mailClient.js";

const mg = new mailgunEmail(); // Instancia de la clase mailgunEmail
const nm = new nodeMailerEmail(); // Instancia de la clase nodeMailerEmail

const router = Router();

router.post("/sendEmail", async (req, res) => {
  const { subject, body, recivers }: { subject: string, body: string, recivers: string[] } = req.body;

  const user: any = await getUserByEmail(req.body.decodedToken.username) ?? res.status(401).send("User not found");

  
  if (!subject || !body || !recivers) { // Comprueba que los campos no estén vacíos
    return res.status(400).send("Missing fields");
  }
  else if (typeof subject !== "string" || typeof body !== "string") { // Comprueba que los campos sean del tipo correcto
    return res.status(400).send("invalid fields");
  }
  else if (await getNumMailsToday(user.id) >= 10) { // Comprueba que el usuario no haya enviado más de 10 emails en el día
    return res.status(400).send("You have reached the limit of 10 emails per day");
  }

  try {

    const ids = (await getUsersByEmail(recivers)).map((user: any) => user.id); // Array de ids de los users a los que se les va a enviar el email (si existen TODOS los emails puestos)

    await trySendEmails(user.email, subject, body, ids, recivers, res); // Intenta enviar el correo electrónico con la implementación 'mg' o 'nm'

  }
  catch (error) {
    return res.status(400).send("One or more users not found"); // Si el array falla, devuelve una respuesta de error
  }
});

router.get("/getEmails", async (req, res) => { 

  const user: any = await getUserByEmail(req.body.decodedToken.username) ?? res.status(401).send("User not found"); // Comprueba que el usuario exista

  return res.status(200).send(await getEmails(user.id)); // Devuelve los emails del usuario

});

async function trySendEmails(email: string, subject: string, body: string, ids: number[], recivers: string[], res: any) {
  try {
    
    await mg.sendEmails(email, subject, body, ids, recivers);// Intenta enviar el correo electrónico con la implementación 'mg'
    
    return res.status(200).send(await postEmail(email, subject, body, ids));// Si tiene éxito, devuelve una respuesta exitosa
  } catch (mgError) { // Si falla, intenta con la implementación 'nm'
    console.log("Error with Mailgun:", mgError);
    try {

      await nm.sendEmails(email, subject, body, ids, recivers);  // Intenta enviar el correo electrónico con la implementación 'nm'

      return res.status(200).send(await postEmail(email, subject, body, ids)); // Si tiene éxito, devuelve una respuesta exitosa

    } catch (nmError) { // Si falla, devuelve una respuesta de error
      console.log("Error with NodeMailer:", nmError);

      return res.status(400).send("One or more users not found");// Si ambos intentos fallan, devuelve una respuesta de error

    }
  }
}

export default router;
