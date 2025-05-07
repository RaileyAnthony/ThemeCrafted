import React, { useState } from "react";
import "./Register.scss";
import axios from "axios";
import newRequest from "../../utils/newRequest";
import { Link, Links, useNavigate } from "react-router-dom";
import upload from "../../utils/upload";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { logo } from "../../assets"
import { ArrowLeft, Store } from "lucide-react";


function Register() {
  const [file, setFile] = useState(null);
  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
    img: "",
    country: "",
    isSeller: false,
    desc: "",
  });
  const [loading, setLoading] = useState(false); // To handle loading state
  const navigate = useNavigate();

  const handleChange = (e) => {
    setUser((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };

  const handleSeller = (e) => {
    setUser((prev) => {
      return { ...prev, isSeller: e.target.checked };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading

    try {
      // Only upload file if one is selected
      let url = "";
      if (file) {
        url = await upload(file);
      }

      // Attempt registration
      await newRequest.post("/auth/register", {
        ...user,
        img: url,
      });

      // On success, show toast and navigate to login page
      toast.success("Registration successful! Please login with your credentials.", {
        position: "top-center",
        autoClose: 5000,
      });
      
      // Brief delay to ensure toast is seen before navigation
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      setLoading(false); // Stop loading
      console.error(err);
      
      // Extract error message from response
      let errorMessage = "An error occurred. Please try again later.";
      
      if (err.response) {
        // Check for MongoDB duplicate key error
        if (err.response.data && typeof err.response.data === 'string' && 
            err.response.data.includes('duplicate key error')) {
          
          if (err.response.data.includes('username_1 dup key')) {
            errorMessage = "Username already exists. Please choose a different username.";
          } else if (err.response.data.includes('email_1 dup key')) {
            errorMessage = "Email already registered. Please use a different email or try logging in.";
          } else {
            errorMessage = "This account already exists. Please try with different credentials.";
          }
        } else if (err.response.data && err.response.data.message) {
          // Use server-provided error message if available
          errorMessage = err.response.data.message;
        }
      }
      
      toast.error(errorMessage, {
        position: "top-center",
        autoClose: 5000,
      });
    } finally {
      setLoading(false); // Ensure loading state is reset even if navigating
    }
  };

  return (
    <>
      <div className="register">
        <div className="container">
          <Link className="back-home link">
            <ArrowLeft />
            Back Home
          </Link>

          <div className="modal register">
            {/* <div className="grid-bg"></div> */}
            {/* <div className="top-glow"></div> */}

            <img src={logo} alt="" className="logo" />

            <div className="title-desc">
              <h2>Join <span className='logo-text'>ThemeCrafted</span></h2>
              <p>Sign up and unlock a world of beautifully designed themes, innovative creators, and boundless inspiration.</p>
            </div>

            

            <form onSubmit={handleSubmit}>
              <div className="grid">
                {/* USERNAME */}
                <div className="input-group username">
                  <label>Username</label>
                  <input
                    type="text"
                    name="username"
                    className="input"
                    placeholder="Choose a username"
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* EMAIL */}
                <div className="input-group email">
                  <label>Email address</label>
                  <input
                    type="email"
                    name="email"
                    className="input"
                    placeholder="Enter your email"
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* PASSWORD */}
                <div className="input-group password">
                  <label>Password</label>
                  <input
                    type="password"
                    name="password"
                    className="input"
                    placeholder="Create a password"
                    onChange={handleChange}
                    required
                  />
                </div>
                
                {/* COUNTRY */}
                <div className="input-group">
                  <label>Country</label>
                  <input
                    type="text"
                    name="country"
                    className="input"
                    placeholder="Enter your country"
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* PROFILE UPLOAD */}
              <div className="input-group">
                <label>Profile Picture</label>
                <div 
                  className={`file-dropzone ${file ? 'has-file' : ''}`}
                >
                  <div className="upload-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                      <polyline points="17 8 12 3 7 8"></polyline>
                      <line x1="12" y1="3" x2="12" y2="15"></line>
                    </svg>
                  </div>
                  <div className="upload-text">
                    {file ? file.name : "Select a file to upload"}
                  </div>
                  <div className="upload-subtext">
                    {!file && "or drag and drop it here"}
                  </div>
                  <input
                    type="file"
                    onChange={(e) => setFile(e.target.files[0])}
                    accept="image/*"
                  />
                </div>
              </div>
              

              <div className="btns">
                <button className="primary-btn" type="submit" disabled={loading}>
                  {loading ? "Registering..." : "Sign Up"}
                </button>

                <p className="switch-link">
                  Already have an account?{" "}
                  <Link to="/login" className="link">
                    Log In!
                  </Link>
                </p>
              </div>
            </form>
          </div>

          <div className="modal seller">
            <div className="grid-bg"></div>

            <Store className="logo seller-icon" />
            <div className="top-glow"></div>

            <div className="title-desc">
              <h2>Become a <span className='logo-text'>Seller</span></h2>
              <p>Activate your seller account and start showcasing your uniquely crafted themes and creative services.</p>
            </div>

            <div className="seller-fields">
              <div className="input-group toggle">
                <label>Activate the seller account</label>
                <div className="toggle-switch">
                  <label className="switch">
                    <input type="checkbox" onChange={handleSeller} />
                    <span className="slider round"></span>
                  </label>
                </div>
              </div>
              
              <div className="input-group">
                <label>Phone Number</label>
                <input
                  type="text"
                  name="phone"
                  className="input"
                  placeholder="Enter your number"
                  onChange={handleChange}
                />
              </div>
              
              <div className="input-group">
                <label>Description</label>
                <textarea
                  placeholder="A short description of yourself"
                  name="desc"
                  className="input"
                  onChange={handleChange}
                  rows="5"
                ></textarea>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Register;