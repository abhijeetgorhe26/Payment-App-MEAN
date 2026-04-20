import User from './utils/db.js'
import generateOtp from './utils/otpGenerator.js'
import { sendEmail } from './utils/mailSender.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { tokenBlacklist } from './utils/tokenBlacklist.js';


// creating temporary array to store value for sometime until
// get verfied from user throgh otp;
const tempUsers = new Map();
console.log("All tempUsers:", tempUsers);



// verification route
export const verify = async (req, res) => {
    try {
        const { otp, email } = req.body;



        console.log("Requested email:", email);
        const tempUser = tempUsers.get(email);

        console.log(tempUser);

        if (!tempUser) {
            return res.status(400).json({
                success: false,
                message: "No OTP request found or user not registered"
            });
        }


        if (tempUser.otpExpired < Date.now()) {
            tempUsers.delete(email);

            return res.status(400).json({
                success: false,
                message: "OTP expired"
            });
        }


        if (tempUser.otpCodes !== otp) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP"
            });
        }

        const insertQuery = 'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING name, email, password';

        const result = await User.query(insertQuery, [tempUser.name, tempUser.email, tempUser.password]);


        tempUsers.delete(email);




        res.status(201).json({
            success: true,
            message: "User verified & created to DB"
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "OTP verification failed"
        });
    }


}


// registration route
export const signUp = async (req, res) => {
    try {
        const { name, email, password } = req.body;


        if (!name || !email || !password) {
            console.log("Something has missed...")
            return res.status(400).json({
                success: false,
                message: "Invalid Credintials",
            })
        }

        console.log("Everything is okay....!");


        const checkQuery = 'SELECT COUNT(*) FROM users where email = $1';
        console.log(checkQuery);

        console.log(User.query);


        const result = await User.query(checkQuery, [email]);





        if (parseInt(result.rows[0].count) > 0) {
            return res.status(400).json({
                success: false,
                message: "User already exists",
            });
        }





        const otp = generateOtp();
        console.log('otp:', otp);
        const otpExpire = Date.now() + 5 * 60 * 1000; // 5 minutes
        console.log('otpExpired:', otpExpire);



        const hashedPassword = await bcrypt.hash(password, 10);




        // Store in tempUser array to get verify from user
        tempUsers.set(email, {
            name,
            email,
            password: hashedPassword,
            otpCodes: otp,
            otpExpired: otpExpire,
        });


        await sendEmail(email, "OTP Verification", `Your OTP is ${otp}`);


        res.status(200).json({
            success: true,
            message: "Verfication pending....",
        })

    } catch (error) {

        console.log(error)
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        })
    }
};


export const signIn = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Invalid input..!"
            })
        }


        const findUser = 'SELECT * FROM users WHERE email = $1';
        const result = await User.query(findUser, [email]);
        console.log(result.rowCount);

        if (result.rowCount === 0) {
            return res.status(400).json({
                success: false,
                message: "User not found...!"
            });
        }


        const user = result.rows[0];
        console.log(user.password);
        console.log(password)


        const isMatch = await bcrypt.compare(password, user.password);


        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Invalid password"
            });
        }

        const token = jwt.sign(
            { email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );


        res.status(200).json({
            success: true,
            message: "Proceed to login....",
            token
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "I am present in login controller",
            error: error.message
        })
    }
};


export const signOut = async (req, res) => {
    try {
        let token;

        const authHeader = req.headers.authorization;

        if (authHeader && authHeader.startsWith("Bearer ")) {
            token = authHeader.split(" ")[1];
        } else if (req.cookies?.token) {
            token = req.cookies.token;
        }

        if (token) {
            tokenBlacklist.add(token); // block this token
        }

        res.clearCookie("token");

        return res.status(200).json({
            success: true,
            message: "Logged out successfully"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Logout failed"
        });
    }
};

export const testController = async (req, res) => {
    try {
        res.send("Protected this thing.......!")
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Something went wrong......!"
        })
    }
}