import React from 'react';
import './Categories.scss';
import { categories } from '../../data';
import { zigzag, blob1, blob2 } from '../../assets';
import { useNavigate } from 'react-router-dom';

const Categories = () => {
  const navigate = useNavigate();
  
  // The exact category IDs used in Gigs component
  const gigsCategories = [
    "ecommerce",
    "booking", 
    "portfolio", 
    "restaurant", 
    "tech-startup"
  ];
  
  // This function safely maps your data.js category IDs to the ones used in Gigs component
  const mapCategoryToGigsId = (categoryId) => {
    // Handle case where the entire category object is passed instead of just the ID
    if (typeof categoryId === 'object' && categoryId !== null) {
      console.log("Object detected instead of string ID:", categoryId);
      // Try to extract the ID if it exists
      if (categoryId.id) {
        categoryId = categoryId.id;
      } else {
        // Fallback to first category if we can't extract an ID
        console.warn("Could not extract ID from object:", categoryId);
        return gigsCategories[0];
      }
    }
    
    // Convert to string to handle number IDs
    categoryId = String(categoryId);
    
    // Now we can safely use string methods
    
    // 1. Direct match (if the IDs are exactly the same)
    if (gigsCategories.includes(categoryId)) {
      return categoryId;
    }
    
    // 2. Try to match by name similarity (common pattern)
    const normalizedId = categoryId.toLowerCase().replace(/[-_\s]/g, '');
    
    // Check known mappings
    const mappings = {
      "1": "ecommerce",   // Handle numeric IDs if needed
      "2": "booking",
      "3": "portfolio",
      "4": "restaurant",
      "5": "tech-startup"
    };
    
    return mappings[normalizedId] || mappings[categoryId] || gigsCategories[0];
  };
  
  const handleCategoryClick = (category) => {
    // Extract the category ID safely
    const categoryId = typeof category === 'object' && category !== null 
      ? category.id 
      : category;
    
    // Map the category ID to one that Gigs component will recognize
    const gigsComponentId = mapCategoryToGigsId(categoryId);
    
    // Debug logs
    console.log(`Category clicked:`, category);
    console.log(`Extracted ID:`, categoryId);
    console.log(`Mapped to Gigs ID: ${gigsComponentId}`);
    
    // Navigate to gigs page with the mapped category ID
    navigate(`/gigs?cat=${gigsComponentId}`);
  };
  
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
            <div 
              className="category-card" 
              key={category.id || JSON.stringify(category)}
              onClick={() => handleCategoryClick(category)}
              style={{ cursor: 'pointer' }} // Add pointer cursor to indicate clickable
            >
              <div className="details">
                <h3>{category.title}</h3>
                <p>{category.desc}</p>
              </div>
              <div className="media">
                <div className='category-svg'>
                  <img src={category.svg} alt={category.title}/>
                </div>
                <img src={category.img} alt={category.title} className='category-img' />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Categories