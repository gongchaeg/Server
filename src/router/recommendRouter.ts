import { Router } from "express";
import { recommendController } from "../controller";
import auth from "../middlewares/auth";

const router: Router = Router();

//* 책추천 전체 조회하기 GET - /recommend
router.get("/", auth, recommendController.getRecommend);

export default router;