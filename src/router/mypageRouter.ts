import { Router } from "express";
import { mypageController } from "../controller";

const router: Router = Router();

//* 사용자 삭제하기 DELETE /mypage/withdraw
router.delete("/withdraw", mypageController.deleteUser);

export default router;