import User from "../models/User.mongodb.js";

export const searchUsers = async (req, res) => {
    try {
        const query = req.query.name;
        
        if (!query) {
            return res.status(400).json({ message: 'Search query is required' });
        }

        // Search by name or email, case insensitive
        const users = await User.find({
            $or: [
                { name: { $regex: query, $options: 'i' } },
                { email: { $regex: query, $options: 'i' } },
            ],
        }).select('-password'); // Exclude password field

        res.json(users);
    } catch (err) {
        console.error('Search error:', err);
        res.status(500).json({ message: 'Server error' });
    }
}