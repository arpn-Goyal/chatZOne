import express from 'express';
import { verifyToken } from '../middlewares/authMiddleware.js';
import { searchUsers } from '../controllers/usersSearchContorller.js';
const router = express.Router();

router.get('/search', verifyToken, searchUsers);

export default router;
