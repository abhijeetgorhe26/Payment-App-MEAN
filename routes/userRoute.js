import { signIn, signUp, verify, testController } from "../controllers/userAuth.js";
import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { findUser } from "../controllers/userController.js";

const router = express.Router();

// router.get('/signup', signUp);
// router.get('/signin', signIn);


// for auth
router.post('/signup', signUp);
router.post('/verify', verify);
router.post('/login', signIn);







router.get('/test', authMiddleware, testController);
export default router;