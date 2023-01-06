import { Router } from "express";
import bookshelfRouter from "./bookshelfRouter";
import friendRouter from "./friendRouter";
import recommendRouter from "./recommendRouter";


const router: Router = Router();

//router.use("/user", userRouter);
router.use("/friend", friendRouter);
router.use("/bookshelf", bookshelfRouter);
router.use("/recommend", recommendRouter);
router.use("/pick", pickRouter);
//router.use("/alarm",)alarmRouter;

export default router;