import { Router } from "express";
import { alarmController } from "../controller";
import auth from "../middlewares/auth";

const router: Router = Router();

//* 알림 조회 GET - /alarm
router.get("/", auth, alarmController.getAlarm);

export default router;