
import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { rm, sc } from "../constants";
import { fail, success } from "../constants/response";
import { SignUpReqDTO } from "../interfaces/auth/SignUpReqDTO";
import { slackErrorMessage } from "../modules/slackErrorMessage";
import { sendWebhookMessage } from "../modules/slackWebhook";
import { bookshelfService } from "../service";
import authService from "../service/authService";


/**
 * @route POST /auth/singin
 * @desc 소셜 로그인 하기
 **/
const signIn = async (req: Request, res: Response) => {
    
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res
        .status(sc.UNAUTHORIZED)
        .send(fail(sc.UNAUTHORIZED, rm.INVALID_TOKEN));
    }

    // 소셜 로그인 access token
    const socialToken = req.header('accessToken')?.split(" ").reverse()[0] as string;
    const { socialPlatform } = req.body;

    if ( !socialPlatform) {
        return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.NULL_VALUE));
    }

    try {
        const data = await authService.signIn(socialToken, socialPlatform);

        return res.status(sc.OK).send(success(sc.OK, rm.SIGNIN_SUCCESS, data));
    } catch (error) {
        const errorMessage = slackErrorMessage(req.method.toUpperCase(), req.originalUrl, error, req.statusCode);

        sendWebhookMessage(errorMessage);

        if (error == sc.UNAUTHORIZED) {
            return res.status(sc.UNAUTHORIZED).send(fail(sc.UNAUTHORIZED, rm.INVALID_TOKEN));
        }
        return res.status(sc.INTERNAL_SERVER_ERROR).send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
  }
};

/**
 * @route PATCH /auth/signup
 * @desc 회원 가입
 */

const signUp = async (req: Request, res:Response) => {

    const token = req.header('accessToken')?.split(" ").reverse()[0] as string;
    const signUpdDto : SignUpReqDTO  = req.body;

    if (!signUpdDto.intro || !signUpdDto.nickname) {
        return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.NULL_VALUE));
    }

    const intro = signUpdDto.intro;
    const refinedIntro = intro.replace(/\n/g, " ");

    signUpdDto.intro = refinedIntro;

    try {
        
        const data = await authService.signUp(token, signUpdDto);

        if (data == rm.EXPIRED_TOKEN)
            return res.status(sc.UNAUTHORIZED).send(fail(sc.UNAUTHORIZED, rm.EXPIRED_TOKEN));
        if (data == rm.INVALID_TOKEN)
            return res.status(sc.UNAUTHORIZED).send(fail(sc.UNAUTHORIZED, rm.INVALID_TOKEN));

        return res.status(sc.OK).send(success(sc.OK, rm.SIGNUP_SUCCESS));

    } catch (error) {
        const errorMessage = slackErrorMessage(req.method.toUpperCase(), req.originalUrl, error, req.statusCode);

        sendWebhookMessage(errorMessage);

        return res.status(sc.INTERNAL_SERVER_ERROR).send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
    }
};

const AuthController = {
    signIn,
    signUp
};

export default AuthController;
