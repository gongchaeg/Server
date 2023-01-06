import { BookDTO } from "../book/BookDTO";
import { UserDTO } from "../user/userDTO";

export interface BookshelfResDTO {
    friendList : UserDTO[],
    myIntro : object,
    picks : BookDTO[],
    bookTotalNum : number,
    books : BookDTO[]   
}