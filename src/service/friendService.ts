import { FriendRecommendRequestDTO } from './../interfaces/friend/FriendRecommendRequestDTO';
import { PrismaClient } from "@prisma/client";
import { sc } from "../constants";

const prisma = new PrismaClient();

//* 친구에게 책 추천하기 
const recommendBookToFriend = async (friendRecommendRequestDTO: FriendRecommendRequestDTO, friendId: number) => {
    const books = await prisma.book.findFirst({
        where: {
            bookTitle: friendRecommendRequestDTO.bookTitle
        },
    });


    const data = await prisma.recommend.create({
        data: {
            bookId: books.id,
            recommendDesc: friendRecommendRequestDTO.recommendDesc,
            recommendedBy: 1,
            recommendTo: friendId,
        },
    })

    return data;
}

//* 사용자 검색하기
const searchUser = async (nickname: string) => {
    const data = await prisma.user.findFirst({
        where: {
            nickname: nickname
        },
    });

    return data;
}

//* 팔로우 하기
const followFriend = async (friendId: number) => {
    const data = await prisma.friend.create({
        data: {
            receiverId: friendId,
            senderId: 1,
        }
    });

    return data;
}

//* 팔로우 취소하기
const deleteFollowFriend = async (friendId : number) => {
    const data = await prisma.friend.deleteMany({
        where : {
            receiverId : friendId,
            senderId : 1
        }
    })
    return data;
}

const friendService = {
    recommendBookToFriend,
    searchUser,
    followFriend,
    deleteFollowFriend
}

export default friendService;