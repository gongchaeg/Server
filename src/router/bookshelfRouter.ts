import { Router } from "express";
import { bookshelfController } from "../controller";
//import { auth } from "../middlewares";

const router: Router = Router();

//* 내 책장에 책 등록하기 POST /bookshelf
router.post("/rating/:contentId", bookshelfController.createMybook);

export default router;