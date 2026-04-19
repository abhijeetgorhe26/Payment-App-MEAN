import User from '../utils/db.js'


export const checkBalance = async (req, res) => {
    try {
        const user = req.user.email;
        console.log("this current user: ", user);

        const findUser = await User.query('SELECT * FROM users WHERE email = $1', [user]);

        console.log(findUser.rows[0].id);

        const checkQuery = await User.query('SELECT balance FROM accounts WHERE user_id = $1', [findUser.rows[0].id]);

        let value = checkQuery.rows[0].balance;

        res.status(200).json({
            balance: value
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Something went wrong...!",
            error: error.message
        })
    }
}


export const transfer = async (req, res) => {
    try {
        const { to, amount } = req.body;


        const currUser = await User.query('SELECT id from users WHERE email = $1', [req.user.body]);
        const toUser = await User.query('SELECT id from users WHERE email = $1', [to]);


        const toUserId = toUser.rows[0].id;
        console.log(toUserId);

        const currBalance = await User.query('SELECT balance from accounts WHERE user_id = $1', [toUserId]);


        console.log("Avl. Bal:", currBalance.rows[0].balance);

        if (parseFloat(currBalance.rows[0].balance) < amount) {
            return res.status(400).json({
                success: false,
                message: "Insufficient Balance"
            })
        }
        let totalBalance = Number((parseFloat(currBalance.rows[0].balance) + parseFloat(amount).toFixed(2)))
        await User.query('Update SET balance = $1 WHERE user_id = $2', [totalBalance, toUserId])






    } catch (error) {

    }
}