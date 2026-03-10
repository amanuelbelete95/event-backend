import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../db.js';

const createUser = async (userName, password, role) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  console.log('hashedPassword', hashedPassword);
  const newUser = await pool.query(
    'INSERT INTO users (userName, password, role) VALUES ($1, $2, $3) RETURNING *',
    [userName, hashedPassword, role]
  );
  return newUser.rows[0];
};

export const registerUser = async (req, res) => {
  try {
    const { username, password, confirmPassword } = req.body;

    if (!username || !password || !confirmPassword) {
      return res.status(400).json({
        message: 'Please the provide the fields to register the user',
      });
    }
    if (password !== confirmPassword) {
      return res.status(402).json({
        message: 'The password should be the same',
      });
    }

    // Check if the user exist already
    const user = await pool.query('SELECT * FROM users WHERE userName = $1', [
      username,
    ]);
    if (user.rows.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }
    // Register the new User
    const newUser = await createUser(username, password, req.body.role);
    res.status(201).json({
      message: `User with ${newUser.userName} created successfully`,
      user: newUser,
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const logInUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    console.log(req.body);
    if (!username || !password) {
      return res
        .status(400)
        .json({ message: `Provide the credential to procedd` });
    }
    const user = await pool.query(
      `SELECT * FROM users
             WHERE userName = $1
            `,
      [username]
    );
    if (user.rows.length === 0) {
      return res.status(404).json({ message: `The user doesn't exist` });
    }

    const isMatch = await bcrypt.compare(password, user.rows[0].password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credential' });
    }
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined in .env');
    }

    const token = jwt.sign(
      { id: user.rows[0].id, role: user.rows[0].role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    return res.status(200).json({
      token,
      user: {
        id: user.rows[0].id,
        role: user.rows[0].role,
        username: user.rows[0].userName,
      },
      message: 'You have successfully loged in',
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const Me = async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  res.json({
    id: decoded.id,
    username: decoded.username,
    role: decoded.role,
    password: decoded.password,
  });
};

export const getallUsers = async (req, res) => {
  try {
    const allUsers = await pool.query(`select * from users`);
    if (allUsers.rows.length === 0) {
      return res.status(404).json({
        message: 'No users found.',
        code: 404,
      });
    }
    res.json(allUsers.rows);
  } catch (error) {
    return res.status(500).json({
      message: 'Internal Server Error: An unexpected error occurred.',
      code: 500,
    });
  }
};
