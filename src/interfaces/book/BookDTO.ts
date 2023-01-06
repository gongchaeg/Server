export interface BookDTO {
    bookId : number,
    bookTitle : string,
    bookImage : string,
    description? : string | null,
    memo? : string | null,
    pickIndex? : number
}