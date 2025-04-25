import e from "express";
import { registerUser, loginUser , logoutUser} from "../controllers/authController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";
const router = e.Router();

router.post('/signup', registerUser)
router.post('/login', loginUser)
router.post('/logout', logoutUser)

// ✅ NEW: Authenticated user fetch route
router.get('/me', verifyToken, (req, res) => {
  console.log(`authRoute : ${req.user}`)
    res.status(200).json(req.user); // user info comes from the middleware
  });

export default router;