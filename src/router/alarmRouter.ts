import { Router } from "express";
import { alarmController } from "../controller";

const router: Router = Router();

//* 알림 조회 GET - /alarm
router.get("/", alarmController.getAlarm);

export default router;