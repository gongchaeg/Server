import { Router } from "express";
import { pickController } from "../controller";
import auth from "../middlewares/auth";

const router: Router = Router();

//* 책 PICK 수정 - PUT /pick
router.patch("/", auth, pickController.patchPick);

//* 책 전체 조회 - GET /pick/all
router.get("/all", auth, pickController.getBook);

export default router;