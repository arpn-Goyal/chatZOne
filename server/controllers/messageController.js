import Message from '../models/Message.mongodb.js';
import Chat from '../models/Chat.mongodb.js';

/**
 * Helper to create a message, populate fields, and update chat
 */
export const _createAndPopulateMessage = async (senderId, content, chatId) => {
  // Create the message in the database
  let message = await Message.create({ sender: senderId, content, chat: chatId });

  // Populate sender and chat fields
  message = await message.populate('sender', 'name email');
  message = await message.populate('chat');

  // Update the chat's latestMessage reference
  await Chat.findByIdAndUpdate(chatId, { latestMessage: message._id });

  return message;
};

/**
 * REST: Send a new message
 */
export const sendMessage = async (req, res) => {
  const { content, chatId } = req.body;

  if (!content || !chatId) {
    return res.status(400).json({ message: 'Invalid data' });
  }

  try {
    // Use helper to handle creation and population
    const message = await _createAndPopulateMessage(req.user._id, content, chatId);
    res.status(201).json(message);
  } catch (err) {
    console.error('Send message error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * REST: Fetch all messages for a chat
 */
export const fetchMessages = async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate('sender', 'name email')
      .sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (err) {
    console.error('Fetch messages error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
