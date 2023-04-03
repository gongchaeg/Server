import { Router } from "express";
import { userController } from "../controller";

const router: Router = Router();

//* 닉네임 중복 검사 POST /user/duplicate
router.post("/duplicate", userController.postDuplicateNickname);

export default router;