import { PrismaClient } from "@prisma/client";
import { RecommendGetDTO } from "../interfaces/recommend/RecommendGetDTO";
import dayjs from "dayjs";

const prisma = new PrismaClient();

//* 추천책 조회하기
const getRecommend = async () => {
    let recommendedList: RecommendGetDTO[] = [];
    let recommendingList: RecommendGetDTO[] = [];

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
                    profileImage: true
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


    const recommendedPromise = recommendedBook.map(async (data) => {
        const result = {
            recommendId: data.id,
            recommendDesc: data.recommendDesc,
            createdAt: dayjs(data.createdAt).format('YYYY-MM-DD'),
            friendId: data.recommendedByToUser.id,
            friendNickname: data.recommendedByToUser.nickname,
            friendImage: data.recommendedByToUser.profileImage,
            bookId: data.Book.id,
            bookTitle: data.Book.bookTitle,
            author: data.Book.author,
            bookImage: data.Book.bookImage
        }
        recommendedList.push(result);

    });
    await Promise.all(recommendedPromise);


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

    const recommendingPromise = recommendingBook.map(async (data) => {

        const result = {
            recommendId: data.id,
            recommendDesc: data.recommendDesc,
            createdAt: dayjs(data.createdAt).format('YYYY-MM-DD'),
            friendId: data.recommendToToUser.id,
            friendNickname: data.recommendToToUser.nickname,
            bookId: data.Book.id,
            bookTitle: data.Book.bookTitle,
            author: data.Book.author,
            bookImage: data.Book.bookImage
        }
        recommendingList.push(result);

    });
    await Promise.all(recommendedPromise);

    let data: { recommendedBook: object, recommendingBook: object } = {
        recommendedBook: recommendedList,
        recommendingBook: recommendingList
    }


    return data;

}

const recommendService = {
    getRecommend,
}


export default recommendService;