import { PrismaClient } from "@prisma/client";
import dayjs from "dayjs";
import { AlarmResponseDTO } from "../interfaces/alarm/AlarmResponseDTO";

const prisma = new PrismaClient();

//* 알림 조회
const getAlarm = async (auth: number) => {
    let alarmAll: AlarmResponseDTO[] = [];

    const alarmData = await prisma.alarm.findMany({
        where: {
            receiverId: auth,
        },
        select: {
            id: true,
            typeId: true,
            senderId: true,
            createdAt: true,
        }
    });

    const promises = alarmData.map(async (data) => {

        //? 팔로우 한 경우
        if (data.typeId === 1) {

            const userData = await prisma.user.findFirst({
                where: {
                    id: data.senderId
                },
                select: {
                    profileImage: true,
                    nickname: true
                }
            })

            if (userData != null) {
                const followResult = {
                    alarmId: data.id,
                    typeId: data.typeId,
                    senderId: data.senderId,
                    senderName: userData.nickname,
                    profileImage: userData?.profileImage,
                    createdAt: dayjs(data.createdAt).format('YYYY-MM-DD')
                };
                alarmAll.push(followResult);
            }
        }




        //? 친구 책 추천한 경우
        if (data.typeId === 2) {
            const bookIds = await prisma.recommendAlarm.findFirst({
                where: {
                    alarmId: data.id
                },
                select: {
                    Recommend: {
                        select: {
                            bookId: true
                        }
                    }
                }
            })

            const bookDetail = await prisma.book.findFirst({
                where: {
                    id: bookIds?.Recommend.bookId
                },
                select: {
                    bookTitle: true
                }
            })

            const userData = await prisma.user.findFirst({
                where: {
                    id: data.senderId
                },
                select: {
                    profileImage: true,
                    nickname: true
                }
            })

            if (userData != null) {
                const bookResult = {
                    alarmId: data.id,
                    typeId: data.typeId,
                    senderId: data.senderId,
                    senderName: userData.nickname,
                    profileImage: userData?.profileImage,
                    createdAt: dayjs(data.createdAt).format('YYYY-MM-DD'),
                    bookTitle: bookDetail?.bookTitle
                };
                alarmAll.push(bookResult);
            }

        }
        //? 책 추가한 경우
        if (data.typeId === 3) {
            const bookIds = await prisma.newBookAlarm.findFirst({
                where: {
                    alarmId: data.id
                },
                select: {
                    Bookshelf: {
                        select: {
                            bookId: true
                        }
                    }
                }
            })

            const bookDetail = await prisma.book.findFirst({
                where: {
                    id: bookIds?.Bookshelf.bookId
                },
                select: {
                    bookTitle: true
                }
            })

            const userData = await prisma.user.findFirst({
                where: {
                    id: data.senderId
                },
                select: {
                    profileImage: true,
                    nickname: true
                }
            })

            if (userData != null) {
                const bookResult = {
                    alarmId: data.id,
                    typeId: data.typeId,
                    senderId: data.senderId,
                    senderName: userData.nickname,
                    profileImage: userData?.profileImage,
                    bookTitle: bookDetail?.bookTitle,
                    createdAt: dayjs(data.createdAt).format('YYYY-MM-DD')
                };
                alarmAll.push(bookResult);
            }

        }
    });
    await Promise.all(promises);

    alarmAll.sort(function (a, b) {
        return a.createdAt > b.createdAt ? -1 : a.createdAt > b.createdAt ? 1 : 0;
    });

    return alarmAll;
}

const alarmService = {
    getAlarm,
}

export default alarmService;                                                                                                                                                                                                                                                    