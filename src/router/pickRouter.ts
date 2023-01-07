import { Router } from "express";
import { pickController } from "../controller";

const router: Router = Router();

//* 책 PICK 수정 - PUT /pick
router.patch("/", pickController.patchPick);

//* 책 전체 조회 - GET /pick/all
router.get("/all", pickController.getBook);

export default router;