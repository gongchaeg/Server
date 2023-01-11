import { Request, Response } from "express";
import { rm, sc } from "../constants";
import { fail, success } from "../constants/response";
import { alarmService } from "../service";
import { slackErrorMessage } from "../modules/slackErrorMessage";
import { sendWebhookMessage } from "../modules/slackWebhook";

const getAlarm = async (req: Request, res: Response) => {
    const auth = req.header('auth');
    try {
        const data = await alarmService.getAlarm();

        if (!data) {
            return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.FAIL_GET_ALARM));
        }

        return res.status(sc.OK).send(success(sc.OK, rm.SUCCESS_GET_ALARM, data));
    } catch (error) {
        const errorMessage = slackErrorMessage(req.method.toUpperCase(), req.originalUrl, error, +{ auth }, req.statusCode);

        sendWebhookMessage(errorMessage);

        res.status(sc.INTERNAL_SERVER_ERROR)
            .send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
    }

}

const alarmController = {
    getAlarm,
}

export default alarmController;