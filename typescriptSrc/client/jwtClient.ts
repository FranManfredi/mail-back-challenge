import {sign, verify, decode}  from "jsonwebtoken";

const secret = process.env.JWT_SECRET_KEY ?? "";


export async function generateToken( user: {role: string, email: string} ) {
    const token = sign( {role: user.role, username: user.email} , secret, {expiresIn: "1h"});
    return token; 
}

export async function validateToken( token: string ) {
    return verify(token, secret);
}

export async function decodeToken( token: string ) {
    return decode(token);
}

export default {generateToken, validateToken, decodeToken};