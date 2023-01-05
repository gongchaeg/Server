import { Router } from "express";
import friendRouter from "./friendRouter";
import recommendRouter from "./recommendRouter";

const router: Router = Router();

//router.use("/user", friendRouter);
router.use("/friend", friendRouter);
router.use("/bookshelf", friendRouter);
router.use("/recommend", recommendRouter);
//router.use("/pick", friendRouter);
//router.use("/alarm", friendRouter);

export default router;