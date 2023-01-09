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

    let bookId = books?.id as number;

    //* 책이 없는 경우 책 생성해주기
    if (books == null) {
        const data = await prisma.book.create({
            data: {
                bookTitle: friendRecommendRequestDTO.bookTitle,
                author: friendRecommendRequestDTO.author,
                bookImage: friendRecommendRequestDTO.bookImage
            }
        })
        bookId = data.id
    }

    const recommendData = await prisma.recommend.create({
        data: {
            bookId: bookId,
            recommendDesc: friendRecommendRequestDTO.recommendDesc,
            recommendedBy: 1,
            recommendTo: friendId,
        },
    })

    //알림 테이블에도 추가
    const alarm = await prisma.alarm.create({
        data: {
            senderId: 1,
            receiverId: friendId,
            typeId: 2
        }
    });

    await prisma.recommendAlarm.create({
        data: {
            alarmId: alarm.id,
            recommendId: recommendData.id
        }
    });

    return recommendData;
}

//* 사용자 검색하기
const searchUser = async (nickname: string) => {
    const user = await prisma.user.findFirst({
        where: {
            nickname: nickname,
        },
    });

    if (user == null) {
        return null;
    }

    let isFollowed: boolean = false;

    const followed = await prisma.friend.findFirst({
        where: {
            receiverId: 1,
            senderId: user?.id
        },
        select: {
            followId: true
        }
    })

    if (followed?.followId != null) {
        isFollowed = true;
    }

    const data = {
        friendId: user.id,
        nickname: user.nickname,
        profileImage: user.profileImage,
        isFollowed: isFollowed
    }

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

    // 알림 테이블에도 추가
    await prisma.alarm.create({
        data: {
            senderId: 1,
            receiverId: friendId,
            typeId: 1
        }
    });

    return data;
}

//* 팔로우 취소하기
const deleteFollowFriend = async (friendId: number) => {
    const data = await prisma.friend.deleteMany({
        where: {
            receiverId: friendId,
            senderId: 1
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