import Message from '../models/Message.mongodb.js';
import Chat from '../models/Chat.mongodb.js';

export const sendMessage = async (req, res) => {
  const { content, chatId } = req.body;

  if (!content || !chatId)
    return res.status(400).json({ message: 'Invalid data' });

  try {
    let message = await Message.create({
      sender: req.user._id,
      content,
      chat: chatId,
    });

    message = await message.populate('sender', 'name email');
    message = await message.populate('chat');

    await Chat.findByIdAndUpdate(chatId, { lastMessage: message._id });

    res.status(201).json(message);
  } catch (err) {
    console.error('Send message error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

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
