import { Router } from "express";
import { bookshelfController } from "../controller";
import { auth } from "../middlewares";
//import { auth } from "../middlewares";

const router: Router = Router();

//* 내 책장에 책 등록하기 POST /bookshelf
router.post("/", auth, bookshelfController.createMyBook);

//* 등록한 책 상세 정보 불러오기 GET /bookshelf/detail/:bookshelfId
router.get("/detail/:bookshelfId", auth, bookshelfController.getBookById);

//* 등록한 책 삭제하기 DELETE /bookshelf/:bookshelfId
router.delete("/:bookshelfId", auth, bookshelfController.deleteMyBook);

//* 등록한 책 정보 수정하기 PATCH /bookshelf/:bookshelfId
router.patch("/:bookshelfId", auth, bookshelfController.updateMyBook);

//* 내 책장 (메인 뷰) 조회하기 GET /bookshelf
router.get("/", auth, bookshelfController.getMyBookshelf);

//* 친구 책장 조회하기 GET /bookshelf/friend/:friendId
router.get("/friend/:friendId", auth, bookshelfController.getFriendBookshelf);

export default router;