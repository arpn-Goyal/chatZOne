import e from "express";
import { registerUser, loginUser } from "../controllers/authController.js";
const router = e.Router();

router.post('/signup', registerUser)
router.post('/login', loginUser)

export default router;