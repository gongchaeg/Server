import { Router } from "express";
import AuthController from "../controller/authController";

const router: Router = Router();

router.post("/signin", AuthController.signIn);
router.patch("/signup", AuthController.signUp);

export default router;