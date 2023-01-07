import { Router } from "express";
import { recommendController } from "../controller";

const router: Router = Router();

//* 책추천 전체 조회하기 GET - /recommend
router.get("/", recommendController.getRecommend);

export default router;