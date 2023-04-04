import { PrismaClient } from "@prisma/client";
import friendService from "./friendService";
import { UserDTO } from "../interfaces/user/UserDTO";
import userService from "./userService";

const prisma = new PrismaClient();

//* [POST] 친구 차단하기
const blockFriend = async (userId: number, friendId: number) => {
    const data = await prisma.block.create({
        data : {
            userId : userId,
            friendId : friendId
        }
    });

    // 서로 팔로우 테이블에서 삭제
    friendService.deleteFollowFriend(userId,friendId);
    friendService.deleteFollowFriend(friendId,userId);

    // 서로 추천한 책 삭제
    await prisma.recommend.deleteMany({
        where :{
            recommendedBy : userId,
            recommendTo: friendId
        }
    });
    await prisma.recommend.deleteMany({
        where :{
            recommendedBy : friendId,
            recommendTo: userId
        }
    });

    return data;
}

//* [DELETE] 친구 차단 해제하기
const cancleBlockedFriend = async (userId: number, friendId: number) => {
    const data = prisma.block.deleteMany({
        where : {
            userId : userId,
            friendId : friendId
        }
    });

    return data;
}

//* [GET] 친구 차단 목록 조회하기
const getBlockList = async (userId: number) => {
    const list = await prisma.block.findMany({
        where : {
            userId : userId
        },
        select : {
            friendId: true
        }
    });

    let blockList: UserDTO[] = [];
    for (const friend of await list) {
        const userData = await userService.getUser(friend.friendId)
        blockList.push(userData);
    }

    return blockList;
}

const bookService = {
    blockFriend,
    cancleBlockedFriend,
    getBlockList
}

export default bookService;