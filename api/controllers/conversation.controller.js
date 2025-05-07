import Conversation from "../models/conversation.model.js";
import createError from "../utils/createError.js";

// Get all conversations for a user (both as seller and buyer)
export const getConversations = async (req, res, next) => {
  try {
    // Find conversations where the user is either the seller or the buyer
    const conversations = await Conversation.find({
      $or: [
        { sellerId: req.userId },
        { buyerId: req.userId }
      ]
    }).sort({ updatedAt: -1 }); // Sort by latest message first
    
    res.status(200).send(conversations);
  } catch (err) {
    next(err);
  }
};

// Create a new conversation
export const createConversation = async (req, res, next) => {
  try {
    const { to, gigId } = req.body;
    
    // Make sure users can't create conversations with themselves
    if (req.userId === to) {
      return next(createError(400, "You cannot create a conversation with yourself"));
    }
    
    // Check if conversation with this gig and these users already exists
    const existingConversation = await Conversation.findOne({
      $and: [
        {
          $or: [
            { sellerId: req.userId, buyerId: to },
            { sellerId: to, buyerId: req.userId },
          ],
        },
        { gigId }, // Include gigId in the check
      ],
    });

    if (existingConversation) {
      // If the conversation exists, return it
      return res.status(200).send(existingConversation);
    }

    // Create a new conversation with proper seller/buyer assignment
    const newConversation = new Conversation({
      id: Date.now().toString(), // Generate an ID for the conversation
      sellerId: req.isSeller ? req.userId : to,
      buyerId: req.isSeller ? to : req.userId,
      readBySeller: req.isSeller,
      readByBuyer: !req.isSeller,
      lastMessage: "",
      gigId, // Include the gig ID
    });

    await newConversation.save();
    res.status(201).send(newConversation);
  } catch (err) {
    next(err);
  }
};

// Get a single conversation by ID
export const getSingleConversation = async (req, res, next) => {
  try {
    const conversation = await Conversation.findOne({ id: req.params.id });
    
    if (!conversation) {
      return next(createError(404, "Conversation not found"));
    }
    
    // Check if the user is part of the conversation
    if (conversation.sellerId !== req.userId && conversation.buyerId !== req.userId) {
      return next(createError(403, "You don't have permission to view this conversation"));
    }
    
    res.status(200).send(conversation);
  } catch (err) {
    next(err);
  }
};

// Mark conversation as read
export const updateConversation = async (req, res, next) => {
  try {
    const conversationId = req.params.id;
    const conversation = await Conversation.findOne({ id: conversationId });
    
    if (!conversation) {
      return next(createError(404, "Conversation not found"));
    }
    
    // Check if the user is part of the conversation
    if (conversation.sellerId !== req.userId && conversation.buyerId !== req.userId) {
      return next(createError(403, "You don't have permission to update this conversation"));
    }

    // Update read status based on user role
    const updateData = req.isSeller 
      ? { readBySeller: true }
      : { readByBuyer: true };
    
    const updatedConversation = await Conversation.findOneAndUpdate(
      { id: conversationId },
      updateData,
      { new: true }
    );
    
    res.status(200).send(updatedConversation);
  } catch (err) {
    next(err);
  }
};