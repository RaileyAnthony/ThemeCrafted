import React, { useState } from "react";
import "./Login.scss";
import newRequest from "../../utils/newRequest";
import { Link, useNavigate } from "react-router-dom";

import { logo } from "../../assets"
import { ArrowLeft } from "lucide-react";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await newRequest.post("/auth/login", { username, password });
      localStorage.setItem("currentUser", JSON.stringify(res.data));
      navigate("/");
    } catch (error) {
      setError(error.response.data);
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
              />
            </div>

            <div className="btns">
              <button className='primary-btn' type="submit">Log In</button>

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
