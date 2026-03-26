
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