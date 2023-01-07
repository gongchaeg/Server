import { PrismaClient } from "@prisma/client";
import { BookDTO } from "../interfaces/book/BookDTO";
import { BookshelfCreateDTO } from "../interfaces/bookshelf/BookshelfCreateDTO";
import { BookshelfResDTO } from "../interfaces/bookshelf/BookshelfResDTO";
import { BookshelfUpdateDTO } from "../interfaces/bookshelf/BookshelfUpdateDTO";
import { UserDTO } from "../interfaces/user/userDTO";
import userService from "./userService";

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
      data : {
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

//* 내 책장 (메인 뷰) 조회
const getMyBookshelf = async () => {

  // section1 : friendList
  let friendList: UserDTO[] = [];
  const friendIdList = await prisma.friend.findMany({
    where : {
      // 임의로 유저 아이디 1로 박아놓음
      senderId : 1
    },
    select : {
      receiverId : true
    }
  });

  for (const user of friendIdList) {
    const userId = user.receiverId;
    const friend = await userService.getUser(userId);

    friendList?.push(friend);
  }

  // section2 : myIntro
  const myIntro = await prisma.user.findUnique({
    where : {
      // 임의로 유저 아이디 1로 박아놓음
      id : 1
    }
  });

  // section3 : picks
  const picks = await prisma.bookshelf.findMany({
    where : {
      pickIndex : { in: [1, 2, 3] } 
    },
    orderBy : {
      pickIndex : 'asc'
    },
    select : {
      pickIndex: true,
      Book : {
        select : {
          id : true,
          bookImage : true,
          bookTitle : true
        }
      },
      description : true

    }
  });

  // section4 : books
  const books = await prisma.bookshelf.findMany({
    where : {
      userId :1
    },
    select : {
      bookId: true,
      pickIndex: true,
      Book : {
        select : {
          bookImage : true,
        }
      }
    }
  })

  const data : BookshelfResDTO = {
    friendList : friendList,
    myIntro : myIntro,
    picks : picks,
    bookTotalNum : books.length,
    books: books
  };

  return data;
}

const bookshelfService = {
    createMyBook,
    getBookById,
    deleteMyBook,
    updateMyBook,
    getMyBookshelf
};

export default bookshelfService;