export interface reportMailDTO {
    userNickname: string | null,
    userId: number,
    friendNickname: string | null,
    friendId: number,
    reasonString: string,
    etc?: string
}