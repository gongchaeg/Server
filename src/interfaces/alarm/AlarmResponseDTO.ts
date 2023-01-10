export interface AlarmResponseDTO {
    alarmId: number,
    senderId: number,
    senderName: string,
    profileImage: string | null,
    bookTitle?: string,
    typeId: number,
    createdAt: string
}