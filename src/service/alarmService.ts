import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

//* 알림 조회
const getAlarm = async () => {

}

const alarmService = {
    getAlarm,
}

export default alarmService;