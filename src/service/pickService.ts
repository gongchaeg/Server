import { PrismaClient } from "@prisma/client";
import { PickPatchRequestDTO } from "../interfaces/pick/PickPatchRequestDTO";
const prisma = new PrismaClient();

//* Pick한 책 수정
const patchPick = async (pickPatchRequestDTO: PickPatchRequestDTO) => {

    // 원래 pick값 false로 수정하기
    //! pickIndex 초기에 null 가능한지
    const previousPick = await prisma.bookshelf.updateMany({
        where: {
            pickIndex: { in: [1, 2, 3] },
        },
        data: {
            pickIndex: 0,
        }
    });


    // 새롭게 pick한 값 index 세팅하기
    if (pickPatchRequestDTO.firstPick != null) {
        const firstPick = await prisma.bookshelf.updateMany({
            where: {
                bookId: pickPatchRequestDTO.firstPick,
            },
            data: {
                pickIndex: 1
            }
        });
    }

    if (pickPatchRequestDTO.secondPick != null) {
        const secondPick = await prisma.bookshelf.updateMany({
            where: {
                bookId: pickPatchRequestDTO.secondPick,
            },
            data: {
                pickIndex: 2,
            }
        })
    }

    if (pickPatchRequestDTO.thirdPick != null) {
        const thirdPick = await prisma.bookshelf.updateMany({
            where: {
                bookId: pickPatchRequestDTO.thirdPick,
            },
            data: {
                pickIndex: 3,
            }
        })
    }

    return previousPick.count;

}

//* 책 전체 조회
const getBook = async () => {
    const books = await prisma.bookshelf.findMany({
        where: {
            userId: 1,
        },
        select: {
            id: true,
            pickIndex: true,
            Book: {
                select: {
                    id: true,
                    bookImage: true,
                }
            }
        },
    });
    return books;
}

const pickService = {
    patchPick,
    getBook
}

export default pickService;