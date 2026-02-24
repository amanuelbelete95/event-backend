import pool from '../db.js';

import { getallEvents } from './eventController.js';
import { getallUsers } from './authController.js';

export const registerToEvent = async (req, res) => {
    try {
        const { event_id, user_id, join_date, reason } = req.body;
        if (!event_id || !user_id) {
            return res.status(400).json({
                message: 'Bad Request: All fields are required.',
            });
        }
        // Check if the event and user is valid and present in the database

        const events = await getallEvents();
        const users = await getallUsers();
        const findEvent = events.find(event => event.id === event_id);
        const findUser = users.find(user => user.id === user_id);

        if (!findEvent && !findUser) {
            return res.json({ message: "No event or user is found" });
        }
        // Check for user event and user if already registered
        const registeredEvents = await getAllRegisteredEvents();
        const joinedEvents = registeredEvents.filter(event => event.id === event_id || event.user_id === user_id);
        if (joinedEvents) {
            return res.json({ message: "Duplicate event or user" });
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
        console.log("error", error);
        return res.status(500).json({
            message: 'Internal Server Error: An unexpected error occurred.',
            code: 500,
        });
    }
};


const getAllRegisteredEvents = async (req, res) => {
    try {
        const allRegisteredEvents = await pool.query(`select * from event_registration`);
        if (allRegisteredEvents.rows.length === 0) {
            return res.status(404).json({
                message: 'No events found.',
                code: 404,
            });
        }
        res.json(allRegisteredEvents.rows);
    } catch (error) {
        return res.status(500).json({
            message: 'Internal Server Error: An unexpected error occurred.',
            code: 500,
        });
    }
};