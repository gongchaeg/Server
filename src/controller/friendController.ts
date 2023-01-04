import { Request, Response } from "express";
import { fail, success } from "../constants/response";
import { rm, sc } from "../constants";

const recommendBookToFriend = async (req: Request, res: Response) => {
    const { friendId } = req.params;

    if (!friendId) {
        return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.NOT_FOUND_FRIEND_ID));
    }
}