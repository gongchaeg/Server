import { Router } from "express";
import { mypageController } from "../controller";
import { upload } from "../middlewares";

const router: Router = Router();

//* 사용자 삭제하기 DELETE /mypage/withdraw
router.delete("/withdraw", mypageController.deleteUser);
//* 프로필 수정하기
router.patch("/profile", upload.single("file"), mypageController.patchUser);

export default router;