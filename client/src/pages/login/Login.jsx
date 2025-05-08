import React, { useState } from "react";
import "./Login.scss";
import newRequest from "../../utils/newRequest";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { logo } from "../../assets"
import { ArrowLeft } from "lucide-react";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); // Add loading state
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading

    try {
      const res = await newRequest.post("/auth/login", { username, password });
      localStorage.setItem("currentUser", JSON.stringify(res.data));
      
      // Show success toast
      toast.success("Login successful! Redirecting to homepage...", {
        autoClose: 3000,
      });
      
      // Brief delay to ensure toast is seen before navigation
      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (err) {
      setLoading(false); // Stop loading
      console.error(err);
      
      // Extract error message from response
      let errorMessage = "Invalid username or password. Please try again.";
      
      if (err.response) {
        if (err.response.data && typeof err.response.data === 'string') {
          errorMessage = err.response.data;
        } else if (err.response.data && err.response.data.message) {
          // Use server-provided error message if available
          errorMessage = err.response.data.message;
        }
      }
      
      toast.error(errorMessage, {
        autoClose: 5000,
      });
    } finally {
      setLoading(false); // Ensure loading state is reset even if navigating
    }
  };

  return (
    <>
      <div className="login">
        <Link className="back-home link" to="/">
          <ArrowLeft /> Back Home
        </Link>

        <div className="grid-bg"></div>
        <div className="top-glow"></div>

        <Link className="link logo-link" to="/">
          <img src={logo} alt=""className='logo'/>
          <span className='logo-text'>ThemeCrafted</span>
        </Link>

        <div className="modal">
          <div className="title-desc">
            <h2>Welcome back!</h2>
            <p>Log in to access your purchases, and explore exclusive themes and content</p>
          </div>

          <form onSubmit={handleSubmit}>
            {/* USERNAME */}
            <div className='input-group email'>
              <label>Username</label>
              <input
                name="username"
                type="text"
                placeholder="Enter your username"
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            {/* PASSWORD */}
            <div className='input-group password'>
              <label>Password</label>
              <input
                name="password"
                type="password"
                placeholder="Enter your password"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="btns">
              <button className='primary-btn' type="submit" disabled={loading}>
                {loading ? "Logging in..." : "Log In"}
              </button>

              <Link className="switch-link link" to="/register">
                Don't have an account?{" "}
                <span>
                  Sign Up!
                </span>
              </Link>
            </div>        
          </form>

        </div>

        <div className="terms-conditions">
          <p>© 2025 ThemeCrafted, All Rights Reserved</p>
        </div>
      </div>
    </>
  );
}

export default Login; 