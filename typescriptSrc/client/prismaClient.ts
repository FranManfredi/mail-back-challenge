import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function postUser(email: string, password: string) {
    const newUser = await prisma.user.create({
        data: {
            email,
            password,
        },
    });
    return newUser;
}

export async function getUserByEmail(email: string) {
    const user = await prisma.user.findUnique({
        where: {
        email: email,
        },
    });
    return user;
}

export async function getUsersByEmail(emails: string[]) {
    const users = await prisma.user.findMany({
        where: {
            email: {
                in: emails
            }
        },
    });
    return users;
}

export async function getNumMailsToday(id: number){

    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
    const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
    
    const mails = await prisma.mails.findMany({
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

export async function postEmail(from: {id: number}, subject: string, body: string, to : {id: number}[]) {
    const newEmail = await prisma.mails.create({
        data: {
            from: {
                connect: { id: from.id }
            },
            subject: subject,
            body,
            to: {
                createMany: {
                    data: to.map((user) => ({userId: user.id}))
                }
            }
        },
    });
    return newEmail;
}

export async function getEmails(id: number) {
    const emails = await prisma.mails.findMany({
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
        const users = await prisma.user.findMany({
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
        
        const mailCountsByUser = users.map(user => ({
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