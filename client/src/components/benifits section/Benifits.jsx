import React from 'react'
import './Benifits.scss'

import { whyChooseUs } from '../../data'
import { swirlyArrow } from '../../assets'

const Benifits = () => {
  return (
    <div className='benifits'>
      <div className="grid-bg">
        <div className="grid-overlay" />
        <div className="container">
          <div className="title">
            <p>Why Choose Us</p>
            <h1>ThemeCrafted</h1>
            <img src={swirlyArrow} className='arrow'/>
          </div>
          <div className="benifits-container">
            {whyChooseUs.map((benifit) => (
              <div className="benifits-card" key={benifit.id}>
                <div className="svg">
                  <img src={benifit.svg} alt="" />
                </div>
                <div className="details">
                  <h3>{benifit.title}</h3>
                  <p>{benifit.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>

  )
}

export default Benifits