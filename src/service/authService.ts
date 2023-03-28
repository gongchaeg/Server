import jwtHandler from "../modules/jwtHandler";
import { PrismaClient } from "@prisma/client";
import social from "../modules/social";

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
    })

    const refreshToken = jwtHandler.getRefreshToken();

    //* 최초 로그인 시, 일단 유저 등록 -> 이후 회원가입 로직
    if (!userInkakao) {
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

    //* 기존에 회원이 등록되어있으면, 자동 로그인
    const accessToken = jwtHandler.sign(userInkakao.id);
    return {
      accessToken,
      refreshToken : userInkakao.refresh_token,
      isSignedUp : true
    }
  }
};

const authService = {
  signIn
}

export default authService;