import express from 'express';
import { sendMessage, fetchMessages } from '../controllers/messageController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', verifyToken, sendMessage);
router.get('/:chatId', verifyToken, fetchMessages);

export default router;
