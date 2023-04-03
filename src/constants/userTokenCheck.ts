import tokenType from "../constants/tokenType";
import { rm } from "../constants";
import { JwtPayload } from "jsonwebtoken";
import jwtHandler from "../modules/jwtHandler";

export const userTokenCheck = (accessToken: string) => {
    //* 토큰에서 유저 아이디 가져오기
    const decoded = jwtHandler.verify(accessToken);

    if (decoded === tokenType.TOKEN_EXPIRED)
        return rm.EXPIRED_TOKEN;
    if (decoded === tokenType.TOKEN_INVALID)
        return rm.INVALID_TOKEN;

    //? decode한 후 담겨있는 userId를 꺼내옴
    const userId: number = (decoded as JwtPayload).userId;

    return userId;
}