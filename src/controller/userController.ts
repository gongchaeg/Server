import { Request, Response } from "express";
import { fail, success } from "../constants/response";
import { rm, sc } from "../constants";
import { slackErrorMessage } from "../modules/slack/slackErrorMessage";
import { userService } from "../service";
import { userTokenCheck } from "../constants/userTokenCheck";
import { sendWebhookErrorMessage } from "../modules/slack/slackWebhook";

//* 유저닉네임 중복 검사
const postDuplicateNickname = async (req: Request, res: Response) => {
  const userId = req.body.userId;
  const { nickname } = req.body;

  if (!nickname) {
    return res
      .status(sc.BAD_REQUEST)
      .send(fail(sc.BAD_REQUEST, rm.NULL_NICKNAME));
  }

  const refinedNickname = nickname.replace(/ /g, "");

  try {
    const data = await userService.postDuplicateNickname(
      +userId,
      refinedNickname
    );
    if (!data) {
      return res
        .status(sc.BAD_REQUEST)
        .send(fail(sc.BAD_REQUEST, rm.FAIL_CHECK_NICKNAME));
    }

    return res
      .status(sc.OK)
      .send(success(sc.OK, rm.SUCCESS_CHECK_NICKNAME, data));
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

const getUserVersion = async (req: Request, res: Response) => {
  try {
    const data = await userService.getUserVersion();

    if (!data) {
      return res
        .status(sc.BAD_REQUEST)
        .send(fail(sc.BAD_REQUEST, rm.BAD_REQUEST));
    }

    return res
      .status(sc.OK)
      .send(success(sc.OK, rm.GET_USER_VERSION_SUCCESS, data));
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

const userController = {
  postDuplicateNickname,
  getUserVersion,
};

export default userController;
