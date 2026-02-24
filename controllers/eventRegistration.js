import pool from '../db.js';

export const registerToEvent = async (req, res) => {
    try {
        const { event_id, user_id, join_date, reason } = req.body;

        const eventsResult = await pool.query(`select * from event where id = $1`, [
            event_id,
        ]);
        const usersResult = await pool.query(`select * from users where id = $1`, [
            user_id,
        ]);

        if (eventsResult.rows.length === 0) {
            return res.status(404).json({ message: 'Event not found' });
        }
        if (usersResult.rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        const registeredEvents = await pool.query(
            `select * from event_registration where event_id = $1 and user_id = $2`,
            [event_id, user_id]
        );
        if (registeredEvents.rows.length > 0) {
            return res
                .status(409)
                .json({ message: 'User already registered for this event' });
        }

        const event = await pool.query(
            `insert into event_registration (event_id,user_id,join_date,reason)  
             values ($1, $2, $3, $4)
             returning *
             `,
            [event_id, user_id, join_date, reason]
        );
        res.json(event.rows[0]);
    } catch (error) {
        console.log('error', error);
        return res.status(500).json({
            message: 'Internal Server Error: An unexpected error occurred.',
            code: 500,
        });
    }
};

export const getallRegisteredEvents = async (req, res) => {
    try {
        const allEvents = await pool.query(`select * from event_registration`);
        if (allEvents.rows.length === 0) {
            return res.status(404).json({
                message: 'No registered event found.',
                code: 404,
            });
        }
        res.json(allEvents.rows);
    } catch (error) {
        return res.status(500).json({
            message: 'Internal Server Error: An unexpected error occurred.',
            code: 500,
        });
    }
};
