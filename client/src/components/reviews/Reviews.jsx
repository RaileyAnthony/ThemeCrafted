import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import newRequest from "../../utils/newRequest";
import Review from "../review/Review.jsx";
import "./Reviews.scss";
import { toast } from "react-toastify";
import { Star, AlertCircle } from "lucide-react";

const Reviews = ({ gigId, sellerId }) => {
  const queryClient = useQueryClient();
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(5);
  const [error, setError] = useState(null);
  
  // Get current user from localStorage
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const [isUserSeller, setIsUserSeller] = useState(false);
  const [isOwnGig, setIsOwnGig] = useState(false);

  // Check if user is a seller or gig owner when component mounts
  useEffect(() => {
    if (currentUser) {
      if (currentUser.isSeller) {
        setIsUserSeller(true);
      }
      
      if (sellerId && currentUser._id === sellerId) {
        setIsOwnGig(true);
      }
    }
  }, [currentUser, sellerId]);

  // Query to fetch reviews
  const { isLoading, error: fetchError, data: reviews } = useQuery({
    queryKey: ["reviews", gigId],
    queryFn: () => newRequest.get(`/reviews/${gigId}`).then((res) => res.data),
  });

  // Mutation for submitting a review
  const mutation = useMutation({
    mutationFn: (review) => {
      return newRequest.post("/reviews", review);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["reviews", gigId]);
      toast.success("Your review was added successfully!");
      setReviewText("");
      setRating(5);
      setError(null);
    },
    onError: (err) => {
      console.error("Review submission error:", err);
      
      // Check for specific seller error message
      if (err.response?.data === "Sellers can't create a review!") {
        const sellerErrorMsg = "As a seller, you cannot create reviews. This feature is only available for buyers.";
        setError(sellerErrorMsg);
        toast.error(sellerErrorMsg, {
          icon: <AlertCircle size={24} />
        });
      } else if (err.response?.data === "You have already created a review for this gig!") {
        const duplicateReviewMsg = "You have already reviewed this gig.";
        setError(duplicateReviewMsg);
        toast.error(duplicateReviewMsg, {
          icon: <AlertCircle size={24} />
        });
      } else {
        const errorMessage = err.response?.data || "Failed to submit review";
        setError(errorMessage);
        toast.error(errorMessage, {
          icon: <AlertCircle size={24} />
        });
      }
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate if user is logged in
    if (!currentUser) {
      const loginMessage = "Please log in to submit a review";
      setError(loginMessage);
      toast.error(loginMessage, {
        icon: <AlertCircle size={24} />
      });
      return;
    }

    // Check if user is a seller
    if (isUserSeller) {
      const sellerErrorMsg = "As a seller, you cannot create reviews. This feature is only available for buyers.";
      setError(sellerErrorMsg);
      toast.error(sellerErrorMsg, {
        icon: <AlertCircle size={24} />
      });
      return;
    }

    // Check if this is the user's own gig
    if (isOwnGig) {
      const ownGigMsg = "You cannot review your own gig.";
      setError(ownGigMsg);
      toast.error(ownGigMsg, {
        icon: <AlertCircle size={24} />
      });
      return;
    }

    // Validate if we have text
    if (!reviewText.trim()) {
      const emptyReviewMsg = "Please write a review before submitting";
      setError(emptyReviewMsg);
      toast.error(emptyReviewMsg, {
        icon: <AlertCircle size={24} />
      });
      return;
    }

    // Submit review
    mutation.mutate({ 
      gigId, 
      desc: reviewText, 
      star: rating 
    });
  };

  // Check if current user has already left a review
  const hasUserReviewed = reviews?.some(review => 
    currentUser && review.userId === currentUser._id
  );

  // Handle star click
  const handleStarClick = (value) => {
    setRating(value);
  };

  return (
    <div className="reviews">
      <h2>Reviews</h2>
      
      {/* Reviews list */}
      {isLoading ? (
        <div className="loading">Loading reviews...</div>
      ) : fetchError ? (
        <div className="error-message">Error loading reviews</div>
      ) : reviews.length === 0 ? (
        <div className="no-reviews">No reviews yet. Be the first to review!</div>
      ) : (
        reviews.map((review) => <Review key={review._id} review={review} />)
      )}

      {/* Add review section */}
      <div className="add">
        <h3>Add a review</h3>
        
        {!currentUser ? (
          <div className="login-prompt">
            <p>Please <Link className="link" to="/login">log in</Link> to leave a review</p>
          </div>
        ) : isUserSeller ? (
          <div className="seller-notice">
            <p>As a seller, you cannot create reviews. This feature is only available for buyers.</p>
          </div>
        ) : isOwnGig ? (
          <div className="seller-notice">
            <p>You cannot review your own gig</p>
          </div>
        ) : hasUserReviewed ? (
          <div className="already-reviewed">
            <p>You have already reviewed this gig</p>
          </div>
        ) : (
          <form className="addForm" onSubmit={handleSubmit}>       
            <div className="rating-section">
              <span>Your rating:</span>
              <div className="star-selection">
                {[1, 2, 3, 4, 5].map((value) => (
                  <div 
                    key={value} 
                    className="star-container"
                    onClick={() => handleStarClick(value)}
                  >
                    <Star 
                      className={`star-select ${value <= rating ? 'filled' : 'empty'}`}
                      fill={value <= rating ? "#ffc107" : "none"}
                      stroke={value <= rating ? "#ffc107" : "#ccc"}
                      size={24}
                    />
                  </div>
                ))}
              </div>
            </div>

            <textarea 
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Write your review here..."
              required
            />
            
            {error && <div className="error-message">{error}</div>}
            
            <button 
              className="primary-btn" 
              disabled={mutation.isLoading}
            >
              {mutation.isLoading ? "Posting..." : "Post Review"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Reviews;