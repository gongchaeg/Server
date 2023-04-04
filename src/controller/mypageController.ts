import { FriendRecommendRequestDTO } from './../interfaces/friend/FriendRecommendRequestDTO';
import { Request, Response } from "express";
import { fail, success } from "../constants/response";
import { rm, sc } from "../constants";
import { slackErrorMessage } from '../modules/slackErrorMessage';
import { sendWebhookMessage } from "../modules/slackWebhook";
import { friendService, mypageService, userService } from "../service";
import { userTokenCheck } from "../constants/userTokenCheck";
import { patchUserRequestDTO } from '../interfaces/mypage/patchUserRequestDTO';

//* 유저 탈퇴하기
const deleteUser = async (req: Request, res: Response) => {
    const userId = req.body.userId;

    if (!userId) {
        return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.NULL_VALUE));
    }

    try {
        const data = await mypageService.deleteUser(+userId);

        if (!data) {
            return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.DELETE_USER_FAIL))
        }

        return res.status(sc.OK).send(success(sc.OK, rm.DELETE_USER_SUCCESS));

    } catch (error) {
        const errorMessage = slackErrorMessage(req.method.toUpperCase(), req.originalUrl, error, req.statusCode);

        sendWebhookMessage(errorMessage);

        res.status(sc.INTERNAL_SERVER_ERROR)
            .send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
    }
}

//* 사용자 정보 수정하기
const patchUser = async (req: Request, res: Response) => {
    const userId = req.body.userId;
    const patchUserRequestDTO: patchUserRequestDTO = req.body
    const image: Express.MulterS3.File = req.file as Express.MulterS3.File;
    const { location } = image;

    if (!userId) {
        return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.NULL_VALUE));
    }

    if (!location) {
        patchUserRequestDTO.profileImage = null;
    }

    if (!patchUserRequestDTO.nickname) {
        return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.NULL_NICKNAME));
    }

    try {
        patchUserRequestDTO.profileImage = location;

        const data = await mypageService.patchUser(+userId, patchUserRequestDTO);

        if (!data) {
            return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.CREATE_IMAGE_FAIL))
        }

        return res.status(sc.OK).send(success(sc.OK, rm.CREATE_IMAGE_SUCCESS));

    } catch (error) {
        const errorMessage = slackErrorMessage(req.method.toUpperCase(), req.originalUrl, error, req.statusCode);

        sendWebhookMessage(errorMessage);

        res.status(sc.INTERNAL_SERVER_ERROR)
            .send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
    }
}

//* 사용자 정보 조회하기
const getUserData = async (req: Request, res: Response) => {
    const userId = req.body.userId;
    if (!userId) {
        return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.NULL_VALUE));
    }

    try {
        const data = await userService.getUserIntro(+userId);

        if (!data) {
            return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.READ_USER_FAIL))
        }

        return res.status(sc.OK).send(success(sc.OK, rm.READ_USER_SUCCESS, data));

    } catch (error) {
        const errorMessage = slackErrorMessage(req.method.toUpperCase(), req.originalUrl, error, req.statusCode);

        sendWebhookMessage(errorMessage);

        res.status(sc.INTERNAL_SERVER_ERROR)
            .send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
    }
}

/**
 * @route DELETE /mypage/blocklist/:friendId
 * @desc 친구 차단 해제하기
 **/
const cancleBlock = async (req: Request, res: Response) => {
    const { friendId } = req.params;
    const userId = req.body.userId;

    if (!userId || !friendId) {
        return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.NULL_VALUE));
    }

    try {
        const data = await friendService.cancleBlockedFriend(+userId, +friendId);

        if (!data) {
            return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.FAIL_CANCLE_BLOCK_FRIEND));
        }
        return res.status(sc.OK).send(success(sc.OK, rm.SUCCESS_CANCLE_BLOCK_FIREND));

    } catch (error) {
        const errorMessage = slackErrorMessage(req.method.toUpperCase(), req.originalUrl, error, req.statusCode);
        sendWebhookMessage(errorMessage);
        res.status(sc.INTERNAL_SERVER_ERROR)
            .send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
    }
}

const mypageController = {
    deleteUser,
    patchUser,
    getUserData,
    cancleBlock
}

export default mypageController;