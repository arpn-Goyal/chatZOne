import e from "express";
import { registerUser, loginUser } from "../controllers/authController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";
const router = e.Router();

router.post('/signup', registerUser)
router.post('/login', loginUser)

// ✅ NEW: Authenticated user fetch route
router.get('/me', verifyToken, (req, res) => {
    res.status(200).json(req.user); // user info comes from the middleware
  });

export default router;