import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const deleteUser = async (userId: number) => {
    const userDelete = await prisma.user.deleteMany({
        where: {
            id: userId
        }
    });

    if (!userDelete) throw new Error('no user!');

    return userDelete;
}

const mypageService = {
    deleteUser,
}

export default mypageService;