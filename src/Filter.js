import React, { useState, useEffect } from 'react';
import './Filter.css'; // Ensure to import the CSS file
import Marquee from "react-fast-marquee";

const Filter = ({ allCategories, filterItem, updatesearchquery }) => {
  const [inputValue, setInputValue] = useState('');
  const [currentCategory, setCurrentCategory] = useState('all');

  const handleInputChange = (event) => {
    const value = event.target.value;
    setInputValue(value);
    updatesearchquery(value);
  };

  const handleCategoryClick = (category) => {
    if (currentCategory !== category) {
      setInputValue(''); // Clear the input field when the category changes
      updatesearchquery(''); // Optionally reset the search query in the parent component
      setCurrentCategory(category);
    }
    filterItem(category);
  };

  useEffect(() => {
    filterItem(currentCategory);
  }, [filterItem, currentCategory]);

  return (
    <div>
      <div className='btn-container'>
        <div className="items-button-scroll">
          <Marquee 
              gradient={false} 
              speed={80} 
              pauseOnHover={true}
              pauseOnClick={true} 
              delay={0}
              play={true} 
              direction="left"
          >
            {/* {console.log(allCategories)} */}
            {allCategories.map((category, index) => (
              <button
                type="button"
                className={`filter-btn ${category === currentCategory ? 'selected' : ''}`}
                key={index}
                onClick={() => handleCategoryClick(category)}
              >
                {category}
              </button>
            ))}
            </Marquee>
        </div>
      </div>
      
      <div className='search-filter-items-div'>
        <input
          type='text'
          className='filter-input-text'
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Search for item"
        />
      </div>
    </div>
  );
};

export default Filter;
