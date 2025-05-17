import React, { useState, useEffect } from "react";
import "./Navbar.scss";
import { logo } from "../../assets";
import { Search, X, Menu } from "lucide-react";
import { Link } from "react-router-dom";
import newRequest from "../../utils/newRequest";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const [input, setInput] = useState("");

  const handleSubmit = () => {
    navigate(`/gigs?search=${input}`);
  };

  const [open, setOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  const handleLogout = async () => {
    try {
      await newRequest.post("/auth/logout");
      localStorage.setItem("currentUser", null);
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  // Track window width for responsive design
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (window.innerWidth > 768) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Toggle mobile menu and prevent body scrolling when menu is open
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    document.body.style.overflow = !mobileMenuOpen ? "hidden" : "auto";
  };

  return (
    <>
      <div className="navbar">
        <div className="container">
          {/* LOGO & HAMBURGER MENU ICON (mobile only) */}
          <div className="left-side">
            <Link to="/" className="link">
              <div className="logo">
                <img className="logoImg" src={logo} alt="" />
                <h3 className="logoText">ThemeCrafted</h3>
              </div>
            </Link>
          </div>

          <div
            className="hamburger-menu mobile-only"
            onClick={toggleMobileMenu}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </div>

          <div className="right-side desktop-only">
            <div className="links desktop-only">
              <Link className="link" to="/">
                Home
              </Link>
              <Link className="link" to="/collections">
                Collections
              </Link>
              <Link className="link" to="/gigs">
                Discover
              </Link>
            </div>
            {currentUser ? (
              <div className="user" onClick={() => setOpen(!open)}>
                <img
                  src={currentUser.img || "/src/assets/noavatar.jpg"}
                  alt="Profile picture"
                />
                <span>{currentUser?.username}</span>
                {open && (
                  <div className="options">
                    {currentUser?.isSeller && (
                      <>
                        <Link className="link" to="/mygigs">
                          My Themes
                        </Link>
                        <Link className="link" to="/add">
                          Create New Theme
                        </Link>
                      </>
                    )}
                    <Link className="link" to="/orders">
                      Orders
                    </Link>
                    <Link className="link" to="/messages">
                      Messages
                    </Link>
                    <Link className="link" onClick={handleLogout}>
                      Logout
                    </Link>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link className="link" to="/login">
                  <button className="outline-btn">Log In</button>
                </Link>
                <Link className="link" to="/register">
                  <button className="primary-btn">Sign Up</button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* MOBILE MENU OVERLAY */}
      <div className={`mobile-menu-overlay ${mobileMenuOpen ? "active" : ""}`}>
        <div className="mobile-menu-content">
          {currentUser && (
            <div className="mobile-profile">
              <img
                src={currentUser.img || "/src/assets/noavatar.jpg"}
                alt="Profile picture"
              />
              <span>{currentUser?.username}</span>
            </div>
          )}

          <div className="mobile-links">
            <Link
              className="link"
              to="/"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              className="link"
              to="/collections"
              onClick={() => setMobileMenuOpen(false)}
            >
              Collections
            </Link>
            <Link
              className="link"
              to="/gigs"
              onClick={() => setMobileMenuOpen(false)}
            >
              Discover
            </Link>

            {currentUser?.isSeller && (
              <>
                <Link
                  className="link"
                  to="/mygigs"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Themes
                </Link>
                <Link
                  className="link"
                  to="/add"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Create New Theme
                </Link>
              </>
            )}

            {currentUser && (
              <>
                <Link
                  className="link"
                  to="/orders"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Orders
                </Link>
                <Link
                  className="link"
                  to="/messages"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Messages
                </Link>
                <Link
                  className="link"
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                >
                  Logout
                </Link>
              </>
            )}
          </div>

          {/* Log In and Sign Up shown only when NOT logged in */}
          {!currentUser && (
            <div className="mobile-auth-buttons">
              <Link
                className="link mobile-login-btn"
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
              >
                Log in
              </Link>
              <Link
                className="link mobile-signup-btn"
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;
