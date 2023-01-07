export interface BookDTO {
    Book? : {
        bookTitle? : string|null,
        bookImage? : string|null
    }|null,
    bookId? : number|null,
    description? : string | null,
    memo? : string | null,
    pickIndex? : number|null
}