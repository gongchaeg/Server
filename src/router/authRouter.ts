import { Router } from "express";
import AuthController from "../controller/authController";

const router: Router = Router();

router.post("/signin", AuthController.signIn);
router.patch("/signup", AuthController.signUp);
router.get("/test/signin", AuthController.testSignin);

export default router;