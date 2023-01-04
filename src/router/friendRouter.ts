import { Router } from "express";
import { friendCont }

const router: Router = Router();

//* 친구에게 책 추천하기 - POST /friend/:friendId/recommend
router.post("/friend/:friendId/recommend");


export default router;