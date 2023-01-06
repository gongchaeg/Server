import { PrismaClient } from "@prisma/client";
import { BookshelfCreateDTO } from "../interfaces/bookshelf/BookshelfCreateDTO";
import { BookshelfUpdateDTO } from "../interfaces/bookshelf/BookshelfUpdateDTO";

const prisma = new PrismaClient();

//* 내 책장에 책 등록
const createMyBook = async (bookshelfCreateDto : BookshelfCreateDTO) => {

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

//* 등록한 책 상세 정보 조회
const getBookById = async (bookId: number)=> {
  const bookData = await prisma.bookshelf.findFirst({
    where: {
      bookId : bookId,
      // 일단 userId 박아두고 작업
      userId : 1
    },
    select : {
      description : true,
      memo : true,
      Book : {
        select : {
          bookImage : true,
          bookTitle : true,
          author : true
        }
      }
    }
  });

  return bookData;
};

//* 등록한 책 삭제
const deleteMyBook = async (bookId : number) => {
  const data = await prisma.bookshelf.deleteMany({
    where: {
      bookId: bookId,
      // 일단 userId 박아두고 작업
      userId : 1
    }
  });
}

//* 등록한 책 수정
const updateMyBook = async (bookId : number, bookshelfUpdateDto : BookshelfUpdateDTO) => {

  //unique한 bookshelfId 값
  const bookshelfData = await prisma.bookshelf.findFirst({
    where : {
      bookId : bookId,
      userId : 1
    }
  });

  const bookshelfId = bookshelfData?.id;

  //요청한 bookId와 userId에 해당하는 데이터가 없음
  if (!bookshelfData) {
    return null;
  }

  const data = await prisma.bookshelf.update({
    where: {
      id : bookshelfId
    },
    data: {
      description : bookshelfUpdateDto.description,
      memo : bookshelfUpdateDto.memo
    },
  });

  return data;
}

const bookshelfService = {
    createMyBook,
    getBookById,
    deleteMyBook,
    updateMyBook
};

export default bookshelfService;