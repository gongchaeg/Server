import { Request, Response } from "express";
import { rm, sc } from "../constants";
import { fail, success } from "../constants/response";

const getAlarm = async (req: Request, res: Response) => {

}

const alarmController = {
    getAlarm,
}

export default alarmController;