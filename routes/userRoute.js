import { signIn, signUp } from "../controllers/userAuth.js";
import express from "express";

const router = express.Router();

// router.get('/signup', signUp);
// router.get('/signin', signIn);

router.post('/signup', signUp);


export default router;