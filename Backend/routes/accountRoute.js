import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { checkBalance, transfer } from "../controllers/accountController.js";




const router = express.Router();


// for user handling
router.get('/balance', authMiddleware, checkBalance);
router.post('/transfer', authMiddleware, transfer);


export default router;