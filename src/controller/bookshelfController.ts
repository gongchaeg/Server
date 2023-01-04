import { Request, Response } from "express";
import { rm, sc } from "../constants";
import { fail, success } from "../constants/response";
import { BookshelfCreateDTO } from "../interfaces/bookshelf/BookshelfCreateDTO";
import { bookshelfService } from "../service";

/**
 * @route POST /bookshelf
 * @desc 내 책장에 책 등록하기
 **/
const createMybook = async (req: Request, res: Response) => {
    const bookshelfCreateDto: BookshelfCreateDTO = req.body;

    const data = await bookshelfService.createMybook(bookshelfCreateDto);

    const result = {
        bookId : data.bookId,
        bookshelfId : data.id
    }

    if (!data) {
        return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.CREATE_MYBOOK_FAIL));
    }
    return res.status(sc.CREATED).send(success(sc.CREATED, rm.CREATE_MYBOOK_SUCCESS, result)); 
};

const bookshelfController = {
    createMybook
};
  
export default bookshelfController;