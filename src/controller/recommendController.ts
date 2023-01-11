import { Request, Response } from "express";
import { fail, success } from "../constants/response";
import { rm, sc } from "../constants";
import { recommendService } from "../service";

//* 추천 책 조회하기
const getRecommend = async (req: Request, res: Response) => {
    const data = await recommendService.getRecommend();
    const auth = req.header("auth");
    console.log(auth);

    if (!data) {
        return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.FAIL_GET_RECOMMEND));
    }

    return res.status(sc.OK).send(success(sc.OK, rm.SUCCESS_GET_RECOMMEND, data));
}

const recommendController = {
    getRecommend,
}

export default recommendController;