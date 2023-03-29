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

  //* 카카오 로그인
  if (socialPlatform == "kakao") {
    const userData = await social.signInKakao(socialToken);

    if (!userData) throw new Error('no user data!');
  
    const socialId = String(userData.id);
  
    //* 기존 카카오 auth 서버에 등록 되어있는 회원인지 확인
    const userInkakao = await prisma.user.findFirst({
      where : {
        social_platform : socialPlatform,
        social_id : socialId
      }
    });


    //* 최초 로그인 시, 일단 유저 등록 -> 이후 회원가입 로직
    if (!userInkakao) {
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

    if ( !userInkakao.refresh_token || !userInkakao.nickname) {
      const userId = userInkakao.id;
      
      if( !userInkakao.refresh_token ) {
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
        refreshToken : userInkakao.refresh_token,
        isSignedUp,
      };
    }

    //* 기존에 회원이 등록되어있으면, 자동 로그인
    const accessToken = jwtHandler.sign(userInkakao.id);
    return {
      accessToken,
      refreshToken : userInkakao.refresh_token,
      isSignedUp : true
    }
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

const authService = {
  signIn,
  signUp
}

export default authService;