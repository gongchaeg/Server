import jwtHandler from "../modules/jwtHandler";
import { PrismaClient } from "@prisma/client";
import social from "../modules/social";
import { SignUpReqDTO } from "../interfaces/auth/SignUpReqDTO";
import tokenType from "../constants/tokenType";
import { rm, sc } from "../constants";
import { JwtPayload } from "jsonwebtoken";


const prisma = new PrismaClient();

//* 소셜 로그인 
const signIn = async (socialToken : string, socialPlatform: string) => {

  let socialId;

  switch (socialPlatform) {
    case 'kakao':
      const userData = await social.signInKakao(socialToken);
      socialId = String(userData.id);
      break;
    case 'apple':
      socialId = await social.signInApple(socialToken);
      break;
  }

  if (!socialId) throw new Error('no user data!');
  
    //* 기존 소셜 auth 서버에 등록 되어있는 회원인지 확인
    const userInSocial = await prisma.user.findFirst({
      where : {
        social_platform : socialPlatform,
        social_id : socialId
      }
    });


    //* 최초 로그인 시, 일단 유저 등록
    if (!userInSocial) {
      const refreshToken = jwtHandler.getRefreshToken();
      
      const user = await prisma.user.create({
        data: {
          social_platform: socialPlatform,
          social_id: socialId,
          refresh_token :refreshToken
        },
      });
  
      const userId = user.id;
  
      const accessToken = jwtHandler.sign(userId);
      const isSignedUp = false;
  
      return {
        accessToken,
        refreshToken,
        isSignedUp,
      };
    }

    //* 로그인만 하고, 회원가입은 하지 않음
    if ( !userInSocial.refresh_token || !userInSocial.nickname) {
      const userId = userInSocial.id;
      
      if( !userInSocial.refresh_token ) {
        const refreshToken = jwtHandler.getRefreshToken();

        await prisma.user.update({
          data : {
            refresh_token : refreshToken
          },
          where : {
            id : userId
          }
        });
      }
  
      const accessToken = jwtHandler.sign(userId);
      const isSignedUp = false;
  
      return {
        accessToken,
        refreshToken : userInSocial.refresh_token,
        isSignedUp,
      };
    }

    //* 기존에 회원이 등록되어있으면, 자동 로그인
    const accessToken = jwtHandler.sign(userInSocial.id);
    return {
      accessToken,
      refreshToken : userInSocial.refresh_token,
      isSignedUp : true
    }
  };

//* 회원 가입
const signUp = async (accessToken: string, signUpDto : SignUpReqDTO) => {
    //* 토큰에서 유저 아이디 가져오기
    const decoded = jwtHandler.verify(accessToken); 

    if (decoded === tokenType.TOKEN_EXPIRED)
      return rm.EXPIRED_TOKEN;
    if (decoded === tokenType.TOKEN_INVALID)
      return rm.INVALID_TOKEN;

    //? decode한 후 담겨있는 userId를 꺼내옴
    const userId: number = (decoded as JwtPayload).userId;

    const data = await prisma.user.update({
      where : {
        id: userId
      },
      data : {
        profileImage : signUpDto.profileImage,
        nickname : signUpDto.nickname,
        intro : signUpDto.intro
      }
    });

    return data;
};

//* 테스트로 accesstoken 발급 => 추후 삭제 !!!!
const testSignin = async ( userId : number) => {
  const accessToken = jwtHandler.sign(userId);
  return accessToken;
}

const authService = {
  signIn,
  signUp,
  testSignin
}

export default authService;