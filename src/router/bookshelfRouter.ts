import { Router } from "express";
import { bookshelfController } from "../controller";
//import { auth } from "../middlewares";

const router: Router = Router();

//* 내 책장에 책 등록하기 POST /bookshelf
router.post("/", bookshelfController.createMybook);

//* 등록한 책 상세 정보 불러오기 GET /bookshelf/detail?bookId={}
router.get("/detail", bookshelfController.getBookById);

export default router;