import React, { useState, useEffect } from 'react';

const Filter = ({ categories, filterItem, updatesearchquery }) => {
  const [inputValue, setInputValue] = useState('');
  const [currentCategory, setCurrentCategory] = useState(categories[0]);

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

  // Set default category on initial mount
  useEffect(() => {
    filterItem(currentCategory);
  }, [filterItem, currentCategory]);

  return (
    <div>
      <div className='btn-container'>
        {categories.map((category, index) => (
          <button
            type="button"
            className="filter-btn"
            key={index}
            onClick={() => handleCategoryClick(category)}
          >
            {category}
          </button>
        ))}
      </div>
      <br></br>
      <div className='search-filter-items-div'>
        <input
          type='text'
          className = 'filter-input-text'
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Search for item"
        />
      </div>
    </div>
  );
};

export default Filter;