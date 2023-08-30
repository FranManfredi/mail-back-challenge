import JsonWebToken  from "jsonwebtoken";

const jwt = JsonWebToken;
const secret = process.env.JWT_SECRET_KEY;


export async function generateToken( user ) {
    const token = jwt.sign( {role: user.role, username: user.email} , secret, {expiresIn: "1h"});
    return token; 
}

export async function validateToken( token ) {
    return jwt.verify(token, secret);
}

export async function decodeToken( token ) {
    return jwt.decode(token);
}

export default jwt;