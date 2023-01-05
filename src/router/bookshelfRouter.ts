import { Router } from "express";
import { bookshelfController } from "../controller";
//import { auth } from "../middlewares";

const router: Router = Router();

//* 내 책장에 책 등록하기 POST /bookshelf
router.post("/", bookshelfController.createMybook);

//* 등록한 책 상세 정보 불러오기 GET /bookshelf/detail/:bookId
router.get("/detail/:bookId", bookshelfController.getBookById);

//* 등록한 책 삭제하기 DELETE /bookshelf/:bookId
router.delete("/:bookId", bookshelfController.deleteMyBook);

export default router;