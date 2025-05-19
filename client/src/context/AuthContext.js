// src/context/AuthContext.js
import { createContext, useContext, useState, useEffect } from "react";
import newRequest from "../utils/newRequest";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check authentication status when the app loads
    const verifyAuth = async () => {
      setLoading(true);
      const storedUser = JSON.parse(localStorage.getItem("currentUser"));

      if (storedUser) {
        try {
          // Verify with backend that user is still authenticated
          const response = await newRequest.get("/auth/verify");

          if (response.status === 200) {
            // User is authenticated, use the latest user data
            setCurrentUser(storedUser);
          } else {
            // Authentication failed, clear localStorage
            localStorage.setItem("currentUser", null);
            setCurrentUser(null);
          }
        } catch (error) {
          // If error occurs, assume authentication is invalid
          console.log("Auth verification failed:", error);
          localStorage.setItem("currentUser", null);
          setCurrentUser(null);
        }
      }
      setLoading(false);
    };

    verifyAuth();
  }, []);

  const login = async (credentials) => {
    const response = await newRequest.post("/auth/login", credentials);
    localStorage.setItem("accessToken", response.data.token);
    localStorage.setItem("currentUser", JSON.stringify(response.data));
    setCurrentUser(response.data);
    return response.data;
  };

  const logout = async () => {
    try {
      await newRequest.post("/auth/logout");
      localStorage.setItem("accessToken", null);
      localStorage.setItem("currentUser", null);
      setCurrentUser(null);
    } catch (error) {
      console.log(error);
      // Still clear user data locally even if logout API fails
      localStorage.setItem("currentUser", null);
      setCurrentUser(null);
    }
  };

  const updateUser = (userData) => {
    localStorage.setItem("currentUser", JSON.stringify(userData));
    setCurrentUser(userData);
  };

  return (
    <AuthContext.Provider
      value={{ currentUser, loading, login, logout, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
