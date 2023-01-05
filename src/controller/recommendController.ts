import { Request, Response } from "express";
import { fail, success } from "../constants/response";
import { rm, sc } from "../constants";

const getRecommend = async (req: Request, res: Response) => {

}

const recommendController = {
    getRecommend,
}

export default recommendController;