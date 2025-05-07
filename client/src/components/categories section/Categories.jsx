import React from 'react'
import './Categories.scss'
import { categories } from '../../data'

import { zigzag, blob1, blob2 } from '../../assets'

const Categories = () => {
  return (
    <div className="categories">
      <div className="blob-1">
        <img src={blob1} />
      </div>

      <div className="blob-2">
        <img src={blob2} />
      </div>
      <div className="container">
        <div className="title-desc">
          <div className="title">
            <h2>Select Your <span className='text'>Perfect Theme<img src={zigzag} className="line" /></span></h2>
          </div>

          <div className="desc">
            <p>Explore our theme collection by category to fit your specific needs</p>
          </div>
        </div>

        <div className="categories-container">
          {categories.map((category) => (   
            <div className="category-card" key={category.id}>
              <div className="details">
                <h3>{category.title}</h3>
                <p>{category.desc}</p>
              </div>
              <div className="media"> 
                <div className='category-svg' >
                  <img src={category.svg} alt={category.title}/>
                </div>
                <img src={category.img} alt={category.title} className='category-img' />
              </div>
            </div>
          )
          )}  
        </div>
      </div>
    </div>
  )
}

export default Categories