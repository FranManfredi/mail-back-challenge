import {Router} from "express";
import * as bcrypt from 'bcrypt';

import {getUserByEmail, postUser} from "../client/prismaClient.js";
import { generateToken } from "../client/jwtClient.js";

const bit = bcrypt;
const router = Router();


router.post("/register", async (req, res) => {
    const {email , password}:{email:string, password:string} = req.body;
    const user = await getUserByEmail(email);
    if ( user ) {
        return res.status(401).send("User already exists");
    }
    const newPassword: string = await bit.hash(password, 10);
    const myUser = await postUser(email, newPassword)
    const token = await generateToken( myUser );
    res.send(token);
});

router.get("/login", async (req, res) => {
    const { email, password }:{email:string, password:string} = req.body;
    const user = await getUserByEmail(email);
    if (!user) {
        return res.status(401).send("Invalid username or password");
    }
    else if (!await bit.compare(password, user.password)) {
        return res.status(401).send("Invalid username or password");
    }
    const token = await generateToken( user );
    res.send(token);
});


export default router;