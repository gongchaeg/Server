import { Request, Response } from "express";
import { fail, success } from "../constants/response";
import { rm, sc } from "../constants";
import { slackErrorMessage } from "../modules/slackErrorMessage";
import { sendWebhookMessage } from "../modules/slackWebhook";
import { userService } from "../service";
import { userTokenCheck } from "../constants/userTokenCheck";

//* 유저닉네임 중복 검사
const postDuplicateNickname = async (req: Request, res: Response) => {
    const userId = req.body.userId;
    const { nickname } = req.body;

    if (!nickname) {
        return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.NULL_NICKNAME));
    }
    try {

        const data = await userService.postDuplicateNickname(+userId, nickname);
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