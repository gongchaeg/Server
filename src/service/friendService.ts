import { FriendReportRequestDTO } from './../interfaces/friend/FriendReportRequestDTO';
import { FriendRecommendRequestDTO } from './../interfaces/friend/FriendRecommendRequestDTO';
import { PrismaClient } from "@prisma/client";
import { sc } from "../constants";
import userService from './userService';
import { UserDTO } from '../interfaces/user/UserDTO';

const prisma = new PrismaClient();

//* [POST] 친구에게 책 추천하기 
const recommendBookToFriend = async (friendRecommendRequestDTO: FriendRecommendRequestDTO, friendId: number, auth: number) => {
    //* 존재하는 책인지 확인하기
    const books = await prisma.book.findFirst({
        where: {
            bookTitle: friendRecommendRequestDTO.bookTitle,
            author: friendRecommendRequestDTO.author,
            publisher: friendRecommendRequestDTO.publisher
        },
    });

    let bookId = books?.id as number;

    //? 책이 없는 경우 책 생성해주기
    if (books == null) {
        const data = await prisma.book.create({
            data: {
                bookTitle: friendRecommendRequestDTO.bookTitle,
                author: friendRecommendRequestDTO.author,
                bookImage: friendRecommendRequestDTO.bookImage,
                publisher: friendRecommendRequestDTO.publisher
            }
        })
        bookId = data.id
    }

    //* 친구 존재하는지 확인 후 없는 경우 추천 못 하도록 하기
    const friendData = await prisma.friend.findFirst({
        where: {
            receiverId: friendId
        }
    })

    //? 친구 없는 경우
    if (friendData == null) {
        return sc.NOT_FOUND;
    }

    const recommendData = await prisma.recommend.create({
        data: {
            bookId: bookId,
            recommendDesc: friendRecommendRequestDTO.recommendDesc,
            recommendedBy: auth,
            recommendTo: friendId,
        },
    })

    //알림 테이블에도 추가
    const alarm = await prisma.alarm.create({
        data: {
            senderId: auth,
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

    const result = {
        recommendId: recommendData.id
    }

    return result;
}

//* [GET] 사용자 검색하기
const searchUser = async (nickname: string, auth: number) => {
    const user = await prisma.user.findFirst({
        where: {
            nickname: {
                equals: nickname,
                mode: 'insensitive'
            },
        }
    });

    if (user == null) {
        return null;
    }

    let isFollowed: boolean = false;

    const followed = await prisma.friend.findFirst({
        where: {
            senderId: auth,
            receiverId: user?.id
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

//* [POST] 팔로우 하기
const followFriend = async (friendId: number, auth: number) => {
    const followData = await prisma.friend.findFirst({
        where: {
            receiverId: friendId,
            senderId: auth
        },
        select: {
            followId: true
        }
    })

    // 이미 사용자가 있는 경우 
    if (followData != null) {
        return null;
    }

    const data = await prisma.friend.create({
        data: {
            receiverId: friendId,
            senderId: auth,
        }
    });

    // 알림 테이블에도 추가
    await prisma.alarm.create({
        data: {
            senderId: auth,
            receiverId: friendId,
            typeId: 1
        }
    });
    return data;


}

//* [DELETE] 팔로우 취소하기
const deleteFollowFriend = async (friendId: number, auth: number) => {
    const data = await prisma.friend.deleteMany({
        where: {
            receiverId: friendId,
            senderId: auth
        }
    })
    return data;
}

//* [GET] 내가 팔로우 하는 친구 리스트 가져오기
const getFollowingIdList = async (auth: number) => {
    const friendIdList = await prisma.friend.findMany({
        where: {
            senderId: auth
        },
        select: {
            receiverId: true
        },
        orderBy: {
            receiverId: "asc"
        }
    });

    return friendIdList;
}

//* [GET] 나를 팔로우 하는 친구 리스트 가져오기
const getFollowerIdList = async (auth: number) => {
    const friendIdList = await prisma.friend.findMany({
        where: {
            receiverId: auth
        },
        select: {
            senderId: true
        }
    });

    return friendIdList;
}

//* [GET] 친구 리스트 정보 가져오기
const getFriendInfoList = async (auth: number) => {
    let friendList: UserDTO[] = [];
    const friendIdList = await getFollowingIdList(auth);

    for (const user of friendIdList) {
        const userId = user.receiverId;
        const friend = await userService.getUser(userId);

        friendList?.push(friend);
    }

    return friendList;
}

//* [GET] 팔로우 조회
const isFriend = async (userId: number, friendId: number) => {
    const result = await prisma.friend.findFirst({
        where: {
            receiverId: friendId,
            senderId: userId
        }
    });

    return result;
}

//* [POST] 친구 신고하기
const postReport = async (userId: number, friendId: number, friendReportRequestDto: FriendReportRequestDTO) => {

    // 특정 이유 적은 경우
    if (!friendReportRequestDto.etc) {
        const reportResult = await prisma.report.create({
            data: {
                userId: userId,
                friendId: friendId,
                reasonIndex: friendReportRequestDto.reasonIndex
            }
        });

        return reportResult;
    }

    // 특정 이유 안적은 경우
    const reportResult = await prisma.report.create({
        data: {
            userId: userId,
            friendId: friendId,
            reasonIndex: friendReportRequestDto.reasonIndex,
            etc: friendReportRequestDto.etc
        }
    });

    return reportResult;
}

const friendService = {
    recommendBookToFriend,
    searchUser,
    followFriend,
    deleteFollowFriend,
    getFriendInfoList,
    getFollowingIdList,
    getFollowerIdList,
    isFriend,
    postReport,
}

export default friendService;