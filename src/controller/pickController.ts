import { Request, Response } from "express";
import { fail, success } from "../constants/response";
import { rm, sc } from "../constants";
import { pickService } from "../service";
import { PickPatchRequestDTO } from "../interfaces/pick/PickPatchRequestDTO";

//* Pick한 책 수정
const patchPick = async (req: Request, res: Response) => {
    const pickPatchRequestDTO: PickPatchRequestDTO = req.body;


    const data = await pickService.patchPick(pickPatchRequestDTO);

    if (!data) {
        return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.FAIL_PATCH_PICK));
    }

    return res.status(sc.OK).send(success(sc.OK, rm.SUCCESS_PATCH_PICK));

}

//* 책 전체 조회
const getBook = async (req: Request, res: Response) => {
    const data = await pickService.getBook();

    if (!data) {
        return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.FAIL_GET_BOOK));
    }

    return res.status(sc.OK).send(success(sc.OK, rm.SUCCESS_GET_BOOK, data));
}

const pickController = {
    patchPick,
    getBook,
}

export default pickController;