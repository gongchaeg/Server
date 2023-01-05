import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

//* 추천책 조회하기
const getRecommend = async () => {
    //? 내가(userId:1) 추천받은책
    const recommendedBook = await prisma.recommend.findMany({
        where: {
            recommendTo: 1,
        },
        select: {
            id: true,
            recommendDesc: true,
            createdAt: true,
            recommendedByToUser: {
                select: {
                    id: true,
                    nickname: true,
                }
            },
            Book: {
                select: {
                    id: true,
                    bookTitle: true,
                    author: true,
                    bookImage: true,
                }
            }
        }
    })

    //? 내가 추천한책
    const recommendingBook = await prisma.recommend.findMany({
        where: {
            recommendedBy: 1,
        },
        select: {
            id: true,
            recommendDesc: true,
            createdAt: true,
            recommendToToUser: {
                select: {
                    id: true,
                    nickname: true,
                }
            },
            Book: {
                select: {
                    id: true,
                    bookTitle: true,
                    author: true,
                    bookImage: true,
                }
            }
        }
    })

    let data: { recommendedBook: object, recommendingBook: object } = {
        recommendedBook: recommendedBook,
        recommendingBook: recommendingBook
    }


    return data;

}

const recommendService = {
    getRecommend,
}


export default recommendService;