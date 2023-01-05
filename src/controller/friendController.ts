import { FriendRecommendRequestDTO } from './../interfaces/friend/FriendRecommendRequestDTO';
import { Request, Response } from "express";
import { fail, success } from "../constants/response";
import { rm, sc } from "../constants";
import { friendService } from '../service';


//* 친구에게 책 추천하기 
const recommendBookToFriend = async (req: Request, res: Response) => {
    const { friendId } = req.params;
    const friendRecommendRequestDTO: FriendRecommendRequestDTO = req.body;

    if (!friendId) {
        return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.NOT_FOUND_FRIEND_ID));
    }
    const data = await friendService.recommendBookToFriend(friendRecommendRequestDTO, +friendId);

    if (!data) {
        return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.FAIL_RECOMMEND_BOOK));
    }
    return res.status(sc.OK).send(success(sc.OK, rm.SUCCESS_RECOMMEND_BOOK, data));
}

const friendController = {
    recommendBookToFriend,
}

export default friendController;