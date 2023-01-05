import { FriendRecommendRequestDTO } from './../interfaces/friend/FriendRecommendRequestDTO';
import { PrismaClient } from "@prisma/client";
import { sc } from "../constants";

const prisma = new PrismaClient();

//* 친구에게 책 추천하기 
const recommendBookToFriend = async (friendRecommendRequestDTO: FriendRecommendRequestDTO, friendId: number) => {
    const book = await prisma.Book.findFirst({
        where: {
            bookTitle: friendRecommendRequestDTO.bookTitle
        },
    });


    const data = await prisma.Recommend.create({
        data: {
            bookId: book.id,
            recommendDesc: friendRecommendRequestDTO.recommendDesc,
            recommendedBy: friendId,
            recommendTo: 1,
        }
    })

    return data;
}

const friendService = {
    recommendBookToFriend,
}

export default friendService;