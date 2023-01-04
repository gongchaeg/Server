import { PrismaClient } from "@prisma/client";
import { BookshelfCreateDTO } from "../interfaces/bookshelf/BookshelfCreateDTO";

const prisma = new PrismaClient();

//* 내 책장에 책 등록
const createMybook = async (bookshelfCreateDto : BookshelfCreateDTO) => {
    
};

const bookshelfService = {
    createMybook
};

export default bookshelfService;