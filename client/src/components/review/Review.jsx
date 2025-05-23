import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import "./Review.scss";
import newRequest from "../../utils/newRequest";
import { Star, ThumbsUp, ThumbsDown } from "lucide-react";

const Review = ({ review }) => {
  const [expanded, setExpanded] = useState(false);
  const MAX_LENGTH = 150; // Maximum characters to show before "Read more"

  const { isLoading, error, data } = useQuery({
    queryKey: [review.userId],
    queryFn: () =>
      newRequest.get(`/users/${review.userId}`).then((res) => {
        return res.data;
      }),
  });

  // Format the review date
  const formatDate = (date) => {
    if (!date) return "Recently";
    const d = new Date(date);
    return d.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  // Function to handle the text truncation and "Read more" logic
  const renderDescription = () => {
    if (!review.desc) return null;

    if (review.desc.length <= MAX_LENGTH || expanded) {
      return <p>{review.desc}</p>;
    }

    return (
      <p>
        {review.desc.substring(0, MAX_LENGTH)}
        <span className="ellipsis"> ...</span>
        <span className="read-more-btn" onClick={() => setExpanded(true)}>
          Read more
        </span>
      </p>
    );
  };

  return (
    <div className="review">
      {isLoading ? (
        "loading"
      ) : error ? (
        "error"
      ) : (
        <div className="user">
          <img className="pp" src={data.img || "/noavatar.jpg"} alt="" />
          <div className="info">
            <h4>{data.username}</h4>
            <div className="user-stats">
              <span className="date">{formatDate(review.createdAt)}</span>
              <span className="separator">•</span>
              <span className="review-count">
                {data.totalReviews || 1} reviews
              </span>
            </div>
          </div>
        </div>
      )}
      <div className="stars">
        {[1, 2, 3, 4, 5].map((star, i) => (
          <Star
            key={i}
            size={16}
            className={
              i < review.star ? "star filled-star" : "star outline-star"
            }
            fill={i < review.star ? "#ffc108" : "none"}
            stroke={i < review.star ? "#ffc108" : "#ffc108"}
          />
        ))}
        <span className="rating">{review.star}</span>
      </div>
      <div className="description-container">{renderDescription()}</div>
      <div className="helpful">
        <span>Helpful?</span>
        <ThumbsUp size={14} className="helpful-icon" />
        <span>Yes</span>
        <ThumbsDown size={14} className="helpful-icon" />
        <span>No</span>
      </div>
    </div>
  );
};

export default Review;
