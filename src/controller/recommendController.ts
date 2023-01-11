import { Request, Response } from "express";
import { fail, success } from "../constants/response";
import { rm, sc } from "../constants";
import { recommendService } from "../service";
import { sendWebhookMessage } from './../modules/slackWebhook';
import { slackErrorMessage } from "../modules/slackErrorMessage";

//* 추천 책 조회하기
const getRecommend = async (req: Request, res: Response) => {
    const data = await recommendService.getRecommend();
    const auth = req.header("auth");

    try {
        if (!data) {
            return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.FAIL_GET_RECOMMEND));
        }

        return res.status(sc.OK).send(success(sc.OK, rm.SUCCESS_GET_RECOMMEND, data));
    } catch (error) {
        const errorMessage = slackErrorMessage(req.method.toUpperCase(), req.originalUrl, error, +{ auth }, req.statusCode);

        sendWebhookMessage(errorMessage);

        res.status(sc.INTERNAL_SERVER_ERROR)
            .send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
    }

}

const recommendController = {
    getRecommend,
}

export default recommendController;