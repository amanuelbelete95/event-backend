import pool from '../../../db.js';
export const getUser = async (id) => {
  try {
    if (!id) return;
    const getUser = await pool.query(`select * from users where id = $1`, [id]);

    if (getUser.rows.length === 0) return;
    const user = getUser.rows[0];
    return user;
  } catch (error) {
    throw new Error(error.message);
  }
};
