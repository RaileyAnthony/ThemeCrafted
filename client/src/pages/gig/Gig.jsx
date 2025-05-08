import React, { useState, useEffect } from "react";
import "./Gig.scss";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import Reviews from "../../components/reviews/Reviews";
import { Star, Clock, Repeat, MessageCircleMore, AlertCircle } from "lucide-react";
import Loader from "../../components/Loader/Loader";
import { toast } from "react-toastify";

function Gig() {
  const { id } = useParams();
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  
  // State to check restrictions
  const [isUserSeller, setIsUserSeller] = useState(false);
  const [isOwnGig, setIsOwnGig] = useState(false);

  // Fetch gig data
  const { isLoading, error, data } = useQuery({
    queryKey: ["gig", id],
    queryFn: () => newRequest.get(`/gigs/single/${id}`).then((res) => res.data),
  });

  const userId = data?.userId;

  // Check if this is the user's own gig or if user is a seller
  useEffect(() => {
    if (currentUser && userId) {
      // Check if this is user's own gig
      setIsOwnGig(currentUser._id === userId);
      
      // Check if user is a seller
      setIsUserSeller(currentUser.isSeller);
    }
  }, [currentUser, userId]);

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
        <span>{Math.round(rating)}</span>
      </div>
    );
  };
  

  const formatDate = (date) => {
    if (!date) return "Recently";
    const d = new Date(date);
    return d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  };

  const handleContactClick = (e) => {
    if (!currentUser) {
      toast.error("Please log in to contact the seller", {
        icon: <AlertCircle size={24} />
      });
      return;
    }
    
    // Check if the user is trying to contact themselves
    if (isOwnGig) {
      toast.error("You cannot contact yourself about your own gig", {
        icon: <AlertCircle size={24} />
      });
      return;
    }

    // Create a new conversation
    const conversation = {
      to: userId, // The seller ID
      gigId: id,   // The ID of the current gig
    };

    mutation.mutate(conversation);
  };

  const handleBuyClick = (e) => {
    e.preventDefault(); // Always prevent default link behavior
    
    if (!currentUser) {
      toast.error("Please log in to purchase this theme", {
        icon: <AlertCircle size={24} />
      });
      return;
    }

    if (isOwnGig) {
      toast.error("You cannot purchase your own theme", {
        icon: <AlertCircle size={24} />
      });
      return;
    }

    if (isUserSeller && !isOwnGig) {
      toast.error("As a seller, you cannot purchase themes. Please use a buyer account.", {
        icon: <AlertCircle size={24} />
      });
      return;
    }
    
    // If all checks pass, navigate to the payment page
    navigate(`/pay/${id}`);
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
              <div className="title-user">
                <h1>{data.title}</h1>
                {dataUser && <p>by {dataUser.username}</p>}
              </div>
              <h3>${data.price}.00</h3>
              <p>{data.shortDesc}</p>
            </div>

              <div className="stats">
              <div className="reviews stat-card">
                <h3>
                  {!isNaN(data.totalStars / data.starNumber) 
                    ? Math.round(data.totalStars / data.starNumber) 
                    : "New"} 
                  <Star className="star" />
                </h3>
                <p>{data.starNumber || 0} reviews</p>
              </div>

                <div className="vl"></div>

                <div className="delivery stat-card">
                  <h3>
                    {data.deliveryTime} <Clock />
                  </h3>
                  <p>Days Delivery</p>
                </div>

                <div className="vl"></div>

                <div className="revisions stat-card">
                  <h3>
                    {data.revisionNumber} <Repeat />
                  </h3>
                  <p>Revisions</p>
                </div>
              </div>

              <div className="buttons">
                <button 
                  className="primary-btn"
                  onClick={handleBuyClick}
                >
                  Buy Now
                </button>
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
                    <button 
                      className="outline-btn"
                      onClick={handleContactClick}
                    >
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
              <Reviews gigId={id} sellerId={userId} />
            </div>
          </div>

          {/* Right Side (for desktop) */}
          <div className="right-side">
            <div className="details">
              <div className="title-user">
                <h1>{data.title}</h1>
                {dataUser && <p>by {dataUser.username}</p>}
              </div>
              <h3>${data.price}.00</h3>
              <p>{data.shortDesc}</p>
            </div>

            {/* Updated stats section with revisions and delivery time */}
            <div className="stats">
              <div className="reviews stat-card">
                <h3>
                  {!isNaN(data.totalStars / data.starNumber) 
                    ? Math.round(data.totalStars / data.starNumber) 
                    : "New"} 
                  <Star className="star" />
                </h3>
                <p>{data.starNumber || 0} reviews</p>
              </div>

              <div className="vl"></div>

              <div className="delivery stat-card">
                <h3>
                  {data.deliveryTime} <Clock />
                </h3>
                <p>Days Delivery</p>
              </div>

              <div className="vl"></div>

              <div className="revisions stat-card">
                <h3>
                  {data.revisionNumber} <Repeat />
                </h3>
                <p>Revisions</p>
              </div>
            </div>

            <div className="buttons">
              <button 
                className="primary-btn"
                onClick={handleBuyClick}
              >
                Buy Now
              </button>
              <p>Uploaded on {formatDate(data.createdAt)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Gig;