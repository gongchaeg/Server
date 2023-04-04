import { FriendRecommendRequestDTO } from './../interfaces/friend/FriendRecommendRequestDTO';
import { Request, Response } from "express";
import { fail, success } from "../constants/response";
import { rm, sc } from "../constants";
import { slackErrorMessage } from '../modules/slackErrorMessage';
import { sendWebhookMessage } from "../modules/slackWebhook";
import { friendService, mypageService, userService } from "../service";
import { userTokenCheck } from "../constants/userTokenCheck";
import { patchUserRequestDTO } from '../interfaces/mypage/patchUserRequestDTO';
import blockService from '../service/blockService';

//* 유저 탈퇴하기
const deleteUser = async (req: Request, res: Response) => {
    const token = req.header('accessToken')?.split(" ").reverse()[0] as string;

    try {
        const tokenCheck = userTokenCheck(token);
        if (tokenCheck == rm.EXPIRED_TOKEN) {
            return res.status(sc.UNAUTHORIZED).send(fail(sc.UNAUTHORIZED, rm.EXPIRED_TOKEN));
        } else if (tokenCheck == rm.INVALID_TOKEN) {
            return res.status(sc.UNAUTHORIZED).send(fail(sc.UNAUTHORIZED, rm.INVALID_TOKEN));
        }

        const data = await mypageService.deleteUser(+tokenCheck);

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
    const token = req.header('accessToken')?.split(" ").reverse()[0] as string;
    const patchUserRequestDTO: patchUserRequestDTO = req.body
    const image: Express.MulterS3.File = req.file as Express.MulterS3.File;
    const { location } = image;

    if (!location) {
        patchUserRequestDTO.profileImage = null;
    }

    if (!patchUserRequestDTO.nickname) {
        return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.NULL_NICKNAME));
    }

    try {
        patchUserRequestDTO.profileImage = location;
        const tokenCheck = userTokenCheck(token);
        if (tokenCheck == rm.EXPIRED_TOKEN) {
            return res.status(sc.UNAUTHORIZED).send(fail(sc.UNAUTHORIZED, rm.EXPIRED_TOKEN));
        } else if (tokenCheck == rm.INVALID_TOKEN) {
            return res.status(sc.UNAUTHORIZED).send(fail(sc.UNAUTHORIZED, rm.INVALID_TOKEN));
        }

        const data = await mypageService.patchUser(+tokenCheck, patchUserRequestDTO);

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
    const token = req.header('accessToken')?.split(" ").reverse()[0] as string;

    try {
        const tokenCheck = userTokenCheck(token);
        if (tokenCheck == rm.EXPIRED_TOKEN) {
            return res.status(sc.UNAUTHORIZED).send(fail(sc.UNAUTHORIZED, rm.EXPIRED_TOKEN));
        } else if (tokenCheck == rm.INVALID_TOKEN) {
            return res.status(sc.UNAUTHORIZED).send(fail(sc.UNAUTHORIZED, rm.INVALID_TOKEN));
        }

        const data = await userService.getUserIntro(+tokenCheck);

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
        const data = await blockService.cancleBlockedFriend(+userId, +friendId);

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

/**
 * @route GET /mypage/blocklist
 * @desc 친구 차단 리스트 조회하기
 **/
const getBlockList = async (req: Request, res: Response) => {
    const userId = req.body.userId;

    if (!userId) {
        return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.NULL_VALUE));
    }

    try {
        const data = await blockService.getBlockList(+userId);

        if (!data) {
            return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.FAIL_GET_BLOCK_LIST));
        }
        return res.status(sc.OK).send(success(sc.OK, rm.SUCCESS_GET_BLOCK_LIST, data));

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
    cancleBlock,
    getBlockList
}

export default mypageController;