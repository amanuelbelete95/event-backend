import pool from '../db.js';
import { getEvent } from '../models/events/utils/getEvent.js';
import { getUser } from '../models/users/utils/getUser.js';

export const registerToEvent = async (req, res) => {
  try {
    const { event_id, user_id, join_date, reason } = req.body;

    if (!event_id || !user_id || !reason) {
      return res
        .status(404)
        .json({ message: 'Please provide all required fields before joining' });
    }


    const eventsResult = await pool.query(`select * from event where id = $1`, [
      event_id,
    ]);
    const usersResult = await pool.query(`select * from users where id = $1`, [
      user_id,
    ]);
    
    const event = eventsResult.rows[0];
    const user = usersResult.rows[0];
    if (eventsResult.rows.length === 0) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (event.event_status !== "published") {
      return res.status(400).json({ message: 'Event is not published' });
    }


    // the event date has 

    const eventDate = new Date(event.event_date);
    const currentDate = new Date();
    if (eventDate < currentDate) {
      return res.status(400).json({ message: 'Event date has passed. Registration is closed.' });
    }
    // if the event capacity is reached then close the registration for the event
    const eventCapacity = event.capacity;
    const registrationCount = event.registration_count + 1; // add 1 to the current registration count
    if (registrationCount > eventCapacity) {
      return res.status(400).json({ message: 'Event capacity reached. Registration is closed.' });
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

    const registration = await pool.query(
      `insert into event_registration (event_id,user_id,join_date,reason)  
             values ($1, $2, $3, $4)
             returning *
             `,
      [event_id, user_id, join_date, reason]
    );

    // update registration status for the event to true if the registration is successful
    await pool.query(
      `update event set registration_status = true where id = $1`,
      [event_id]
    );

    // update registration_count for the event by adding 1 to the current registration count
    await pool.query(
      `update event set registration_count = registration_count + 1 where id = $1`,
      [event_id]
    );


    const updatedEvent = await pool.query(`select * from event where id = $1`, [
      event_id,
    ]);
        
    const registrationData = registration.rows[0];
    registrationData['event'] = updatedEvent.rows[0];
    registrationData['user'] = user;

    res.json(registrationData);
  } catch (error) {
    console.log('error', error);
    return res.status(500).json({
      message: 'Internal Server Error: An unexpected error occurred.',
      code: 500,
    });
  }
};

// get all registered events for a user that signed in:

// When the user sigin the only should see the events that they have registered for, so I need to get the user id from the token and then get all the events that the user has registered for and return it to the user.

// What would be the best way to get all registered events for a user that signed in? should I create a new function in the utils folder to get all registered events for a user and then call it here or should I just write the query here and return the result?
export const getallRegisteredEvents = async (req, res) => {
  try {
    const { userId } = req.query;
    let allEvents;
    if (!userId) {
      allEvents = await pool.query(`select * from event_registration`);
    } else {
      allEvents = await pool.query(
        `select * from event_registration where user_id = $1`,
        [userId]
      );
    }

    if (allEvents.rows.length === 0) {
      return res.status(404).json({
        message: 'No registered event found.',
        code: 404,
      });
    }
    const events = await Promise.all(
      allEvents.rows.map(async (row) => {
        const event = await getEvent(row.event_id);
        const user = await getUser(row.user_id);
        return {
          ...row,
          event,
          user,
        };
      })
    );

    return res.json(events);
  } catch (error) {
    console.log('error', error);
    return res.status(500).json({
      message: 'Internal Server Error: An unexpected error occurred.',
      code: 500,
    });
  }
};

export const checkUserRegistration = async (req, res) => {
  try {
    const { eventId, userId } = req.query;

    if (!eventId || !userId) {
      return res
        .status(400)
        .json({ message: 'eventId and userId are required' });
    }

    const result = await pool.query(
      `select * from event_registration where event_id = $1 and user_id = $2`,
      [eventId, userId]
    );

    const hasRegistered = result.rows.length > 0;
    res.json({ hasRegistered });
  } catch (error) {
    console.log('error', error);
    return res.status(500).json({
      message: 'Internal Server Error: An unexpected error occurred.',
      code: 500,
    });
  }
};
