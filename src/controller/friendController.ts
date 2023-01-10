import { FriendRecommendRequestDTO } from './../interfaces/friend/FriendRecommendRequestDTO';
import { Request, Response } from "express";
import { fail, success } from "../constants/response";
import { rm, sc } from "../constants";
import { friendService } from '../service';
import { slackErrorMessage } from '../modules/slackErrorMessage';


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

    if (data == sc.NOT_FOUND) {
        return res.status(sc.NOT_FOUND).send(fail(sc.NOT_FOUND, rm.FAIL_NO_FRIEND));
    }

    return res.status(sc.OK).send(success(sc.OK, rm.SUCCESS_RECOMMEND_BOOK, data));
}

//* 사용자 검색하기
const searchUser = async (req: Request, res: Response) => {
    const { nickname } = req.query;

    if (!nickname) {
        return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.NOT_FOUND_FRIEND_ID));
    }

    const data = await friendService.searchUser(nickname as string);

    if (!data) {
        return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.FAIL_NO_FRIEND_EXIST));
    }

    return res.status(sc.OK).send(success(sc.OK, rm.SUCCESS_GET_USER, data));
}

//* 사용자 팔로우 하기
const followFriend = async (req: Request, res: Response) => {
    const { friendId } = req.params;

    if (!friendId) {
        return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.NOT_FOUND_FRIEND_ID));
    }

    const data = await friendService.followFriend(+friendId);

    if (!data) {
        return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.FAIL_POST_FOLLOW));
    }
    return res.status(sc.OK).send(success(sc.OK, rm.SUCCESS_POST_FOLLOW, data));

}

/**
 * @route DELETE /friend/:friendId
 * @desc 팔로우 취소하기
 **/
const deleteFollowFriend = async (req: Request, res: Response) => {
    const { friendId } = req.params;

    if (!friendId) {
        return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.FAIL_FOUND_FRIEND_ID));
    }

    const data = await friendService.deleteFollowFriend(+friendId);

    if (!data) {
        return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.DELETE_FRIEND_FAIL));
    }
    return res.status(sc.OK).send(success(sc.OK, rm.DELETE_FRIEND_SUCCESS));

}

const friendController = {
    recommendBookToFriend,
    searchUser,
    followFriend,
    deleteFollowFriend
}

export default friendController;