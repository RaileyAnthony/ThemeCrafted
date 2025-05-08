import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Messages.scss";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import moment from "moment";
import Loader from "../../components/Loader/Loader";
import { toast } from "react-toastify";

const Messages = () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const [userDetails, setUserDetails] = useState({});
  
  // Fetch all conversations for the current user
  const { isLoading, error, data: conversations } = useQuery({
    queryKey: ["conversations"],
    queryFn: () =>
      newRequest.get(`/conversations`).then((res) => {
        console.log("Conversations data:", res.data);
        return res.data;
      }),
  });

  const queryClient = useQueryClient();

  // Mark a conversation as read
  const markAsReadMutation = useMutation({
    mutationFn: (id) => {
      return newRequest.put(`/conversations/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["conversations"]);
      toast.success("Marked as read");
    },
    onError: (error) => {
      toast.error("Failed to mark as read");
      console.error("Error marking as read:", error);
    }
  });

  const handleRead = (id) => {
    markAsReadMutation.mutate(id);
  };

  // Function to determine if conversation is unread for current user
  const isUnread = (conversation) => {
    // Make sure conversation has the necessary properties
    if (!conversation) return false;
    
    if (currentUser.isSeller) {
      return conversation.readBySeller === false;
    } else {
      return conversation.readByBuyer === false;
    }
  };

  // Function to get the other user's ID (not the current user)
  const getOtherUserId = (conversation) => {
    if (!conversation) return "";
    
    // If current user is the seller, return buyer ID, otherwise return seller ID
    return currentUser._id === conversation.sellerId 
      ? conversation.buyerId 
      : conversation.sellerId;
  };

  // Get display names and profile images for users in conversations
  useEffect(() => {
    const fetchUserDetails = async () => {
      if (conversations && conversations.length > 0) {
        // Get all unique user IDs who aren't the current user
        const userIds = conversations.map(c => getOtherUserId(c));
        
        // Remove duplicates
        const uniqueUserIds = [...new Set(userIds)].filter(id => id); // Remove empty strings
        
        try {
          const details = {};
          
          // Fetch user details in parallel
          await Promise.all(
            uniqueUserIds.map(async (userId) => {
              try {
                const response = await newRequest.get(`/users/${userId}`);
                details[userId] = {
                  username: response.data.username,
                  img: response.data.img || "/src/assets/noavatar.jpg" // Default image if none exists
                };
              } catch (error) {
                console.error(`Error fetching user ${userId}:`, error);
                details[userId] = {
                  username: "Unknown User",
                  img: "/src/assets/noavatar.jpg"
                };
              }
            })
          );
          
          setUserDetails(details);
        } catch (error) {
          console.error("Error fetching user details:", error);
        }
      }
    };

    fetchUserDetails();
  }, [conversations, currentUser]);

  return (
    <div className="messages">
      {isLoading ? (
        <div className="loading">
          <Loader size="large" color="primary" />
        </div>
      ) : error ? (
        <div className="error">
          <h2>Something went wrong</h2>
          <p>{error.message || "Could not load your messages"}</p>
        </div>
      ) : (
        <div className="container">
          <div className="title">
            <h1>Messages</h1>
          </div>
          
          {conversations && conversations.length > 0 ? (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Last Message</th>
                    <th>Date</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {conversations.map((c) => {
                    const otherUserId = getOtherUserId(c);
                    const unread = isUnread(c);
                    const user = userDetails[otherUserId] || { username: "Unknown User", img: "/src/assets/noavatar.jpg" };
                    
                    return (
                      <tr 
                        className={unread ? "unread" : ""} 
                        key={c.id}
                      >
                        <td>
                          <div className="user-cell">
                            <div className="avatar">
                              <img src={user.img} alt={user.username} />
                            </div>
                            <span className="username">{user.username}</span>
                          </div>
                        </td>
                        <td>
                          <Link to={`/message/${c.id}`} className="link">
                            {c?.lastMessage?.substring(0, 100) || "New conversation"}
                            {c?.lastMessage?.length > 100 && "..."}
                          </Link>
                        </td>
                        <td>{moment(c.updatedAt).fromNow()}</td>
                        <td>
                          {unread ? (
                            <button 
                              className="mark-read-btn"
                              onClick={() => handleRead(c.id)}
                            >
                              Mark as Read
                            </button>
                          ) : (
                            <span className="read-status">Read</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="no-messages">
              <p>You don't have any messages yet</p>
              <Link to="/gigs" className="browse-link">Browse themes</Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Messages;