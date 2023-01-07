import { Request, Response } from "express";
import { rm, sc } from "../constants";
import { fail, success } from "../constants/response";
import { BookshelfCreateDTO } from "../interfaces/bookshelf/BookshelfCreateDTO";
import { BookshelfUpdateDTO } from "../interfaces/bookshelf/BookshelfUpdateDTO";
import { bookshelfService } from "../service";

/**
 * @route POST /bookshelf
 * @desc 내 책장에 책 등록하기
 **/
const createMyBook = async (req: Request, res: Response) => {
    const bookshelfCreateDto: BookshelfCreateDTO = req.body;

    const data = await bookshelfService.createMyBook(bookshelfCreateDto);

    const result = {
        bookId : data.bookId,
        bookshelfId : data.id
    }

    if (!data) {
        return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.CREATE_MYBOOK_FAIL));
    }
    return res.status(sc.CREATED).send(success(sc.CREATED, rm.CREATE_MYBOOK_SUCCESS, result)); 
};

/**
 * @route GET /bookshelf/detail/:bookId
 * @desc 등록한 책의 상세 정보 불러오기
 */
const getBookById = async (req: Request, res: Response) => {

    const { bookId } = req.params;

    const data = await bookshelfService.getBookById(+bookId); 

    if (!data) {
        return res.status(sc.NOT_FOUND).send(fail(sc.NOT_FOUND, rm.READ_MYBOOK_FAIL));
    }
    return res.status(sc.OK).send(success(sc.OK, rm.READ_MYBOOK_SUCCESS, data));
}

/**
 * @route DELETE /bookshelf/:bookId
 * @desc 등록한 책 삭제하기
 */
const deleteMyBook = async (req: Request, res: Response) => {

    const { bookId } = req.params;

    await bookshelfService.deleteMyBook(+bookId);

    return res.status(sc.OK).send(success(sc.OK, rm.DELETE_MYBOOK_SUCCESS));
}

/**
 * @route PATCH /bookshelf/:bookId
 * @desc 등록한 책 정보 수정하기
 */
const updateMyBook = async (req: Request, res: Response) => {
    const bookshelfUpdateDto: BookshelfUpdateDTO = req.body;
    const { bookId } = req.params;
  
    if (!bookshelfUpdateDto) {
      return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.UPDATE_MYBOOK_FAIL));
    }
  
    const data = await bookshelfService.updateMyBook(+bookId, bookshelfUpdateDto);

    if (!data) {
        return res.status(sc.NOT_FOUND).send(fail(sc.NOT_FOUND, rm.READ_MYBOOK_FAIL));
    }
    return res.status(sc.OK).send(success(sc.OK, rm.UPDATE_MYBOOK_SUCCESS));
}

/**
 * @route GET /bookshelf
 * @desc 내 책장 (메인 뷰) 조회하기
 */
const getMyBookshelf = async (req: Request, res: Response) => {
    const data = await bookshelfService.getMyBookshelf();

    if (!data) {
        return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.READ_BOOKSHELF_FAIL));
    }
    return res.status(sc.OK).send(success(sc.OK, rm.READ_BOOKSHELF_SUCCESS, data));

}

/**
 * @route GET /bookshelf/friend/:friendId
 * @desc 친구 책장 조회하기
 */
const getFriendBookshelf = async (req: Request, res: Response) => {
    const data = await bookshelfService.getFriendBookshelf();

    if (!data) {
        return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.READ_FRIEND_BOOKSHELF_FAIL));
    }
    return res.status(sc.OK).send(success(sc.OK, rm.READ_FRIEND_BOOKSHELF_SUCCESS, data));

}

const bookshelfController = {
    createMyBook,
    getBookById,
    deleteMyBook,
    updateMyBook,
    getMyBookshelf,
    getFriendBookshelf
};
  
export default bookshelfController;