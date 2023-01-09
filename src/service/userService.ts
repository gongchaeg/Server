import { PrismaClient } from "@prisma/client";
import { UserDTO } from "../interfaces/user/UserDTO";

const prisma = new PrismaClient();

const getUser = async (userId : number) : Promise<UserDTO> => {
    const userData = await prisma.user.findFirst({
        where : {
            id: userId
        },
        select : {
            id : true,
            nickname : true,
            profileImage : true
        }
    });
    if (!userData) throw new Error('no user!');

    return userData;
}

const userService = {
    getUser
};

export default userService;