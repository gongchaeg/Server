import { User } from "@prisma/client";
import { BookDTO } from "../book/BookDTO";
import { PickBook } from "../pick/PickBook";
import { IntroDTO } from "../user/IntroDTO";
import { UserDTO } from "../user/userDTO";

export interface FriendBookshelfResDTO {
    myIntro? : IntroDTO|null,
    friendList? : UserDTO[]|null,
    friendIntro? : IntroDTO|null,
    picks? : PickBook[]|null,
    bookTotalNum? : number|null,
    books? : BookDTO[]|null   
}