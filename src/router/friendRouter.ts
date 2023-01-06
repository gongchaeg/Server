import { Router } from "express";
import { friendController } from "../controller";

const router: Router = Router();

//* 친구에게 책 추천하기 - POST /friend/:friendId/recommend
router.post("/:friendId/recommend", friendController.recommendBookToFriend);
//* 사용자 검색하기 - GET /friend?nickname={}
router.get("/", friendController.searchUser);
//* 친구 팔로우하기 - POST /friend/:friendId
router.post("/:friendId", friendController.followFriend);

export default router;