import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import {
  logInUser,
  Me,
  registerUser,
} from './controllers/authController.js';
import {
  createEvent,
  deleteEvent,
  getallEvents,
  getSingleEvent,
  updateEvent,
} from './controllers/eventController.js';
import {
  checkUserRegistration,
  getallRegisteredEvents,
  registerToEvent,
} from './controllers/eventRegistration.js';
import { getallUsers } from './controllers/userController.js';


dotenv.config();

// Configure express app
const app = express();
app.use(cors());
app.use(express.json());
const PORT = 4000;

// Auth route
app.post('/api/register', registerUser);
app.post('/api/login', logInUser);

// User route
app.post('/api/me', Me);
app.get('/api/users', getallUsers);


// Event Route
app.post('/api/events', createEvent);
// get All Events
app.get('/api/events', getallEvents);
// get single event
app.get('/api/events/:id', getSingleEvent);
// Update an event
app.put('/api/events/:id/update', updateEvent);
// delete event
app.delete('/api/events/:id/delete', deleteEvent);

// Event Registration route
app.post('/api/event-register', registerToEvent);
app.get('/api/event-register', getallRegisteredEvents);
app.get('/api/event-register/check', checkUserRegistration);

app.listen(PORT, () => {
  console.log('Sever has started');
});
