import Chat from "../models/Chat.mongodb.js";
import User from "../models/User.mongodb.js";

// Create or fetch 1-on-1 chat
export const accessOrCreateChat = async (req, res) => {
  const { userId } = req.body;
  const {loggedInUser } = req.body;

console.log(`ChatController : logged In user ${loggedInUser}`)
console.log(`ChatController : logged In user ${req.user}`)

  if (!userId) {
    console.log("UserId param not sent with request");
    return res.sendStatus(400);
  }

  try {
    let chat = await Chat.findOne({
      isGroupChat: false,
      users: { $all: [loggedInUser, userId] },
    })
      .populate("users", "-password")
      .populate("latestMessage");

    if (chat) return res.json(chat);

    // Create a new chat
    const newChat = await Chat.create({
      isGroupChat: false,
      users: [loggedInUser, userId],
    });

    const fullChat = await Chat.findById(newChat._id).populate("users", "-password");

    res.status(200).json(fullChat);
  } catch (err) {
    console.error("Access Chat Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const fetchChats = async (req, res) => {
  try {
    const loggedInUser = req.query.userId;

    const chats = await Chat.find({
      users: { $in: [loggedInUser] },
    })
      .populate("users", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 });

    console.log(chats);
    res.status(200).json(chats);
  } catch (err) {
    console.error("Fetch Chats Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};