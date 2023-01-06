import { User } from "@prisma/client";
import { BookDTO } from "../book/BookDTO";
import { PickBook } from "../pick/PickBook";
import { UserDTO } from "../user/userDTO";

export interface BookshelfResDTO {
    friendList? : UserDTO[]|null,
    myIntro? : User|null,
    picks? : PickBook[]|null,
    bookTotalNum? : number|null,
    books? : BookDTO[]|null   
}