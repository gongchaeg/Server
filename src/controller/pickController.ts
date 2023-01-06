import { Request, Response } from "express";
import { fail, success } from "../constants/response";
import { rm, sc } from "../constants";

const pickRouter = async (req: Request, res: Response) => {
    const { previousPick, newPick } = req.body;

    const data = await pickService.patchPick();

}

const pickController = {
    pickRouter,
}

export default pickController;