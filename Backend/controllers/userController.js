import User from '../utils/db.js'

export const findUser = async (req, res) => {
    try {
        const filter = req.query.filter || '';


        console.log(filter);

        const findUser = 'SELECT * FROM users WHERE name LIKE $1'
        const result = await User.query(findUser, [`${filter}%`])

        if (result.rows.length === 0) {
            return res.status(200).json({
                success: true,
                users: []
            })
        }

        res.status(200).json({
            success: true,
            users: result.rows.map(user => ({
                id: user.id,
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