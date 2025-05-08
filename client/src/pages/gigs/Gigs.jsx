import React, { useEffect, useState } from "react";
import "./Gigs.scss";
import GigCard from "../../components/gigCard/GigCard";
import { useQuery } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import { useLocation, useNavigate } from "react-router-dom";
import { ChevronDown, Search, SlidersHorizontal } from "lucide-react";

function Gigs() {
  const [sort, setSort] = useState("createdAt");
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [minPrice, setMinPrice] = useState(0);
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const navigate = useNavigate();
  const { search } = useLocation();

  // Categories data - using the exact categories from the Add form
  const categories = [
    { id: "ecommerce", name: "E-Commerce" },
    { id: "booking", name: "Booking" },
    { id: "portfolio", name: "Portfolio" },
    { id: "restaurant", name: "Restaurant" },
    { id: "tech-startup", name: "Tech Startup" }
  ];

  const handleCategoryChange = (categoryId) => {
    setSelectedCategories(prev => {
      if (prev.includes(categoryId)) {
        return prev.filter(id => id !== categoryId);
      } else {
        return [...prev, categoryId];
      }
    });
  };

  // Construct the query string for filtering
  const constructQueryString = () => {
    let params = new URLSearchParams();
    
    // Add min price if not zero
    if (minPrice > 0) {
      params.append('min', minPrice);
    }
    
    // Always include max price
    params.append('max', 1000);
    
    // Add sort parameter
    params.append('sort', sort);
    
    // Add search term if available
    if (search) {
      // Extract search param from current URL search string
      const searchParams = new URLSearchParams(search);
      const searchTerm = searchParams.get('search');
      if (searchTerm) {
        params.append('search', searchTerm);
      }
    }
    
    // Add categories - using 'cat' parameter to match backend expectations
    if (selectedCategories.length > 0) {
      // For multiple categories, either use comma-separated values or multiple params
      // Option 1: Comma-separated - most common approach
      params.append('cat', selectedCategories.join(','));
      
      // Option 2: Multiple parameters - uncomment if your API expects this format
      // selectedCategories.forEach(cat => {
      //   params.append('cat', cat);
      // });
    }
    
    return `?${params.toString()}`;
  };

  const { isLoading, error, data, refetch } = useQuery({
    queryKey: ["gigs", search, minPrice, sort, selectedCategories],
    queryFn: () => {
      const queryString = constructQueryString();
      console.log("API Request URL:", `/gigs${queryString}`);
      
      return newRequest
        .get(`/gigs${queryString}`)
        .then((res) => {
          return res.data;
        });
    },
  });

  const reSort = (type) => {
    setSort(type);
    setOpen(false);
  };

  useEffect(() => {
    refetch();
  }, [sort, search, minPrice, selectedCategories]);

  const handleSubmit = () => {
    // Update URL without triggering a full page navigation
    navigate(`/gigs?search=${input}`, { replace: true });
    // Force refetch data with the new search parameter
    refetch();
  };

  return (
    <div className="gigs">
      <div className="container">
        <h1>Discover All Themes</h1>
        <p>
          Explore expertly crafted theme collections tailored to industries,
          styles, and goals — all handpicked to help you design with purpose and
          launch with confidence.
        </p>
        
        <div className="content-wrapper">
          {/* Sidebar filters */}
          <div className={`sidebar ${showFiltersMobile ? 'show' : ''}`}>
            <div className="filter-header">
              <h3>Filters</h3>
              <button 
                className="close-filters"
                onClick={() => setShowFiltersMobile(false)}
              >
                &times;
              </button>
            </div>
            
            <div className="filter-section">
              <h4>Price</h4>
              <div className="price-slider">
                <input 
                  type="range" 
                  min="0" 
                  max="1000" 
                  value={minPrice} 
                  onChange={(e) => setMinPrice(parseInt(e.target.value))}
                />
                <div className="price-labels">
                  <span className="current-price">
                    {minPrice === 0 ? "Any Price" : `Above $${minPrice}`}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="filter-section category-filter">
              <h4>Categories</h4>
              <div className="category-checkboxes">
                {categories.map((category) => (
                  <label key={category.id} className="category-option">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(category.id)}
                      onChange={() => handleCategoryChange(category.id)}
                    />
                    <span>{category.name}</span>
                  </label>
                ))}
              </div>
            </div>
            
            {/* Show active filters */}
            {(selectedCategories.length > 0 || minPrice > 0) && (
              <div className="filter-section">
                <h4>Active Filters</h4>
                <div className="active-filters">
                  {minPrice > 0 && (
                    <div className="filter-tag">
                      <span>Above ${minPrice}</span>
                      <button onClick={() => setMinPrice(0)}>&times;</button>
                    </div>
                  )}
                  
                  {selectedCategories.map(catId => {
                    const category = categories.find(c => c.id === catId);
                    return (
                      <div className="filter-tag" key={catId}>
                        <span>{category?.name}</span>
                        <button onClick={() => handleCategoryChange(catId)}>&times;</button>
                      </div>
                    );
                  })}
                  
                  {(selectedCategories.length > 0 || minPrice > 0) && (
                    <button 
                      className="clear-all"
                      onClick={() => {
                        setSelectedCategories([]);
                        setMinPrice(0);
                      }}
                    >
                      Clear All
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
          
          {/* Main content */}
          <div className="main-content">
            <div className="top-controls">
              <button 
                className="filter-toggle"
                onClick={() => setShowFiltersMobile(!showFiltersMobile)}
              >
                <SlidersHorizontal size={16} />
                <span>Filters</span>
              </button>
              
              <div className="search-bar-wrapper">
                <Search className="search-icon" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                />
                {/* <button onClick={handleSubmit}>Search</button> */}
              </div>
              
              <div className="sort-dropdown">
                <span className="sort-label">Sort by</span>
                <div className="selected-option" onClick={() => setOpen(!open)}>
                  {sort === "sales" ? "Best Selling" : sort === "createdAt" ? "Newest" : "Popular"}
                  <ChevronDown className="dropdown-arrow" />
                </div>
                {open && (
                  <div className="dropdown-menu">
                    <div 
                      className={`option ${sort === "sales" ? "active" : ""}`} 
                      onClick={() => reSort("sales")}
                    >
                      Best Selling
                    </div>
                    <div 
                      className={`option ${sort === "createdAt" ? "active" : ""}`} 
                      onClick={() => reSort("createdAt")}
                    >
                      Newest
                    </div>
                    <div 
                      className={`option ${sort === "popular" ? "active" : ""}`} 
                      onClick={() => reSort("popular")}
                    >
                      Popular
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="cards">
              {isLoading
                ? "Loading..."
                : error
                ? "Something went wrong!"
                : data && data.length > 0 
                ? data.map((gig) => <GigCard key={gig._id} item={gig} />)
                : <div className="no-results">No themes found matching your criteria</div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Gigs;