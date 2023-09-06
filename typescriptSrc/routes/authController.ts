import {Router} from "express";
import {hash, compare} from 'bcrypt';
import {getUserByEmail, postUser} from "../client/prismaClient.js";
import { generateToken } from "../client/jwtClient.js";

const router = Router();

router.post("/register", async (req, res) => {
    const {email , password}:{email:string, password:string} = req.body;

    if (email == null || password == null || typeof email !== "string" || typeof password !== "string") {
        return res.status(400).send("Invalid email or password");
    }
    else if ( await getUserByEmail(email) != null ) {
        return res.status(401).send("User already exists");
    }

    const newPassword: string = await hash(password, 10);
    const myUser = await postUser(email, newPassword)
    const token = await generateToken( myUser );
    res.send(token);
});

router.get("/login", async (req, res) => {
    const { email, password }:{email:string, password:string} = req.body;
    if (email == null || password == null || typeof email !== "string" || typeof password !== "string") {
        return res.status(400).send("Invalid email or password");
    }
    const user = await getUserByEmail(email);
    if (!user) {
        return res.status(401).send("Invalid username or password");
    }
    else if (!await compare(password, user.password)) {
        return res.status(401).send("Invalid username or password");
    }
    const token = await generateToken( user );
    res.send(token);
});


export default router;