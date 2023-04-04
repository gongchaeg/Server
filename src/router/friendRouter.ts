import { Router } from "express";
import { friendController } from "../controller";
import auth from "../middlewares/auth";

const router: Router = Router();

//* 친구에게 책 추천하기 - POST /friend/:friendId/recommend
router.post("/:friendId/recommend", friendController.recommendBookToFriend);
//* 사용자 검색하기 - GET /friend?nickname={}
router.get("/", friendController.searchUser);
//* 친구 팔로우하기 - POST /friend/:friendId
router.post("/:friendId", friendController.followFriend);
//* 친구 팔로우 취소하기 - DELETE /friend/:friendId
router.delete("/:friendId", auth, friendController.deleteFollowFriend);
//* 친구 신고하기 - POST /friend/:friendId/report
router.post("/:friendId/report", friendController.postReport);
//* 친구 차단하기 - POST /friend/block/:friendId
router.post("/block/:friendId", auth, friendController.blockFriend);

export default router;