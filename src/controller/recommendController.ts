import { Request, Response } from "express";
import { fail, success } from "../constants/response";
import { rm, sc } from "../constants";
import { recommendService } from "../service";
import { slackErrorMessage } from "../modules/slack/slackErrorMessage";
import { sendWebhookErrorMessage } from "../modules/slack/slackWebhook";

//* 추천 책 조회하기
const getRecommend = async (req: Request, res: Response) => {
  const userId = req.body.userId;

  try {
    const data = await recommendService.getRecommend(+userId);
    if (!data) {
      return res
        .status(sc.BAD_REQUEST)
        .send(fail(sc.BAD_REQUEST, rm.FAIL_GET_RECOMMEND));
    }

    return res
      .status(sc.OK)
      .send(success(sc.OK, rm.SUCCESS_GET_RECOMMEND, data));
  } catch (error) {
    const errorMessage = slackErrorMessage(
      req.method.toUpperCase(),
      req.originalUrl,
      error,
      req.statusCode
    );

    sendWebhookErrorMessage(errorMessage);

    res
      .status(sc.INTERNAL_SERVER_ERROR)
      .send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
  }
};

//* 추천 책 삭제하기
const deleteRecommend = async (req: Request, res: Response) => {
  const { recommendId } = req.params;

  try {
    const data = await recommendService.deleteRecommend(+recommendId);

    return res.status(sc.OK).send(success(sc.OK, rm.SUCCESS_DELETE_RECOMMEND));
  } catch (error) {
    const errorMessage = slackErrorMessage(
      req.method.toUpperCase(),
      req.originalUrl,
      error,
      req.statusCode
    );

    sendWebhookErrorMessage(errorMessage);

    res
      .status(sc.INTERNAL_SERVER_ERROR)
      .send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
  }
};

const recommendController = {
  getRecommend,
  deleteRecommend,
};

export default recommendController;
