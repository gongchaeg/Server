export interface AlarmResponseDTO {
    alarmId: number,
    senderId: number,
    senderName: string,
    profileImage: string,
    bookTitle?: string,
    typeId: number,
    createdAt: string
}