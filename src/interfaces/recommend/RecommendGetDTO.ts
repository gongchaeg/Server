export interface RecommendGetDTO {
    recommendId: number,
    createdAt: string,
    recommendDesc: string | null,
    friendId: number,
    friendNickname: string | null,
    bookId: number,
    bookTitle: string | null,
    author: string | null,
    bookImage: string | null,

}
