import { reportMailDTO } from "../interfaces/friend/reportMailDTO";

export const reportMessage = (reportMailDTO: reportMailDTO) => {

    const reportMessage =
        `[PEEKABOOK REPORT]
    
    신고한 사용자 : [${reportMailDTO.userId}] ${reportMailDTO.userNickname}
    신고당한 사용자 : [${reportMailDTO.friendId}] ${reportMailDTO.friendNickname}
    신고 사유 : ${reportMailDTO.reasonString}
    구체적인 사유 : ${reportMailDTO.etc}

    신고 접수 되었습니다.
    `
    console.log(reportMessage);
    return reportMessage;
}