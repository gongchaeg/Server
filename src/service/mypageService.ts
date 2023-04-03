import { PrismaClient } from "@prisma/client";
import { patchUserRequestDTO } from "../interfaces/mypage/patchUserRequestDTO";

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

const patchUser = async (userId: number, patchUserRequestDTO: patchUserRequestDTO) => {
    if (!patchUserRequestDTO.intro) {
        patchUserRequestDTO.intro = "";
    }

    if (!patchUserRequestDTO.profileImage) {
        const data = await prisma.user.update({
            where: {
                id: userId
            },
            data: {
                nickname: patchUserRequestDTO.nickname,
                intro: patchUserRequestDTO.intro
            }
        })
        return data;
    }

    const data = await prisma.user.update({
        where: {
            id: userId
        },
        data: {
            nickname: patchUserRequestDTO.nickname,
            profileImage: patchUserRequestDTO.profileImage,
            intro: patchUserRequestDTO.intro
        }
    })

    return data;
}

const mypageService = {
    deleteUser,
    patchUser
}


export default mypageService;