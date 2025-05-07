import React from 'react'
import "./Footer.scss"
import { Link } from 'react-router-dom'
import { logo } from "../../assets"


const Footer = () => {
  return (
    <div className='footer'>
      <div className="container">
        <div className="desc">
          <div className="logo">
            <img className="logoImg" src={logo} alt="" />
            <h2 className="logoText">ThemeCrafted</h2>
          </div>
          <p>ThemeCrafted is a curated digital marketplace for high-quality website and app themes. Whether you're a developer, designer, or entrepreneur, find beautifully designed, performance-optimized templates crafted to bring your vision to life.</p>
          <p>Made by CCBoyz | © 2025 ThemeCrafted. All rights reserved.</p>
        </div>

        <div className="links">
          <div className="pages">
            <h4>Pages</h4>
            <Link className='link' to="/">Home</Link>
            <Link className='link' to="/">Collections</Link>
            <Link className='link' to="/">Discover</Link>
          </div>

          <div className="resources">
            <h4>Resources</h4>
            <Link className='link' to="/">Documentation</Link>
            <Link className='link' to="/">Prototype</Link>
            <Link className='link' to="/">Github Repository</Link>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Footer