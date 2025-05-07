import React from "react";
import "./NewestThemes.scss";

import { newDrawing } from "../../assets";

import { themes } from "../../data";
import { Link } from "react-router-dom";

const NewestThemes = () => {
  return (
    <div className="newest-themes">
      <div className="container">
        <div className="header">
          <div className="title-desc">
            <h2>Newest Themes</h2>
            <p>
              Stand out with crafted themes that feel fresh, unique, and built
              to convert.
            </p>
          </div>

          <img src={newDrawing} className="drawing" />
        </div>

        <div className="grid">
          {themes.slice(0, 4).map((theme) => (
            <Link className="theme-card" key={theme.id} to="/">
              <div className="preview">
                <img className="desktop" src={theme.img} alt="" />
                <img className="phone" src={theme.phoneImg} alt="" />
              </div>
              <div className="details">
                <h4 className="title">{theme.title}</h4>
                <p className="excerpt">{theme.excerpt}</p>
                <p className="price">
                  {theme.discount ? (
                    <>
                      <span className="original">${theme.price}</span>{" "}
                      <span className="discount">${theme.discount}</span>
                    </>
                  ) : (
                    <>${theme.price}</>
                  )}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NewestThemes;
