import {Router} from "express";
import {hash, compare} from 'bcrypt';
import {getUserByEmail, postUser} from "../client/prismaClient.js";
import { generateToken } from "../client/jwtClient.js";

const router = Router();

router.post("/register", async (req, res) => {
    const {email , password}:{email:string, password:string} = req.body;

    if (email == null || password == null || typeof email !== "string" || typeof password !== "string") { // Comprueba que los campos no estén vacíos y que los tipos sean los correctos
        return res.status(400).send("Invalid email or password"); // Si no, devuelve una respuesta de error
    }
    else if ( await getUserByEmail(email) != null ) { // Comprueba que el usuario no exista
        return res.status(401).send("User already exists"); // Si existe, devuelve una respuesta de error
    }
    // si todo esta bien el programa sigue y asume que el usuario no existe y que los campos no estan vacios 

    const newPassword: string = await hash(password, 10); // Encripta la contraseña
    const myUser = await postUser(email, newPassword) // Crea el usuario en la base de datos
    const token = await generateToken( myUser ); // Genera un token con el usuario
    res.send(token); // Devuelve el token
});

router.get("/login", async (req, res) => {
    const { email, password }:{email:string, password:string} = req.body;
    if (email == null || password == null || typeof email !== "string" || typeof password !== "string") {  // Comprueba que los campos no estén vacíos y que los tipos sean los correctos
        return res.status(400).send("Invalid email or password"); // Si no, devuelve una respuesta de error
    }
    const user = await getUserByEmail(email); // Busca el usuario por email
    if (!user) {
        return res.status(401).send("Invalid username or password"); // Si no existe, devuelve una respuesta de error
    }
    else if (!await compare(password, user.password)) {
        return res.status(401).send("Invalid username or password"); // Si la contraseña no coincide, devuelve una respuesta de error
    }
    const token = await generateToken( user ); // Genera un token con el usuario si esta todo bien
    res.send(token); // Devuelve el token
});


export default router;