import pool from '../../../db.js';
export const getEvent = async (id) => {
  try {
    if (!id) return;
    const getEvent = await pool.query(`select * from event where id = $1`, [
      id,
    ]);
    if (getEvent.rows.length === 0) return;
    const event = getEvent.rows[0];
    return event;
  } catch (error) {
    throw new Error(error.message);
  }
};
