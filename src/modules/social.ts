import axios from "axios";
import { sc } from "../constants";
import jwt from 'jsonwebtoken';
import { createPublicKey } from "crypto";

const signInKakao = async (socialToken: string) => {
  try {
    const user = await axios.get('https://kapi.kakao.com/v2/user/me', {
      headers: {
        Authorization: `Bearer ${socialToken}`,
      },
    });

    if (!user) {
      throw sc.UNAUTHORIZED;
    }
    return user.data;
  } catch (err) {
    throw sc.UNAUTHORIZED;
  }
};

const getApplePublicKey = async () => {

  try {
    const user = await axios.get('https://appleid.apple.com/auth/keys');
    const { data } = user;

    if (!data) {
      throw sc.UNAUTHORIZED;
    }
  
    return data.keys;
  } catch (err) {
    throw sc.UNAUTHORIZED;
  }

};

//* 애플 identityToken
const signInApple = async (identityToken: string) => {
  const JWTSet = await getApplePublicKey();
  const identityTokenHeader: string = identityToken?.split('.')[0];
  const { kid } = JSON.parse(atob(identityTokenHeader));

  let rightKeyN;
  let rightKeyE;
  let rightKeyKty;

  JWTSet.map((key: any) => {
    if (kid === key.kid) {
      rightKeyN = key.n;
      rightKeyE = key.e;
      rightKeyKty = key.kty;
    }
  });

  if (!rightKeyN || !rightKeyE) return null;

  const key = {
    n: rightKeyN,
    e: rightKeyE,
    kty: rightKeyKty,
  };

  const nBuffer = Buffer.from(key.n, 'base64');
  const eBuffer = Buffer.from(key.e, 'base64');

  const publicKey = createPublicKey({
    key: {
      kty: key.kty,
      n: nBuffer.toString('base64'),
      e: eBuffer.toString('base64'),
    },
    format: 'jwk',
  });

  //verify 실행
  const user = jwt.verify(identityToken, publicKey) as jwt.JwtPayload;
  const userSocialId = user.sub as string;

  return userSocialId;
}

export default {
    signInKakao,
    signInApple,
    getApplePublicKey,

};