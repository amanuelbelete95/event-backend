import pool from '../db.js';

export const createEvent = async (req, res) => {
  try {
    const { name, location, event_date, event_status, description } = req.body;
    if (!name || !location || !event_date || !event_status) {
      return res.status(400).json({
        message: 'Bad Request: All fields are required.',
        code: 400,
      });
    }
    const newEvent = await pool.query(
      `insert into event (name,location,event_date,event_status,description)  
       values ($1, $2, $3, $4, $5)
       returning *
      `,
      [name, location, event_date, event_status, description]
    );
    res.json(newEvent.rows[0]);
  } catch (error) {
    return res.status(500).json({
      message: 'Internal Server Error: An unexpected error occurred.',
      code: 500,
    });
  }
};
// get All Events

export const getallEvents = async (req, res) => {
  try {
    const allEvents = await pool.query(`select * from event`);
    if (allEvents.rows.length === 0) {
      return res.status(404).json({
        message: 'No events found.',
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

export const getSingleEvent = async (req, res) => {
  try {
    const { event_id } = req.params;
    if (!event_id) {
      return res.status(400).json({
        message: 'Bad Request: Event ID is required.',
        code: 400,
      });
    }

    const getEvent = await pool.query(
      `select * from event where event_id = $1`,
      [event_id]
    );

    if (getEvent.rows.length === 0) {
      return res.status(404).json({
        message: `Event with ID ${event_id} not found.`,
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

export const updateEvent = async (req, res) => {
  try {
    const { event_id } = req.params;
    if (!event_id) {
      return res.status(400).json({
        message: 'Bad Request: Event ID is required.',
        code: 400,
      });
    }
    const { name, location, event_date, event_status } = req.body;

    if (!name || !location) {
      return res.status(404).json({
        message: 'Bad Request: Event name and location are required.',
        code: 400,
      });
    }
    const updatedEvent = await pool.query(
      `update event 
       set name = $1,location = $2, event_status = $3, event_date = $4
       where event_id = $5
       returning
       *
      `,
      [name, location, event_status, event_date, event_id]
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
    const { event_id } = req.params;
    if (!event_id) {
      return res.status(400).json({
        message: 'Bad Request: Event ID is required.',
        code: 400,
      });
    }
    const deletedEvent = await pool.query(
      `
       delete from event 
       where event_id = $1
       returning
         *
      `,
      [event_id]
    );
    if (deletedEvent.rowCount === 0) {
      return res.status(404).json({
        message: 'Event is already deleted.',
        code: 404,
      });
    }
    return res.status(200).json({ message: "deleted successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({
        message: 'Internal Server Error: An unexpected error occurred.',
        code: 500,
      });
  }
};
