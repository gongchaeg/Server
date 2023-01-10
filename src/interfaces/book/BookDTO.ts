export interface BookDTO {
    id : number|null,
    Book? : {
        bookTitle? : string|null,
        bookImage? : string|null
    }|null,
    bookId? : number|null,
    description? : string | null,
    memo? : string | null,
    pickIndex? : number|null
}