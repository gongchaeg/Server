import { Book } from "@prisma/client"

export interface PickBook {
    description? : string|null,
    pickIndex? : number|null,
    Book? : {
        id : number|null,
        bookTitle : string|null,
        bookImage : string|null
    }|null
}