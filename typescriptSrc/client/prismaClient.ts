import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function postUser(email: string, password: string) {
    const newUser = await prisma.user.create({ // Crea el usuario en la base de datos
        data: {
            email,
            password,
        },
    });
    return newUser;
}

export async function getUserByEmail(email: string) {
    const user = await prisma.user.findUnique({ // Busca el usuario por email
        where: {
        email: email,
        },
    });
    return user;
}

export async function getUsersByEmail(emails: string[]) {
    const users = await prisma.user.findMany({ // Busca multiples usuarios por email
        where: {
            email: {
                in: emails
            }
        },
    });
    if (users.length != emails.length) {
        throw new Error("invalid recivers");
    }
    return users;
}

export async function getNumMailsToday(id: number){

    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
    const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
    
    const mails = await prisma.mails.findMany({ // Busca los emails del usuario en el día
        where: {
            from: {
                id: id
            },
            createdAt: { 
                gte: startOfToday,
                lte: endOfToday
            }
        }
    })
    return mails.length;
} 

export async function postEmail(from: string, subject: string, body: string, to : number[]) {
    const newEmail = await prisma.mails.create({ // Crea el email en la base de datos
        data: {
            from: {
                connect: { email: from }
            },
            subject: subject,
            body,
            to: {
                createMany: {
                    data: to.map((ids) => ({userId: ids}))
                }
            }
        },
    });
    return newEmail;
}

export async function getEmails(id: number) {
    const emails = await prisma.mails.findMany({ // Busca los emails del usuario
        where: {
            to: {
                some: {
                    userId: {
                        equals: id
                    }
                }
            }   
        },
        select:{
            id: true,
            subject: true,
            body: true,
            from: {
                select: {
                    email: true
                }
            }
        }
    });
    return emails;
}

export async function getStats() {

    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
    const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);


    try {
        const users = await prisma.user.findMany({ // Busca los usuarios que mandaron emails en el día
            select: {
            id: true,
            email: true,
            mails: {
                select: {
                    createdAt: true,
            }},
            },
            where: {
                mails:{
                    some: {
                        createdAt: {
                            gte: startOfToday,
                            lte: endOfToday
                        }
                    }
                }
            }
        });
        
        const mailCountsByUser = users.map(user => ({ // Crea un array con los usuarios y la cantidad de emails que mandaron en el día (excluye los usuarios que no mandaron emails y los mails que no fueron mandados en el día)
            userId: user.id,
            email: user.email,
            mailCount: {
                count: user.mails.filter(mail => mail.createdAt >= startOfToday && mail.createdAt <= endOfToday).length,
            },
        }));

        return mailCountsByUser;
    } 
    catch (error) {
        console.error('Error:', error);
    } 
}

export default prisma;