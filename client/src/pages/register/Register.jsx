import React, { useState } from "react";
import upload from "../../utils/upload";
import "./Register.scss";
import newRequest from "../../utils/newRequest";
import { useNavigate } from "react-router-dom";

function Register() {
  const [errors, setErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false); // New loading state
  const [file, setFile] = useState(null);

  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
    img: "",
    country: "",
    phone: "",
    isSeller: false,
    desc: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setUser((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSeller = (e) => {
    setUser((prev) => ({
      ...prev,
      isSeller: e.target.checked,
    }));
  };

  const validate = () => {
    const errors = {};
    if (!user.username) errors.username = "Username is required";
    if (!user.email) errors.email = "Email is required";
    if (!user.password) errors.password = "Password is required";
    if (!user.country) errors.country = "Country is required";
    if (!file) errors.img = "Image is required";
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setErrorMessage("");
    setSuccessMessage("");
    setIsLoading(true); // Set loading to true before starting request
  
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setIsLoading(false); // Reset loading state if validation fails
      return;
    }
  
    try {
      const url = await upload(file);
      await newRequest.post("/auth/register", {
        ...user,
        img: url,
      });
  
      localStorage.setItem("verifyEmail", user.email);
      setSuccessMessage("Registration successful! Please check your email to verify your account.");
    } catch (err) {
      const errMsg = err?.response?.data?.message || "Something went wrong";
      setErrorMessage(errMsg);
    } finally {
      setIsLoading(false); // Reset loading state after request
    }
  };

  return (
    <div className="register">
      {successMessage ? (
        <div className="success-message">
          <p className="success">{successMessage}</p>
          <a
            href="https://mail.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="open-gmail-button"
          >
            Open Gmail
          </a>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="left">
            <h1>Create a new account</h1>

            <label>Username</label>
            <input
              name="username"
              type="text"
              placeholder="john-doe"
              className={errors.username ? "red" : ""}
              onChange={handleChange}
            />
            {errors.username && <p className="red">{errors.username}</p>}

            <label>Email</label>
            <input
              name="email"
              type="email"
              placeholder="example@email.com"
              className={errors.email ? "red" : ""}
              onChange={handleChange}
            />
            {errors.email && <p className="red">{errors.email}</p>}

            <label>Password</label>
            <input
              name="password"
              type="password"
              placeholder="••••••••"
              className={errors.password ? "red" : ""}
              onChange={handleChange}
            />
            {errors.password && <p className="red">{errors.password}</p>}

            <label>Profile Picture</label>
            <input type="file" onChange={(e) => setFile(e.target.files[0])} />
            {errors.img && <p className="red">{errors.img}</p>}

            <label>Country</label>
            <input
              name="country"
              type="text"
              placeholder="USA"
              className={errors.country ? "red" : ""}
              onChange={handleChange}
            />
            {errors.country && <p className="red">{errors.country}</p>}

            {isLoading ? (
              <button type="button" disabled>
                Registering...
              </button>
            ) : (
              <button type="submit">Register</button>
            )}

            {errorMessage && (
              <p className="error">
                {(() => {
                  const match = errorMessage.match(/\{([^:]+):\s*([^}]+)\}/);
                  const field = match ? match[1] : "";
                  const value = match ? match[2] : "";
                  return match
                    ? `The ${field} : ${value} already exists`
                    : errorMessage;
                })()}
              </p>
            )}
          </div>

          <div className="right">
            <h1>I want to become a seller</h1>
            <div className="toggle">
              <label>Activate the seller account</label>
              <label className="switch">
                <input type="checkbox" onChange={handleSeller} />
                <span className="slider round"></span>
              </label>
            </div>

            <label>Phone Number</label>
            <input
              name="phone"
              type="text"
              placeholder="+1 234 567 89"
              onChange={handleChange}
            />

            <label>Description</label>
            <textarea
              placeholder="A short description of yourself"
              name="desc"
              cols="30"
              rows="10"
              onChange={handleChange}
            ></textarea>
          </div>
        </form>
      )}
    </div>
  );
}

export default Register;
