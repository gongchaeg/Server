import { Router } from "express";
import { recommendController } from "../controller";

const router: Router = Router();

router.get("/", recommendController.getRecommend);

export default router;