import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import newRequest from "../../utils/newRequest";
import "./Success.scss";

const Success = () => {
  const { search } = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(search);
  const payment_intent = params.get("payment_intent");

  useEffect(() => {
    const makeRequest = async () => {
      try {
        await newRequest.put("/orders", { payment_intent });
        setTimeout(() => {
          navigate("/orders");
        }, 5000);
      } catch (err) {
        console.log(err);
      }
    };

    makeRequest();
  }, [payment_intent, navigate]);

  return (
    <div className="success-container">
      <div className="message-box">
        <div className="success-text">
          Payment successful!
        </div>
        <div className="redirect-info">
          You are being redirected to the orders page. Please do not close the page.
        </div>
        <div className="spinner"></div>
      </div>
    </div>
  );
};

export default Success;
