import React, { useEffect, useState } from "react";
import "./CheckoutForm.scss";
import {
  PaymentElement,
  LinkAuthenticationElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();

  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!stripe) return;

    const clientSecret = new URLSearchParams(window.location.search).get(
      "payment_intent_client_secret"
    );

    if (!clientSecret) return;

    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      switch (paymentIntent.status) {
        case "succeeded":
          setMessage("Payment succeeded!");
          break;
        case "processing":
          setMessage("Your payment is processing.");
          break;
        case "requires_payment_method":
          setMessage("Your payment was not successful, please try again.");
          break;
        default:
          setMessage("Something went wrong.");
      }
    });
  }, [stripe]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: "http://localhost:5173/success",
      },
    });

    if (error.type === "card_error" || error.type === "validation_error") {
      setMessage(error.message);
    } else {
      setMessage("An unexpected error occurred.");
    }

    setIsLoading(false);
  };

  const paymentElementOptions = {
    layout: "tabs",
  };

  return (
    <form className="checkout-form" onSubmit={handleSubmit}>
      <h2>Payment Details</h2>
      <div className="checkout-form__group">
        <label
          htmlFor="link-authentication-element"
          className="checkout-form__label"
        >
          Billing Information
        </label>
        <LinkAuthenticationElement
          id="link-authentication-element"
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="checkout-form__group">
        <label htmlFor="payment-element" className="checkout-form__label">
          Payment Details
        </label>
        <PaymentElement id="payment-element" options={paymentElementOptions} />
      </div>

      <button
        type="submit"
        className="checkout-form__button"
        disabled={isLoading || !stripe || !elements}
      >
        {isLoading ? <div className="checkout-form__spinner" /> : "Place Order"}
      </button>

      {message && <div className="checkout-form__message">{message}</div>}
    </form>
  );
};

export default CheckoutForm;
