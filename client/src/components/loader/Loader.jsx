// src/components/Loader/Loader.jsx
import React from "react";
import "./Loader.scss";

function Loader({ size = "medium", color = "primary" }) {
  // Generate class names based on props
  const sizeClass = `loader-${size}`;
  const colorClass = `loader-${color}`;

  return (
    <div className="loader-container">
      <div className={`loader ${sizeClass} ${colorClass}`}>
        <div className="loader-spinner">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    </div>
  );
}

export default Loader;