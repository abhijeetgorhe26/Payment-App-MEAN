import User from '../utils/db.js'

export const findUser = async (req, res) => {
    try {
        const filter = req.query.zx || '';


        console.log(filter);

        const findUser = 'SELECT * FROM users WHERE name LIKE $1'
        const result = await User.query(findUser, [`${filter}%`])

        if (result.rows.length === 0) {
            return res.status(400).json({
                success: false,
                message: `No user name start with ${filter}`
            })
        }

        res.status(200).json({
            success: true,
            users: result.rows.map(user => ({
                name: user.name,
                email: user.email
            }))
        });

    } catch (error) {
        res.status(500).json({
            success: false,

        })
    }
}