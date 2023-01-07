import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

//* 알림 조회
const getAlarm = async () => {

    const alarmData = await prisma.alarm.findMany({
        where: {
            receiverId: 1,
        },
    })

    const promises = 

    
}

const alarmService = {
    getAlarm,
}

export default alarmService;                                                                                                                                                                                                                                                    