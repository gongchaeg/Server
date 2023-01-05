import { Router } from "express";

const router: Router = Router();

router.get("/", recommendController.getRecommend);