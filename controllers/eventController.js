import pool from '../db.js';
import jwt from 'jsonwebtoken';
export const createEvent = async (req, res) => {
  try {
    const { name, location, event_date, event_status, description, capacity } = req.body;
    if (!name || !location || !event_date || !event_status || !capacity) {
      return res.status(400).json({
        message: 'Bad Request: All fields are required.',
        code: 400,
      });
    }
    const newEvent = await pool.query(
      `insert into event (name,location,event_date,event_status, capacity, description)  
       values ($1, $2, $3, $4, $5, $6)
       returning *
      `,
      [name, location, event_date, event_status, capacity, description]
    );
    res.json(newEvent.rows[0]);
  } catch (error) {

    console.log("event", error)
    return res.status(500).json({
      message: 'Internal Server Error: An unexpected error occurred.',
      code: 500,
    });
  }
};
// get All Events

export const getallEvents = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const allEvents = await pool.query(`
      SELECT 
      e.*, 
      EXISTS (
          SELECT 1 
          FROM event_registration er 
          WHERE er.event_id = e.id 
            AND er.user_id = $1
      ) AS is_registered
      FROM event e;
      `, [userId]);
    if (allEvents.rows.length === 0) {
      return res.status(404).json({
        message: 'No events found.',
        code: 404,
      });
    }
    res.json(allEvents.rows);
  } catch (error) {
    console.log("getEvents", error);
    return res.status(500).json({
      message: 'Internal Server Error: An unexpected error occurred.',
      code: 500,
    });
  }
};

export const getSingleEvent = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        message: 'Bad Request: Event ID is required.',
        code: 400,
      });
    }

    const getEvent = await pool.query(
      `select * from event where id = $1`,
      [id]
    );

    if (getEvent.rows.length === 0) {
      return res.status(404).json({
        message: `Event with ID ${id} not found.`,
        code: 404,
      });
    }

    res.status(200).json(getEvent.rows[0]);
  } catch (error) {
    return res.status(500).json({
      message: 'Internal Server Error: An unexpected error occurred.',
      code: 500,
    });
  }
};

export const getEvent = async (id) => {
  try {
    if (!id) {
      return res.status(400).json({
        message: 'Bad Request: Event ID is required.',
        code: 400,
      });
    }

    const getEvent = await pool.query(
      `select * from event where id = $1`,
      [id]
    );

    if (getEvent.rows.length === 0) {
      return res.status(404).json({
        message: `Event with ID ${id} not found.`,
        code: 404,
      });
    }
    const event = getEvent.rows[0];
    return event;
  } catch (error) {
    throw new Error(error.message)
  }
};

export const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        message: 'Bad Request: Event ID is required.',
        code: 400,
      });
    }
    const { name, location, event_date, event_status, description } = req.body;

    if (!name || !location) {
      return res.status(404).json({
        message: 'Bad Request: Event name and location are required.',
        code: 400,
      });
    }
    const updatedEvent = await pool.query(
      `update event 
       set name = $1,location = $2, event_status = $3, event_date = $4, description = $5
       where id = $6
       returning
       *
      `,
      [name, location, event_status, event_date, description, id]
    );
    res.json(updatedEvent.rows[0]);
  } catch (error) {
    console.log("error", error);
    return res.status(500).json({
      message: 'Internal Server Error: An unexpected error occurred.',
      code: 500,
    });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        message: 'Bad Request: Event ID is required.',
        code: 400,
      });
    }
    const deletedEvent = await pool.query(
      `
       delete from event 
       where id = $1
       returning
         *
      `,
      [id]
    );
    if (deletedEvent.rowCount === 0) {
      return res.status(404).json({
        message: 'Event is already deleted.',
        code: 404,
      });
    }
    return res.status(200).json({ message: "deleted successfully" });
  } catch (error) {
    console.log(error)
    return res
      .status(500)
      .json({
        message: 'Internal Server Error: An unexpected error occurred.',
        code: 500,
      });
  }
};
