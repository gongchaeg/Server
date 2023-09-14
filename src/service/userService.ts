import { PrismaClient } from "@prisma/client";
import { IntroDTO } from "../interfaces/user/IntroDTO";
import { UserDTO } from "../interfaces/user/UserDTO";
import { UserDuplicateDTO } from "../interfaces/user/UserDuplicateDTO";

const prisma = new PrismaClient();

//* 사용자 조회
const getUser = async (userId: number): Promise<UserDTO> => {
    const userData = await prisma.user.findFirst({
        where: {
            id: userId
        },
        select: {
            id: true,
            nickname: true,
            profileImage: true
        }
    });
    if (!userData) throw new Error('no user!');

    return userData;
}

//* 사용자 정보 조회
const getUserIntro = async (userId: number) => {
    const userIntro: IntroDTO | null = await prisma.user.findUnique({
        where: {
            id: userId
        },
        select: {
            id: true,
            nickname: true,
            profileImage: true,
            intro: true
        }
    });
    if (!userIntro) throw new Error('no userIntro!');

    return userIntro;
}

//* 유저닉네임 중복 검사
const postDuplicateNickname = async (userId: number, nickname: string) => {
    let isExisted = 1;

    const lowercaseNickname: string = nickname.toLowerCase();

    const userCheck = await prisma.user.findFirst({
        where: {
            nickname: {
                equals: lowercaseNickname,
                mode: "insensitive"
            }
        },
        select: {
            nickname: true
        }
    });

    if (!userCheck) {
        isExisted = 0;
    };

    const data = {
        check: isExisted
    }
    return data;
}

//* refreshToken으로 유저 검색
const getUserByRfToken = async (refreshToken: string) => {
    const user = prisma.user.findFirst({
        where: {
            refresh_token: refreshToken
        }
    });

    return user;
}


const userService = {
    getUser,
    getUserIntro,
    postDuplicateNickname,
    getUserByRfToken
};

export default userService;