import jwt from 'jsonwebtoken';

export const verifyToken = async (req, res, next) => {
    const token = req.cookies?.token; // Optional chaining: avoids crash if req.cookies is undefined

    if (!token) {
        // No token - respond gracefully
        return res.status(200).json({ authenticated: false, user: null });
      }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        console.log(`main hu AUth main ${req.user}`)
        next(); 
    } catch (err) {
       // console.log("main hu error catch vali")
        return res.status(403).json({ message: 'Invalid token.' });
    }
}