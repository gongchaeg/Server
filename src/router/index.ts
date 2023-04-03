import { Router } from "express";
import bookshelfRouter from "./bookshelfRouter";
import friendRouter from "./friendRouter";
import recommendRouter from "./recommendRouter";
import pickRouter from "./pickRouter";
import alarmRouter from "./alarmRouter";
import authRouter from "./authRouter";
import userRouter from "./userRouter";

const router: Router = Router();

//router.use("/user", userRouter);
router.use("/friend", friendRouter);
router.use("/bookshelf", bookshelfRouter);
router.use("/recommend", recommendRouter);
router.use("/pick", pickRouter);
router.use("/alarm", alarmRouter);
router.use("/auth", authRouter);
router.use("/user", userRouter);

export default router;