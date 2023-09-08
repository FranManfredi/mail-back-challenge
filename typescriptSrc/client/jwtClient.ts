import {sign, verify, decode}  from "jsonwebtoken";

const secret = process.env.JWT_SECRET_KEY ?? ""; // Clave secreta para la generación de tokens


export async function generateToken( user: {role: string, email: string} ) { // Función que genera un token con el usuario
    // Genera un token con el usuario y la clave secreta. se le pone un tiempo de expiración de 1 hora
    const token = sign( {role: user.role, username: user.email} , secret, {expiresIn: "1h"});
    return token; 
}

export async function validateToken( token: string ) { // Función que valida un token
    return verify(token, secret);
}

export async function decodeToken( token: string ) { // Función que decodifica un token sin validarlo
    return decode(token);
}

export default {generateToken, validateToken, decodeToken};