import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { findUser } from "../controllers/userController.js";



const router = express.Router();


// for user handling
router.get('/bulk', authMiddleware, findUser);


export default router;