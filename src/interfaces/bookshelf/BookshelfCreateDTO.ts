export interface BookshelfCreateDTO {
    bookImage : string,
    bookTitle : string,
    author : string | null,
    publisher: string,
    description : string,
    memo : string
}