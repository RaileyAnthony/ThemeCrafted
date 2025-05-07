import React from 'react'
import "./Collections.scss"
import NewestThemes from '../../components/newest themes/NewestThemes'
import CollectionsoHero from '../../components/collections hero/CollectionsHero'
import CollectionsCategory from '../../components/collections category/CollectionsCategory'
import CollectionsTestimonial from '../../components/collections testimonial/Testimonial'

const Collections = () => {
  return (
    <div className='collections'>
      <CollectionsoHero/>
      <NewestThemes />
      <CollectionsCategory />
      <CollectionsTestimonial />
    </div>  
  )
}

export default Collections