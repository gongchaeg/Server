import { FriendRecommendRequestDTO } from './../interfaces/friend/FriendRecommendRequestDTO';
import { Request, Response } from "express";
import { fail, success } from "../constants/response";
import { rm, sc } from "../constants";
import { slackErrorMessage } from '../modules/slackErrorMessage';
import { sendWebhookMessage } from "../modules/slackWebhook";
import { mypageService } from "../service";
import { userTokenCheck } from "../constants/userTokenCheck";

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

const mypageController = {
    deleteUser,
}

export default mypageController;