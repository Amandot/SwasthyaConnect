import express from 'express';
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  getDoctors
} from '../controllers/userController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// GET /api/users/me - Get current authenticated user
router.get('/me', authenticate, (req, res) => {
  if (!req.user || req.user.isNew) {
    return res.status(404).json({ error: 'Profile not found' });
  }
  res.json(req.user);
});

// GET /api/users - Get all users
router.get('/', authenticate, getUsers);

// GET /api/users/doctors - Get all doctors
router.get('/doctors', authenticate, getDoctors);

// GET /api/users/:id - Get user by ID
router.get('/:id', authenticate, getUserById);

// POST /api/users - Create new user
router.post('/', authenticate, createUser);

// PUT /api/users/:id - Update user
router.put('/:id', authenticate, updateUser);

export default router;
