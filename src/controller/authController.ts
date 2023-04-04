
import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { rm, sc, tokenType } from "../constants";
import { fail, success } from "../constants/response";
import { SignUpReqDTO } from "../interfaces/auth/SignUpReqDTO";
import { slackErrorMessage } from "../modules/slackErrorMessage";
import { sendWebhookMessage } from "../modules/slackWebhook";
import { bookshelfService, userService } from "../service";
import authService from "../service/authService";
import jwtHandler from "../modules/jwtHandler";


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

        if (!data) {
            return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.SIGNIN_FAIL))
        }

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


/**
 * @route GET /auth/token
 * @desc 만료된 토큰을 재발급
 */
const getToken = async (req: Request, res: Response) => {
    const accessToken = req.header("accessToken")?.split(" ").reverse()[0] as string;
    const refreshToken = req.header("refreshToken")?.split(" ").reverse()[0] as string;

    if (!refreshToken || !accessToken) {
        return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.NULL_VALUE));
    }

    try {
        const decodedToken = jwtHandler.verify(accessToken);

        if (decodedToken == tokenType.TOKEN_INVALID) return res.status(sc.UNAUTHORIZED).send(fail(sc.UNAUTHORIZED, rm.INVALID_TOKEN));

        if (decodedToken == tokenType.TOKEN_EXPIRED) {
            const refresh = jwtHandler.verify(refreshToken);
      
            if (refresh == tokenType.TOKEN_INVALID) return res.status(sc.UNAUTHORIZED).send(fail(sc.UNAUTHORIZED, rm.INVALID_REFRESH_TOKEN));
            if (refresh == tokenType.TOKEN_EXPIRED) return res.status(sc.UNAUTHORIZED).send(fail(sc.UNAUTHORIZED, rm.EXPIRED_ALL_TOKEN));
      
            const user = await userService.getUserByRfToken(refreshToken);

            if (!user) {
                return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.BAD_REQUEST));
            }
            const accessToken = jwtHandler.sign(user.id);

            const result = {
                newAccessToken : accessToken,
                refreshToken
            }
      
            return res.status(sc.OK).send(success(sc.OK, rm.CREATE_TOKEN_SUCCESS, result));
        }
        return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.VALID_TOKEN));
    } catch (error) {
        const errorMessage = slackErrorMessage(req.method.toUpperCase(), req.originalUrl, error, req.statusCode);

        sendWebhookMessage(errorMessage);

        return res.status(sc.INTERNAL_SERVER_ERROR).send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
    }
}


//* 나중에 삭제할 로직 !!!
const testSignin = async (req: Request, res:Response) => {

    const auth = req.header("auth");
    if (!auth) {
        return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.BAD_REQUEST));
    }

    try {
        
        const data = await authService.testSignin(+auth);

        return res.status(sc.OK).send(success(sc.OK, rm.SIGNIN_SUCCESS, data));

    } catch (error) {
        const errorMessage = slackErrorMessage(req.method.toUpperCase(), req.originalUrl, error, req.statusCode);

        sendWebhookMessage(errorMessage);

        return res.status(sc.INTERNAL_SERVER_ERROR).send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
    }
};

const AuthController = {
    signIn,
    signUp,
    getToken,
    testSignin
};

export default AuthController;
