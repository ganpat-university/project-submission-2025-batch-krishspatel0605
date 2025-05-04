import React, { useEffect, useState } from "react";
import "./Pay.scss";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import newRequest from "../../utils/newRequest";
import { useParams } from "react-router-dom";
import CheckoutForm from "../../components/checkoutForm/CheckoutForm";

const stripePromise = loadStripe(
  "pk_test_51R3BCzQC1fWnhUDC0WqvOZYojgxFr88qJlXNSMzBm73IF3PalKxXGZszGzhKuuZfQ7lUWUURKZgA7t75FSUFL6nK00ev9n1u1w"
);

const Pay = () => {
  const [clientSecret, setClientSecret] = useState("");

  const { id } = useParams();

  useEffect(() => {
    const makeRequest = async () => {
      try {
        const res = await newRequest.post(
          `/orders/create-payment-intent/${id}`,


        );
        setClientSecret(res.data.clientSecret);
      } catch (err) {
        console.log(err);
      }
    };
    makeRequest();
  }, []);

  const appearance = {
    theme: 'stripe',
  };
  const options = {
    clientSecret,
    appearance,
  };

  return (
    <div className="pay">
      {clientSecret ? (
        <div className="pay-wrapper">
          <h2>Complete Your Payment</h2>
          <Elements options={options} stripe={stripePromise}>
            <CheckoutForm />
          </Elements>
        </div>
      ) : (
        <div className="pay-wrapper">
          <h2>Processing Payment...</h2>
          <div className="loading">Please wait while we prepare your payment...</div>
        </div>
      )}
    </div>
  );
  
};

export default Pay;
