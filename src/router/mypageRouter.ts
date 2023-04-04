import { Router } from "express";
import { mypageController } from "../controller";
import { auth, upload } from "../middlewares";

const router: Router = Router();

//* 사용자 삭제하기 DELETE /mypage/withdraw
router.delete("/withdraw", auth, mypageController.deleteUser);
//* 프로필 수정하기 PATCH /mypage/profile
router.patch("/profile", auth, upload.single("file"), mypageController.patchUser);
//* 사용자 정보 조회하기 GET /mypage/profile
router.get("/profile", auth, upload.single("file"), mypageController.getUserData);
//* 차단 리스트에서 차단 해제하기 DELETE /mypage/blocklist/:friendId
router.delete("/blocklist/:friendId", auth, mypageController.cancleBlock);
//* 차단 리스트 조회하기 GET /mypage/blocklist
router.get("/blocklist", auth, mypageController.getBlockList);

export default router;