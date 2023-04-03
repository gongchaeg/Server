import { Router } from "express";
import { mypageController } from "../controller";
import { upload } from "../middlewares";

const router: Router = Router();

//* 사용자 삭제하기 DELETE /mypage/withdraw
router.delete("/withdraw", mypageController.deleteUser);
//* 프로필 수정하기 PATCH /mypage/profile
router.patch("/profile", upload.single("file"), mypageController.patchUser);
//* 사용자 정보 조회하기 GET /mypage/profile
router.get("/profile", upload.single("file"), mypageController.getUserData);
export default router;