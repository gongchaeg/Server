import { PrismaClient } from "@prisma/client";
import { BookshelfCreateDTO } from "../interfaces/bookshelf/BookshelfCreateDTO";

const prisma = new PrismaClient();

//* 내 책장에 책 등록
const createMybook = async (bookshelfCreateDto : BookshelfCreateDTO) => {

  const bookData = await prisma.book.findFirst({
      where : {
        bookTitle : bookshelfCreateDto.bookTitle,
        author : bookshelfCreateDto.author
      }
  });

  let bookId = bookData?.id;

  if (!bookId) {
    bookId = -1;
  }

  const data = await prisma.bookshelf.create({
      data: {
        pickIndex : 0,
        description : bookshelfCreateDto.description,
        memo : bookshelfCreateDto.memo,
        // 일단 userId 박아두고 작업
        User : { 
          connect : {
            id : 1
          }
        },
        Book : {
          connectOrCreate : {
            where : {
              id : bookId
            },
            create : {
              bookTitle : bookshelfCreateDto.bookTitle,
              author : bookshelfCreateDto.author,
              bookImage : bookshelfCreateDto.bookImage
            }
          }
        }
      }
  });

  return data;
};

const bookshelfService = {
    createMybook
};

export default bookshelfService;