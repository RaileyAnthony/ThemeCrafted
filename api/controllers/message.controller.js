import createError from "../utils/createError.js";
import Message from "../models/message.model.js";
import Conversation from "../models/conversation.model.js";

export const createMessage = async (req, res, next) => {
  try {
    // Find the conversation first to verify it exists and user has permission
    const conversation = await Conversation.findOne({ 
      id: req.body.conversationId 
    });
    
    if (!conversation) {
      return next(createError(404, "Conversation not found"));
    }
    
    // Verify user is part of this conversation
    if (conversation.sellerId !== req.userId && conversation.buyerId !== req.userId) {
      return next(createError(403, "You cannot send messages to this conversation"));
    }
    
    // Create the new message
    const newMessage = new Message({
      conversationId: req.body.conversationId,
      userId: req.userId,
      desc: req.body.desc,
    });
    
    // Save the message
    const savedMessage = await newMessage.save();
    
    // Update the conversation
    await Conversation.findOneAndUpdate(
      { id: req.body.conversationId },
      {
        $set: {
          readBySeller: req.isSeller,
          readByBuyer: !req.isSeller,
          lastMessage: req.body.desc,
        },
      },
      { new: true }
    );

    res.status(201).send(savedMessage);
  } catch (err) {
    next(err);
  }
};

export const getMessages = async (req, res, next) => {
  try {
    // Find the conversation first to verify access
    const conversation = await Conversation.findOne({ 
      id: req.params.id 
    });
    
    if (!conversation) {
      return next(createError(404, "Conversation not found"));
    }
    
    // Verify user is part of this conversation
    if (conversation.sellerId !== req.userId && conversation.buyerId !== req.userId) {
      return next(createError(403, "You do not have access to these messages"));
    }
    
    // Get messages for the conversation
    const messages = await Message.find({ 
      conversationId: req.params.id 
    }).sort({ createdAt: 1 }); // Sort by creation time ascending
    
    res.status(200).send(messages);
  } catch (err) {
    next(err);
  }
};