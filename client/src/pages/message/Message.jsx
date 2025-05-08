import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import "./Message.scss";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import moment from "moment";

const Message = () => {
  const { id } = useParams();
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const [otherUser, setOtherUser] = useState(null);
  const queryClient = useQueryClient();

  // Fetch conversation details to get the other participant
  const { data: conversation } = useQuery({
    queryKey: ["conversation", id],
    queryFn: () =>
      newRequest.get(`/conversations/single/${id}`).then((res) => res.data),
  });

  // Fetch messages for this conversation
  const {
    isLoading,
    error,
    data: messages,
  } = useQuery({
    queryKey: ["messages", id],
    queryFn: () => newRequest.get(`/messages/${id}`).then((res) => res.data),
  });

  // Fetch the other user's details
  useEffect(() => {
    const fetchOtherUser = async () => {
      if (conversation) {
        const otherUserId =
          currentUser._id === conversation.sellerId
            ? conversation.buyerId
            : conversation.sellerId;

        try {
          const response = await newRequest.get(`/users/${otherUserId}`);
          setOtherUser({
            username: response.data.username,
            img: response.data.img || "/src/assets/noavatar.jpg",
          });
        } catch (err) {
          console.error("Error fetching other user:", err);
          setOtherUser({
            username: currentUser.isSeller ? "Buyer" : "Seller",
            img: "/src/assets/noavatar.jpg",
          });
        }
      }
    };

    fetchOtherUser();
  }, [conversation, currentUser]);

  const mutation = useMutation({
    mutationFn: (message) => {
      return newRequest.post(`/messages`, message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["messages"]);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate({
      conversationId: id,
      desc: e.target[0].value,
    });
    e.target[0].value = "";
  };

  return (
    <div className="message">
      <div className="container">
        <span className="breadcrumbs">
          <Link to="/messages">Messages</Link> &gt;
          {otherUser?.username || "User"} &gt;
        </span>

        {isLoading ? (
          "loading"
        ) : error ? (
          "error"
        ) : (
          <div className="messages">
            {messages?.map((m) => (
              <div
                className={m.userId === currentUser._id ? "owner item" : "item"}
                key={m._id}
              >
                <img
                  src={
                    m.userId === currentUser._id
                      ? currentUser.img || "/src/assets/noavatar.jpg"
                      : otherUser?.img || "/src/assets/noavatar.jpg"
                  }
                  alt=""
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/src/assets/noavatar.jpg";
                  }}
                />
                <p>{m.desc}</p>
                <span className="time">{moment(m.createdAt).fromNow()}</span>
              </div>
            ))}
          </div>
        )}

        <hr />
        <form className="write" onSubmit={handleSubmit}>
          <textarea type="text" placeholder="Send a message" />
          <button type="submit">Send</button>
        </form>
      </div>
    </div>
  );
};

export default Message;
