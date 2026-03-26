import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../db.js';

const createUser = async (firstname, lastname, userName, password, confirmPassword, role) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const hashedConfirmPassword = await bcrypt.hash(confirmPassword, 10);
  const newUser = await pool.query(
    'INSERT INTO users (firstname, lastname, userName, password, confirmPassword, role) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
    [firstname, lastname, userName, hashedPassword, hashedConfirmPassword, role]
  );
  return newUser.rows[0];
};

export const registerUser = async (req, res) => {
  try {
    const { firstname, lastname, username, password, confirmPassword, role } = req.body;

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
    const newUser = await createUser(firstname, lastname, username, password, confirmPassword, role);
    res.status(201).json({
      message: `User with ${newUser.userName} created successfully`,
      user: newUser,
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const logInUser = async (req, res) => {
  try {
    const { username, password } = req.body;
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
      user: user.rows[0],
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
