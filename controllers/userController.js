
import pool from '../db.js';
export const getallUsers = async (req, res) => {
  try {
    const allUsers = await pool.query(`select * from users`);
    if (allUsers.rows.length === 0) {
      return res.status(404).json({
        message: 'No users found.',
        code: 404,
      });
    }
    res.json(allUsers.rows);
  } catch (error) {
    console.log('error', error);
    return res.status(500).json({
      message: 'Internal Server Error: An unexpected error occurred.',
      code: 500,
    });
  }
};




export const getUser  = async (req, res) => {
    try  {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: 'User ID is required' });
        }
        const user = await pool.query(`SELECT * FROM users WHERE id = $1`, [id]);
        if (user.rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user.rows[0]);
    } catch (error) {
        console.error('Error fetching user:', error);
        return res.status(500).json({ message: 'Internal Server Error' });

    }
}