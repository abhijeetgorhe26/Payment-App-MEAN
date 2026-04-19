import jwt from 'jsonwebtoken';
import { tokenBlacklist } from '../utils/tokenBlacklist.js';


export const authMiddleware = (req, res, next) => {
    try {

        let token;
        const authHeader = req.headers.authorization;


        // ✅ Check first
        if (authHeader && authHeader.startsWith("Bearer ")) {
            token = authHeader.split(" ")[1];
        } else if (req.cookies?.token) {
            token = req.cookies.token;
        }

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Login required"
            });
        }

        // 🚫 Check blacklist
        if (tokenBlacklist.has(token)) {
            return res.status(401).json({
                success: false,
                message: "Token already logged out"
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded;

        next();

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token",
            error: error.message
        });
    }
};