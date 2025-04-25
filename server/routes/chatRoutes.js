import express from 'express';
import { verifyToken } from '../middlewares/authMiddleware.js';
import { accessOrCreateChat, fetchChats } from '../controllers/chatController.js';

const router = express.Router();

router.post('/', verifyToken, accessOrCreateChat);
router.get('/fetchChat', verifyToken, fetchChats);

// router.get('/chat', verifyToken, (req, res) => {
//   res.status(200).json({
//     message: "Welcome to the chat zone!",
//     user: req.user, // user info from token
//   });
// });

export default router;
