import { Router } from "express";
import { pickController } from "../controller";

const router: Router = Router();

//* 책 PICK 수정 - PUT /pick
router.patch("/", pickController.patchPick);

export default router;