import React, { useEffect, useState } from "react";
import "./Pay.scss";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import newRequest from "../../utils/newRequest";
import { useParams, Link } from "react-router-dom";
import CheckoutForm from "../../components/checkoutForm/CheckoutForm";
import { ArrowUpRight } from "lucide-react";
import Loader from "../../components/Loader/Loader";

const stripePromise = loadStripe(
  "pk_test_51RLrDs4aK2mq0i92agkjysls0DvcWdE99yh7lu7wGp3u5HZBBij3t7xdLsAQINyZyufTZyCyoD9PJwoVkkDhEwyj00UvZxF9oc"
);

const Pay = () => {
  const [clientSecret, setClientSecret] = useState("");
  const [gigData, setGigData] = useState(null);
  const [sellerData, setSellerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch the gig data
        const gigRes = await newRequest.get(`/gigs/single/${id}`);
        setGigData(gigRes.data);
        
        // Fetch the seller data
        const sellerId = gigRes.data.userId;
        const sellerRes = await newRequest.get(`/users/${sellerId}`);
        setSellerData(sellerRes.data);
        
        // Create payment intent
        const paymentRes = await newRequest.post(`/orders/create-payment-intent/${id}`);
        setClientSecret(paymentRes.data.clientSecret);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchData();
  }, [id]);

  const appearance = {
    theme: "stripe",
  };

  const options = {
    clientSecret,
    appearance,
  };

  const formatDate = (date) => {
    if (!date) return "Recently";
    const d = new Date(date);
    return d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  };

  if (loading) {
    return (
      <div className="pay-loading">
        <Loader size="large" color="primary" />
      </div>
    );
  }

  return (
    <div className="pay-container">
      <div className="pay-wrapper">
        <div className="payment-section">
          {clientSecret && (
            <Elements options={options} stripe={stripePromise}>
              <CheckoutForm />
            </Elements>
          )}
        </div>
        
        <div className="order-summary">
          <h2>Order Summary</h2>
          
          {gigData && (
            <div className="product-card">       
              <div className="product-details">
                <div className="product-image">
                  <img src={gigData.cover} alt={gigData.title} />
                </div>
                <div className="title-user">
                  <h2>{gigData.title}</h2>

                  {sellerData && (
                    <p className="seller-info">by {sellerData.username}</p>
                  )}

                  <p className="date">{formatDate(gigData.createdAt)}</p>
                </div>
              </div>

              <div className="price-preview">
                <h4 className="product-price">${gigData.price}.00</h4>

                <Link to={`/gig/${id}`} className="view-product link">
                  <p>View <ArrowUpRight /></p>
                </Link>
              </div>
            </div>
          )}
          
          <div className="order-total">
            <div className="subtotal">
              <span>Subtotal</span>
              <span>${gigData?.price || 0}.00</span>
            </div>
            <div className="service-fee">
              <span>Service Fee</span>
              <span>$0.00</span>
            </div>
            <div className="total">
              <span>Total</span>
              <span>${gigData?.price || 0}.00</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pay;