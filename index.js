import cors from 'cors';
import bcrypt from 'bcryptjs';
import express from 'express';
import { logInUser, registerUser, Me } from './controllers/authController.js';
import { createEvent, deleteEvent, getSingleEvent, updateEvent, getallEvents } from './controllers/eventController.js';
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
app.post('/api/me', Me)

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

app.listen(PORT, () => {
  console.log('Sever has started');
});
