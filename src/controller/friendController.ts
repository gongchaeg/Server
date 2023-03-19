import { FriendRecommendRequestDTO } from './../interfaces/friend/FriendRecommendRequestDTO';
import { Request, Response } from "express";
import { fail, success } from "../constants/response";
import { rm, sc } from "../constants";
import { friendService } from '../service';
import { slackErrorMessage } from '../modules/slackErrorMessage';
import { sendWebhookMessage } from "../modules/slackWebhook";
import { FriendReportRequestDTO } from '../interfaces/friend/FriendReportRequestDTO';

//* 친구에게 책 추천하기 
const recommendBookToFriend = async (req: Request, res: Response) => {
    const { friendId } = req.params;
    const friendRecommendRequestDTO: FriendRecommendRequestDTO = req.body;
    const auth = req.header("auth");
    if (!auth) {
        return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.BAD_REQUEST));
    }

    if (!friendId) {
        return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.NOT_FOUND_FRIEND_ID));
    }
    try {
        const data = await friendService.recommendBookToFriend(friendRecommendRequestDTO, +friendId, +auth);

        if (!data) {
            return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.FAIL_RECOMMEND_BOOK));
        }

        if (data == sc.NOT_FOUND) {
            return res.status(sc.NOT_FOUND).send(fail(sc.NOT_FOUND, rm.FAIL_NO_FRIEND));
        }

        return res.status(sc.OK).send(success(sc.OK, rm.SUCCESS_RECOMMEND_BOOK, data));
    } catch (error) {
        const errorMessage = slackErrorMessage(req.method.toUpperCase(), req.originalUrl, error, +auth, req.statusCode);

        sendWebhookMessage(errorMessage);

        res.status(sc.INTERNAL_SERVER_ERROR)
            .send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
    }

}

//* 사용자 검색하기
const searchUser = async (req: Request, res: Response) => {
    const { nickname } = req.query;
    const auth = req.header("auth");
    if (!auth) {
        return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.BAD_REQUEST));
    }

    if (!nickname) {
        return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.NOT_FOUND_FRIEND_ID));
    }

    try {
        const data = await friendService.searchUser(nickname as string, +auth);

        if (!data) {
            return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.FAIL_NO_FRIEND_EXIST));
        }

        return res.status(sc.OK).send(success(sc.OK, rm.SUCCESS_GET_USER, data));
    } catch (error) {
        const errorMessage = slackErrorMessage(req.method.toUpperCase(), req.originalUrl, error, +auth, req.statusCode);

        sendWebhookMessage(errorMessage);

        res.status(sc.INTERNAL_SERVER_ERROR)
            .send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
    }

}

//* 사용자 팔로우 하기
const followFriend = async (req: Request, res: Response) => {
    const { friendId } = req.params;
    const auth = req.header("auth");
    if (!auth) {
        return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.BAD_REQUEST));
    }

    if (!friendId) {
        return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.NOT_FOUND_FRIEND_ID));
    }
    try {
        const data = await friendService.followFriend(+friendId, +auth);

        if (!data) {
            return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.FAIL_POST_FOLLOW));
        }
        return res.status(sc.OK).send(success(sc.OK, rm.SUCCESS_POST_FOLLOW, data));

    } catch (error) {
        const errorMessage = slackErrorMessage(req.method.toUpperCase(), req.originalUrl, error, +auth, req.statusCode);

        sendWebhookMessage(errorMessage);

        res.status(sc.INTERNAL_SERVER_ERROR)
            .send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
    }

}

/**
 * @route DELETE /friend/:friendId
 * @desc 팔로우 취소하기
 **/
const deleteFollowFriend = async (req: Request, res: Response) => {
    const { friendId } = req.params;
    const auth = req.header("auth");
    if (!auth) {
        return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.BAD_REQUEST));
    }

    if (!friendId) {
        return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.FAIL_FOUND_FRIEND_ID));
    }

    const data = await friendService.deleteFollowFriend(+friendId, +auth);

    if (!data) {
        return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.DELETE_FRIEND_FAIL));
    }
    return res.status(sc.OK).send(success(sc.OK, rm.DELETE_FRIEND_SUCCESS));

}

//* 친구 신고하기
const postReport = async (req: Request, res: Response) => {
    const { friendId } = req.params;
    const friendReportRequestDto: FriendReportRequestDTO = req.body;
    const auth = req.header("auth");

    if (!auth) {
        return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.BAD_REQUEST));
    }

    if (!friendId) {
        return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.FAIL_FOUND_FRIEND_ID));
    }

    if (!friendReportRequestDto) {
        return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.FAIL_REPORT_POST));
    }

    try {
        const data = await friendService.postReport(+auth, +friendId, friendReportRequestDto);

        if (!data) {
            return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.FAIL_REPORT_POST));
        }
        return res.status(sc.OK).send(success(sc.OK, rm.SUCCESS_REPORT_POST));


    } catch (error) {
        const errorMessage = slackErrorMessage(req.method.toUpperCase(), req.originalUrl, error, +auth, req.statusCode);

        sendWebhookMessage(errorMessage);

        res.status(sc.INTERNAL_SERVER_ERROR)
            .send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
    }

}

const friendController = {
    recommendBookToFriend,
    searchUser,
    followFriend,
    deleteFollowFriend,
    postReport,
}

export default friendController;