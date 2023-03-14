import { PrismaClient } from "@prisma/client";
import { BookshelfCreateDTO } from "../interfaces/bookshelf/BookshelfCreateDTO";

const prisma = new PrismaClient();

//* 책 DB에 책 등록
const getBookId = async (bookshelfCreateDto : BookshelfCreateDTO) => {
    const bookData = await prisma.book.findFirst({
        where : {
          bookTitle : bookshelfCreateDto.bookTitle,
          author : bookshelfCreateDto.author,
          publisher: bookshelfCreateDto.publisher
        }
    });

    return bookData;
}

const bookService = {
    getBookId
}

export default bookService;