import { Request, Response } from "express";
import { rm, sc } from "../constants";
import { fail, success } from "../constants/response";
import { alarmService } from "../service";

const getAlarm = async (req: Request, res: Response) => {
    const auth = req.header("auth");
    try {
        const data = await alarmService.getAlarm();

        if (!data) {
            return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.FAIL_GET_ALARM));
        }

        return res.status(sc.OK).send(success(sc.OK, rm.SUCCESS_GET_ALARM, data));
    } catch (error) {

    }

}

const alarmController = {
    getAlarm,
}

export default alarmController;