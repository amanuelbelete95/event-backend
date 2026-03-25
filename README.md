🎉 Event Management System – Backend

A robust and scalable backend for the Event Management System, built with Node.js and PostgreSQL. This API handles event operations, employee management, and system workflows with secure and efficient data handling.

📌 Project Overview

This backend service powers the Event Management System by providing RESTful APIs for managing:

Events
Event Registration
Authentication & authorization (if implemented)

It is designed with scalability, maintainability, and performance in mind.

🚀 Features
📅 Event Management API
Create, update, delete, and retrieve events
Manage event schedules and details
👥 Employee Management
CRUD operations for employees
Role-based management (optional)
🧹 Service & Operations Management
Track operational services (e.g., cleaning workflows)
Assign tasks to employees
🔐 Authentication & Authorization (if applicable)
JWT-based authentication
Protected routes
🗄️ Database Integration
PostgreSQL relational database
Efficient queries and structured data handling

🛠️ Tech Stack
Runtime: Node.js
Framework: Express.js
Database: PostgreSQL
ORM/Query Builder: (Sequelize / Prisma / Knex – specify yours)
Authentication: JWT (if implemented)
Environment Management: dotenv

📂 Project Structure
src/
├── controllers/     # Request handlers
├── routes/          # API routes
├── models/          # Database models
├── services/        # Business logic
├── middleware/      # Auth & error handling
├── config/          # DB and app configuration
├── utils/           # Helper functions
└── server.js        # Entry point


⚙️ Getting Started
Prerequisites
Node.js (v14 or higher)
PostgreSQL installed and running
Installation
# Clone the repository
git clone https://github.com/amanuelbelete95/event-backend

# Navigate into the project
cd event-management-backend

# Install dependencies
npm install
🔑 Environment Variables

Create a .env file in the root directory:

PORT=4000
DATABASE_URL=postgresql://username:password@localhost:5432/event
JWT_SECRET=your_secret_key
▶️ Running the Server
npm run dev

or

npm start

Server will run on:
👉 http://localhost:4000

🗄️ Database Setup

Create a PostgreSQL database:
CREATE DATABASE event;
Update your .env file with the correct credentials.
Run migrations (if applicable):
npm run migrate

📡 API Endpoints (Sample)
Events
GET    /api/events
POST   /api/events
GET    /api/events/:id
PUT    /api/events/:id
DELETE /api/events/:id
🧪 Testing
npm test
