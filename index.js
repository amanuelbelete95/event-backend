import cors from 'cors';
import bcrypt from 'bcryptjs';
import express from 'express';
import { logInUser, registerUser, Me, getallUsers } from './controllers/authController.js';
import { createEvent, deleteEvent, getSingleEvent, updateEvent, getallEvents } from './controllers/eventController.js';
import { registerToEvent, getallRegisteredEvents } from './controllers/eventRegistration.js';
import dotenv from "dotenv";
dotenv.config();



// Configure express app
const app = express();
app.use(cors());
app.use(express.json());
const PORT = 4000;



// Add user route
app.post('/api/register', registerUser);
app.post('/api/login', logInUser);
app.post('/api/me', Me);
app.get("/api/users", getallUsers);

console.log("JWT_SECRET:", process.env.JWT_SECRET);
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
app.get("/api/event-register", getallRegisteredEvents);

app.listen(PORT, () => {
  console.log('Sever has started');
});
