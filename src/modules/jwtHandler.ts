import jwt from "jsonwebtoken";
import { tokenType } from "../constants";

const privateKey = process.env.JWT_SECRET_KEY as string;

//* 받아온 userId를 담는 access token 생성
const sign = (userId: number) => {
  const payload = {
    userId, //피카북 서버 userId
  };

  const accessToken = jwt.sign(payload, privateKey, {expiresIn: "5m"});
  return accessToken;
};

//* token 검사
const verify = (token: string) => {
  let decoded: string | jwt.JwtPayload;

  try {
    decoded = jwt.verify(token, privateKey);
  } catch (error: any) {
    if (error.message === "jwt expired") {
      return tokenType.TOKEN_EXPIRED;
    } else if (error.message === "invalid token") {
      return tokenType.TOKEN_INVALID;
    } else {
      return tokenType.TOKEN_INVALID;
    }
  }

  return decoded;
};

// refresh token 생성 코드
const getRefreshToken = () => {
  const payload = {};

  const refreshToken = jwt.sign(payload, privateKey, {
    expiresIn: "1h",
  });

  return refreshToken;
};

export default {
  sign,
  verify,
  getRefreshToken
};