import { Request, Response } from "express";
import { fail, success } from "../constants/response";
import { rm, sc } from "../constants";
import { slackErrorMessage } from "../modules/slackErrorMessage";
import { sendWebhookMessage } from "../modules/slackWebhook";
import { userService } from "../service";
import { userTokenCheck } from "../constants/userTokenCheck";

//* 유저닉네임 중복 검사
const postDuplicateNickname = async (req: Request, res: Response) => {
    const token = req.header('accessToken')?.split(" ").reverse()[0] as string;
    const nickname: string = req.body;

    if (!nickname) {
        return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.NULL_NICKNAME));
    }
    try {
        const tokenCheck = userTokenCheck(token);
        if (tokenCheck == rm.EXPIRED_TOKEN) {
            return res.status(sc.UNAUTHORIZED).send(fail(sc.UNAUTHORIZED, rm.EXPIRED_TOKEN));
        } else if (tokenCheck == rm.INVALID_TOKEN) {
            return res.status(sc.UNAUTHORIZED).send(fail(sc.UNAUTHORIZED, rm.INVALID_TOKEN));
        }

        const data = await userService.postDuplicateNickname(+tokenCheck, nickname);
        if (!data) {
            return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.FAIL_CHECK_NICKNAME))
        }

        return res.status(sc.OK).send(success(sc.OK, rm.SUCCESS_CHECK_NICKNAME, data));

    } catch (error) {
        const errorMessage = slackErrorMessage(req.method.toUpperCase(), req.originalUrl, error, req.statusCode);

        sendWebhookMessage(errorMessage);

        res.status(sc.INTERNAL_SERVER_ERROR)
            .send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
    }

}

const userController = {
    postDuplicateNickname,
}

export default userController;