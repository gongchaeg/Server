import { Router } from "express";
import { friendController } from "../controller";

const router: Router = Router();

//* 친구에게 책 추천하기 - POST /friend/:friendId/recommend
router.post("/:friendId/recommend", friendController.recommendBookToFriend);


export default router;