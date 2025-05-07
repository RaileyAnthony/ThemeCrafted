import React from 'react'
import './CTA.scss'

import { ArrowRight, DeleteIcon } from 'lucide-react';
import { spiral, deviceMockup, light, particles } from '../../assets';

const CTA = () => {
  return (
    <div className='cta'>
      <div className="grid-bg">
        <div className="grid-overlay" />
        <img src={light} alt="" className='light'/>
        <div className="particles">
          {Array.from({ length: 100 }).map((_, i) => (
            <span key={i}></span>
          ))}
        </div>
        <div className="container"> 
          <div className="left-side">
            <div className="device-mockup">
              <img src={deviceMockup} alt="" />
            </div>
            <div className="spiral">
              <img src={spiral} alt="" />
            </div>
          </div>

          <div className="right-side">
            <div className="title-desc">
              <h1>Start Crafting Your Business Today with <span className='logo'>ThemeCrafted</span></h1>
              <p>Whether you're launching a store, creating a blog, or building a brand—ThemeCrafted has the tools to get you there.</p>
            </div>
            <button className='primary-btn'>Discover Themes <ArrowRight/></button>
          </div>
        </div>  
      </div>
    </div>
  )
}

export default CTA