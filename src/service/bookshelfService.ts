import { FriendBookshelfResDTO } from './../interfaces/bookshelf/FriendBookshelfResDTO';
import {PrismaClient } from "@prisma/client";
import { BookDTO } from "../interfaces/book/BookDTO";
import { BookshelfCreateDTO } from "../interfaces/bookshelf/BookshelfCreateDTO";
import { MyBookshelfResDTO } from "../interfaces/bookshelf/MyBookshelfResDTO";
import { BookshelfUpdateDTO } from "../interfaces/bookshelf/BookshelfUpdateDTO";
import { UserDTO } from "../interfaces/user/UserDTO";
import userService from "./userService";
import { IntroDTO } from "../interfaces/user/IntroDTO";
import { sc } from '../constants';
import { rm } from 'fs';

const prisma = new PrismaClient();

//* 내 책장에 책 등록
const createMyBook = async (userId : number, bookshelfCreateDto : BookshelfCreateDTO) => {

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

  const bookshelf = await prisma.bookshelf.create({
      data: {
        pickIndex : 0,
        description : bookshelfCreateDto.description,
        memo : bookshelfCreateDto.memo,

        User : { 
          connect : {
            id : userId
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

  // 나를 팔로우하는 친구들에게 알림 보내기
  const follows = await prisma.friend.findMany({
    where : {
      receiverId : 1
    },
    select : {
      senderId : true
    }
  });

  //console.log(follows.length);

  for ( const follow of follows ) {
    const alarm = await prisma.alarm.create({
      data : {
        senderId : 1,
        receiverId : follow.senderId,
        typeId : 3
      }
    });

    const newBookAlarm =  await prisma.newBookAlarm.create({
      data : {
        alarmId : alarm.id,
        bookshelfId : bookshelf.id
      }
    });
  }

  return bookshelf;
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

  //* 책장에 없는 책을 삭제하려고 하면 에러
  const bookdata = await prisma.bookshelf.findFirst({
    where : {
      bookId : bookId,
      userId : 1
    }
  });

  if (!bookdata) {
    return sc.NOT_FOUND;
  }

  const data = await prisma.bookshelf.deleteMany({
    where: {
      bookId: bookId,
      // 일단 userId 박아두고 작업
      userId : 1
    }
  });

  return data;
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
    },
    orderBy : {
      receiverId : "asc"
    }
  });

  for (const user of friendIdList) {
    const userId = user.receiverId;
    const friend = await userService.getUser(userId);

    friendList?.push(friend);
  }

  // section2 : myIntro
  const myIntro : IntroDTO|null = await prisma.user.findUnique({
    where : {
      // 임의로 유저 아이디 1로 박아놓음
      id : 1
    }
  });

  // section3 : picks
  const picks = await prisma.bookshelf.findMany({
    where : {
      pickIndex : { in: [1, 2, 3] },
      userId : 1
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
      id:true,
      bookId: true,
      pickIndex: true,
      Book : {
        select : {
          bookImage : true,
        }
      }
    }
  })

  const data : MyBookshelfResDTO = {
    friendList : friendList,
    myIntro : myIntro,
    picks : picks,
    bookTotalNum : books.length,
    books: books
  };

  return data;
}

//* 친구 책장 조회
const getFriendBookshelf = async (friendId : number) => {

  //? 친구 테이블에 데이터가 없다면 에러
  const isFriend = await prisma.friend.findFirst({
    where : {
      receiverId : friendId,
      senderId : 1
    }
  });

  if (isFriend == null) {
    return sc.NOT_FOUND;
  }

  // section1 : myIntro
  const myIntro = await prisma.user.findUnique({
    where : {
      // 임의로 유저 아이디 1로 박아놓음
      id : 1
    },
    select : {
      nickname : true,
      profileImage : true
    }
  });

  // section2 : friendList
  let friendList: UserDTO[] = [];
  const friendIdList = await prisma.friend.findMany({
    where : {
      // 임의로 유저 아이디 1로 박아놓음
      senderId : 1
    },
    select : {
      receiverId : true
    },
    orderBy : {
      receiverId : "asc"
    }
  });

  for (const user of friendIdList) {
    const userId = user.receiverId;
    const friend = await userService.getUser(userId);

    friendList?.push(friend);
  }

  // section3 : friendIntro
  const friendIntro : IntroDTO|null = await prisma.user.findUnique({
    where : {
      id : friendId
    }
  });

  // section4 : picks
  const picks = await prisma.bookshelf.findMany({
    where : {
      pickIndex : { in: [1, 2, 3] },
      userId : friendId
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

  // section5 : books
  const books = await prisma.bookshelf.findMany({
    where : {
      userId : friendId
    },
    select : {
      id : true,
      bookId: true,
      pickIndex: true,
      Book : {
        select : {
          bookImage : true,
        }
      }
    }
  })

  const data : FriendBookshelfResDTO = {
    myIntro : myIntro,
    friendList : friendList,
    friendIntro : friendIntro,
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
    getMyBookshelf,
    getFriendBookshelf
};

export default bookshelfService;