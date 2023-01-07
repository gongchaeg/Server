import { PrismaClient } from "@prisma/client";
import dayjs from "dayjs";
import { AlarmResponseDTO } from "../interfaces/alarm/AlarmResponseDTO";

const prisma = new PrismaClient();

//* 알림 조회
const getAlarm = async () => {

    const alarmData = await prisma.alarm.findMany({
        where: {
            receiverId: 1,
        },
        select: {
            typeId: true,
            senderId: true,
            createdAt: true,
        }
    });

    let alarmAll: AlarmResponseDTO[] = [];

    const alarmDetailData = await Promise.all(
        alarmData.map((data: any) => {

            // 팔로우 한 경우
            if (data.typeId === 1) {
                const followResult = {
                    typeId: data.typeId,
                    senderId: data.senderId,
                    createdAt: dayjs(data.createdAt).format('YYYY-MM-DD')
                };
                alarmAll.push(followResult);

            }
            // 친구 책 추천, 책 추가한 경우
            else {
                const bookResult = {
                    typeId: data.typeId,
                    senderId: data.senderId,
                    createdAt: dayjs(data.createdAt).format('YYYY-MM-DD')
                }
                alarmAll.push(bookResult);
            }

        })
    );

    return alarmAll;
}

const alarmService = {
    getAlarm,
}

export default alarmService;                                                                                                                                                                                                                                                    