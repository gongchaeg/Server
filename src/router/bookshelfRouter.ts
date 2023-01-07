import { Router } from "express";
import { bookshelfController } from "../controller";
//import { auth } from "../middlewares";

const router: Router = Router();

//* 내 책장에 책 등록하기 POST /bookshelf
router.post("/", bookshelfController.createMyBook);

//* 등록한 책 상세 정보 불러오기 GET /bookshelf/detail/:bookId
router.get("/detail/:bookId", bookshelfController.getBookById);

//* 등록한 책 삭제하기 DELETE /bookshelf/:bookId
router.delete("/:bookId", bookshelfController.deleteMyBook);

//* 등록한 책 정보 수정하기 PATCH /bookshelf/:bookId
router.patch("/:bookId", bookshelfController.updateMyBook);

//* 내 책장 (메인 뷰) 조회하기 GET /bookshelf
router.get("/", bookshelfController.getMyBookshelf);

//* 친구 책장 조회하기 GET /bookshelf/friend/:friendId
router.get("/friend/:friendId", bookshelfController.getFriendBookshelf);

export default router;