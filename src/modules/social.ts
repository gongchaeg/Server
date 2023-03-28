import axios from "axios";
import { sc } from "../constants";

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

export default {
    signInKakao,
};