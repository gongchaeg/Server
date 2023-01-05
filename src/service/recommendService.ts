import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

//* 추천책 조회하기
const getRecommend = async () => {
    let data: object[] = [];

    //? 내가(userId:1) 추천받은책
    const recommendedBook = await prisma.recommend.findMany({
        where: {
            recommendTo: 1,
        },
        select: {
            id: true,
            recommendDesc: true,
            bookId: true,
            recommendedBy: true,
            createdAt: true,
            User_Recommend_recommendedByToUser: {
                select: {
                    nickname: true,
                }
            },
            Book: {
                select: {
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
            bookId: true,
            recommendTo: true,
            createdAt: true,
            User_Recommend_recommendedByToUser: {
                select: {
                    nickname: true,
                }
            },
            Book: {
                select: {
                    bookTitle: true,
                    author: true,
                    bookImage: true,
                }
            }
        }
    })


    data.push(recommendedBook);
    data.push(recommendingBook);
    return data;

}

const recommendService = {
    getRecommend,
}


export default recommendService;