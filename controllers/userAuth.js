import User from '../utils/db.js'
import generateOtp from '../utils/otpGenerator.js'
import { sendEmail } from '../utils/mailSender.js';


// creating temporary array to store value for sometime until
// get verfied from user throgh otp;
const tempUser = new Map();





// registration route
export const signUp = async (req, res) => {

    try {
        const { name, email, password } = req.body;

        if (name == '' || email == '', password == '') {
            return res.status(400).json({
                success: false,
                message: 'Invalid credentials',
                error
            });
        }

        const checkQuery = 'SELECT COUNT(*) FROM users where email = $1';
        const values = [email];
        const result = await User.query(checkQuery, values);
        console.log("Result: ", result.rows[0].count);

        if (result.rows[0].count > 0) {
            return res.status(400).json({
                success: false,
                message: "User already exists",
                error
            });
        }


        const otp = generateOtp();
        console.log('otp:', otp);
        const otpExpire = Date.now() + 30 * 1000;
        console.log('otpExpired:', otpExpire);


        // Store in tempUser array to get verify from user
        tempUser.set(email, {
            name,
            email,
            password,
            otpcodes: otp,
            otpexpired: otpExpire,
            created_at: Date.now()
        })


        await sendEmail(email, "OTP Verification", `Your OTP is ${otp}`);


        res.status(200).json({
            success: true,
            message: "Verfication pending....",
            error
        })

    } catch (error) {
        res.status(502).json({
            error: error.message
        })
    }
};


export const signIn = async (req, res) => {
    res.send("Hey from signIp");
};