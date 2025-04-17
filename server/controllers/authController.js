import User from "../models/User.mongodb.js";
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
dotenv.config();

export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Hash password
        const saltRounds = 10;
        const hashPassword = await bcrypt.hash(password, saltRounds);
        console.log(req.body);

        const newUser = await User.create({ name, email, password: hashPassword });

        return res.status(201).json({
            message: "User registered successfully",
            user: {
                _id: newUser._id,
                name: newUser.name,
                email: newUser.email,
            },
        });

    } catch (error) {
        // Duplicate key error from MongoDB
        if (error.code === 11000) {
            return res.status(400).json({ message: "Email already exists" });
        }
        console.error("Error in registration:", error);
        res.status(500).json({ message: "Server error" });
    }
}

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        // 1. check if user exists
        const existingUser = await User.findOne({ email }).select('+password');

        if (!existingUser) {
            return res.status(404).json({    // 🔴 404 = Not Found
                message: "User doesn't Exist"
            })
        }

        const isPasswordValid = await bcrypt.compare(password, existingUser.password);
        if (!isPasswordValid) {
            return res.status(401).json({                  // 🟠 401 = Unauthorized
                message: 'Incorrect  Password',
            })
        }

        // Generate Token
        const token = jwt.sign({
            id: existingUser._id,
            email: existingUser.email,
            name: existingUser.name,
        },
            process.env.JWT_SECRET,
            { expiresIn: "2h" }
        )

        // Set token as an HTTP-only cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",  // only true in production (https)
            sameSite: "strict",
            maxAge: 2 * 60 * 60 * 1000, // 2 hours
        });
        
        return res.status(200).json({
            message: 'User Logged-in successfully',
            email: existingUser.email,
            name: existingUser.name,
            token:token
        });

    } catch (error) {
        console.error("Error in Login:", error);
        res.status(500).json({ message: "Server error" });
    }
}

export const logoutUser = async (req, res) => {
    try {
      // Clear the access token cookie
      res.clearCookie("token", {
        httpOnly: true,
        sameSite: 'Lax',
        secure: false, // true in production
      });
  
      return res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
      console.error("Logout error:", error);
      return res.status(500).json({ message: "Logout failed" });
    }
  };
  

  