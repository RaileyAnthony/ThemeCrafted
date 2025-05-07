import React from "react";
import "./Gig.scss";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import Reviews from "../../components/reviews/Reviews";
import { Star, Download, Layers, MessageCircleMore } from "lucide-react";
import Loader from "../../components/Loader/Loader";
import { toast } from "react-toastify";

function Gig() {
  const { id } = useParams();
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  // Fetch gig data
  const { isLoading, error, data } = useQuery({
    queryKey: ["gig", id],
    queryFn: () => newRequest.get(`/gigs/single/${id}`).then((res) => res.data),
  });

  const userId = data?.userId;

  // Fetch user data
  const {
    isLoading: isLoadingUser,
    error: errorUser,
    data: dataUser,
  } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => newRequest.get(`/users/${userId}`).then((res) => res.data),
    enabled: !!userId,
  });

  // Mutation for creating a conversation
  const mutation = useMutation({
    mutationFn: (conversation) => {
      return newRequest.post("/conversations", conversation);
    },
    onSuccess: (response) => {
      // Navigate to the message page with the new conversation ID
      toast.success("Conversation started!");
      navigate(`/message/${response.data.id}`);
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Something went wrong!");
      console.error("Error creating conversation:", error);
    }
  });

  // Calculate stars display
  const renderStarRating = (rating) => {
    if (isNaN(rating)) return null;
    
    const fullStars = Math.floor(rating);
    const halfStar = rating - fullStars >= 0.5;
    
    return (
      <div className="rating">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={i} className="star" />
        ))}
        {halfStar && <Star className="half-star" />}
        <span>{rating.toFixed(1)}</span>
      </div>
    );
  };

  const formatDate = (date) => {
    if (!date) return "Recently";
    const d = new Date(date);
    return d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  };

  const handleContactClick = () => {
    if (!dataUser || !currentUser) {
      if (!currentUser) {
        toast.error("Please log in to contact the seller");
        return;
      }
      return;
    }
    
    // Check if the user is trying to contact themselves
    if (currentUser._id === userId) {
      toast.error("You cannot contact yourself");
      return;
    }

    // Create a new conversation
    const conversation = {
      to: userId, // The seller ID
      gigId: id,   // The ID of the current gig
    };

    mutation.mutate(conversation);
  };

  if (isLoading) {
    return (
      <div className="gig-loader">
        <Loader size="large" color="primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="gig-error">
        <h2>Something went wrong!</h2>
        <p>{error.message || "Could not load the gig details"}</p>
      </div>
    );
  }

  return (
    <div className="gig">
      <div className="container">
        <div className="content">
          <div className="left-side">
            {/* Main Preview */}
            <div className="preview">
              <img className="desktop" src={data.cover} alt={data.title} />
              {data.phoneImage && (
                <img className="phone" src={data.phoneImage} alt="Mobile view" />
              )}
            </div>

            {/* Mobile Right Side (for smaller screens) */}
            <div className="mobile-right-side">
              <div className="details">
                <h1>{data.title}</h1>
                <h3>${data.price}.00</h3>
                <p>{data.shortDesc}</p>
              </div>

              <div className="stats">
                <div className="reviews stat-card">
                  <h3>
                    {!isNaN(data.totalStars / data.starNumber) 
                      ? (data.totalStars / data.starNumber).toFixed(1) 
                      : "New"} 
                    <Star className="star" />
                  </h3>
                  <p>{data.starNumber || 0} reviews</p>
                </div>

                <div className="vl"></div>

                <div className="purchases stat-card">
                  <h3>
                    {data.sales || 0} <Download />
                  </h3>
                  <p>Purchases</p>
                </div>

                <div className="vl"></div>

                <div className="version stat-card">
                  <h3>
                    1.0 <Layers />
                  </h3>
                  <p>Version</p>
                </div>
              </div>

              <div className="buttons">
                <Link to={`/pay/${id}`} className="primary-btn">
                  Continue
                </Link>
                <p>Uploaded on {formatDate(data.createdAt)}</p>
              </div>
            </div>

            {/* About Section */}
            <div className="about section">
              <h2>About This Theme</h2>
              <p>{data.desc}</p>
            </div>

            {/* Features Section */}
            <div className="features section">
              <h2>Features</h2>
              <div className="badge-container">
                {data.features && data.features.map((feature, index) => (
                  <div className="badge" key={index}>{feature}</div>
                ))}
              </div>
            </div>

            {/* Seller Info Section */}
            {!isLoadingUser && !errorUser && dataUser && (
              <div className="seller-info section">
                <h2>About The Seller</h2>
                <div className="profile">
                  <img src={dataUser.img || "/src/assets/noavatar.jpg"} alt={dataUser.username} />
                  <div className="details">
                    {!isNaN(data.totalStars / data.starNumber) && (
                      <div className="rating">
                        {renderStarRating(data.totalStars / data.starNumber)}
                      </div>
                    )}
                    <h3>{dataUser.username}</h3>
                    <p>Joined {formatDate(dataUser.createdAt)}</p>
                    <button className="outline-btn" onClick={handleContactClick}>
                      <MessageCircleMore /> Contact Me
                    </button>
                  </div>
                </div>
                
                <div className="seller-details box">
                  <div className="items">
                    <div className="item">
                      <span className="title">From</span>
                      <span className="desc">{dataUser.country || "Unknown"}</span>
                    </div>
                    <div className="item">
                      <span className="title">Member since</span>
                      <span className="desc">{formatDate(dataUser.createdAt)}</span>
                    </div>
                    <div className="item">
                      <span className="title">Avg. response time</span>
                      <span className="desc">4 hours</span>
                    </div>
                    <div className="item">
                      <span className="title">Last delivery</span>
                      <span className="desc">1 day</span>
                    </div>
                    <div className="item">
                      <span className="title">Languages</span>
                      <span className="desc">English</span>
                    </div>
                  </div>
                  <hr />
                  <p>{dataUser.desc}</p>
                </div>
              </div>
            )}

            {/* Reviews Section */}
            <div className="reviews section">
              <h2>Reviews</h2>
              <Reviews gigId={id} />
            </div>
          </div>

          {/* Right Side (for desktop) */}
          <div className="right-side">
            <div className="details">
              <h1>{data.title}</h1>
              <h3>${data.price}.00</h3>
              <p>{data.shortDesc}</p>
            </div>

            <div className="delivery-info">
              <div className="delivery-item">
                <span>Delivery Time</span>
                <p>{data.deliveryTime} days</p>
              </div>
              <div className="delivery-item">
                <span>Revisions</span>
                <p>{data.revisionNumber}</p>
              </div>
            </div>

            <div className="buttons">
              <Link to={`/pay/${id}`} className="link">
                <button className="primary-btn">
                  Buy 
                </button>
              </Link>
              <p>Uploaded on {formatDate(data.createdAt)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Gig;