export const slackSignUpMessage = (
  userId: number,
  nickname: string | null,
  email: string | null
) => {
  return `[회원가입✨] \n ${userId}번 유저가 새로 가입을 했습니다 ! \n 닉네임 : ${nickname} \n 이메일 : ${email}`;
};
