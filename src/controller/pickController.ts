import { Request, Response } from "express";
import { fail, success } from "../constants/response";
import { rm, sc } from "../constants";
import { pickService } from "../service";
import { PickPatchRequestDTO } from "../interfaces/pick/PickPatchRequestDTO";
import { slackErrorMessage } from "../modules/slackErrorMessage";
import { sendWebhookMessage } from "../modules/slackWebhook";

//* Pick한 책 수정
const patchPick = async (req: Request, res: Response) => {
    const pickPatchRequestDTO: PickPatchRequestDTO = req.body;
    const auth = req.header("auth");
    if (!auth) {
        return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.BAD_REQUEST));
    }

    if (!auth) {
        return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.BAD_REQUEST));
    }
    if (pickPatchRequestDTO.firstPick == null || pickPatchRequestDTO.secondPick == null || pickPatchRequestDTO.thirdPick == null) {
        return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.FAIL_PATCH_PICK));
    }

    try {
        // 슬랙 메시지 에러 확인을 하기 위함
        // let pickData = JSON.parse(req.body);
        const data = await pickService.patchPick(pickPatchRequestDTO, +auth);

        if (!data) {
            return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.FAIL_PATCH_PICK));
        }

        return res.status(sc.OK).send(success(sc.OK, rm.SUCCESS_PATCH_PICK));

    } catch (error) {
        const errorMessage = slackErrorMessage(req.method.toUpperCase(), req.originalUrl, error, +auth, req.statusCode);

        sendWebhookMessage(errorMessage);

        res.status(sc.INTERNAL_SERVER_ERROR)
            .send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
    }


}

//* 책 전체 조회
const getBook = async (req: Request, res: Response) => {
    const auth = req.header("auth");

    if (!auth) {
        return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.BAD_REQUEST));
    }
    const data = await pickService.getBook(+auth);

    try {
        if (!data) {
            return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.FAIL_GET_BOOK));
        }

        return res.status(sc.OK).send(success(sc.OK, rm.SUCCESS_GET_BOOK, data));
    } catch (error) {
        const errorMessage = slackErrorMessage(req.method.toUpperCase(), req.originalUrl, error, +auth, req.statusCode);

        sendWebhookMessage(errorMessage);

        res.status(sc.INTERNAL_SERVER_ERROR)
            .send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
    }

}

const pickController = {
    patchPick,
    getBook,
}

export default pickController;