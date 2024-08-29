import React, { useState, useEffect, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFaceFrown } from '@fortawesome/free-regular-svg-icons';
import items from './data';
import Filter from './Filter';
import LoginSignup from './LoginSignup';
import Navbar from './Navbar';
import './App.css'

const allCategories = ['all', ...new Set(items.map((item) => item.category))].sort((a, b) => {
  if (a.toLowerCase() === 'all') return -1; 
  return a.localeCompare(b); 
});

function App() {
  const [menuItems, setMenuItems] = useState(items);
  const [categories] = useState(allCategories);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [flagRemoveItemsInLoginSignup, setFlagRemoveItemsInLoginSignup] = useState(false);
  
  const [hideLoginForm, setHideLoginForm] = useState(false);
  const [hideLoginButton, setHideLoginButton] = useState(() => {
    // Retrieve the initial value from local storage, or default to false
    return JSON.parse(localStorage.getItem('hideLoginButton')) || false;
  });
  const [userName, setUserName] = useState(() => {
    // Retrieve the initial value from local storage, or default to ''
    return JSON.parse(localStorage.getItem('userName')) || '';
  })

  const updatesearchquery = (value) => {
    setSearchQuery(value);
  };

  const filterItem = (category) => {
    setSelectedCategory(category);
  };

  const filteredItems = useMemo(() => {
    let filtered = selectedCategory === 'all'
      ? items
      : items.filter((item) => item.category === selectedCategory);

    if (searchQuery) {
      filtered = filtered.filter((item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered.sort((a, b) => a.title.localeCompare(b.title));
  }, [selectedCategory, searchQuery]);

  useEffect(() => {
    setMenuItems(filteredItems);
  }, [filteredItems]);

  useEffect(() => {
    // Store the hideLoginButton state in local storage whenever it changes
    localStorage.setItem('hideLoginButton', JSON.stringify(hideLoginButton));
  }, [hideLoginButton]);

  useEffect(() => {
    // Store the userName state in local storage whenever it changes
    localStorage.setItem('userName', JSON.stringify(userName));
  }, [userName]);

  const handleUserDetailsRemoveLocalStorage = () => {
    localStorage.removeItem('hideLoginButton');
    localStorage.removeItem('userName');
    setHideLoginForm(true)
    setUserName('');
    setHideLoginButton(false)
  };  

  const hideLoginButtonfunc = (value) => {
    setHideLoginButton(value);
  };

  const closeModal = (value) => {
    setHideLoginForm(value);
  }

  const gettingUserName = (value) => {
    setUserName(value);
  }

  const setHideLoginFormfunc=(value)=>{
    setHideLoginForm(value)
  }

  const flagRemoveItemsInLoginSignupFunction = (value) => {
    setFlagRemoveItemsInLoginSignup(value);
  }

  const sampleFun = () => {
    console.log('hello from items click');
  }

  return (
    <main>
      <Navbar 
        handlesetHideLoginForm={setHideLoginFormfunc} 
        hideLoginButtonValue={hideLoginButton}
        userNameValue={userName}
        handleUserDetailsRemoveLocalStorage={handleUserDetailsRemoveLocalStorage}
        flagRemoveItemsInLoginSignupFunction={flagRemoveItemsInLoginSignupFunction}
      />
      
      {hideLoginForm && (
        <LoginSignup 
          closeModal={closeModal} 
          hideLoginButtonfunc={hideLoginButtonfunc}
          gettingUserName = {gettingUserName}
          flagRemoveItemsInLoginSignupValue = {flagRemoveItemsInLoginSignup}
        />
      )}
      <section className="menu section">
        <div className="title">
          <h2>our menu</h2>
          <div className="underline"></div>
        </div>

        <Filter 
          categories={categories} 
          filterItem={filterItem} 
          updatesearchquery={updatesearchquery}
        />

        <div className='section-center'>
          {menuItems.length ? (
            menuItems.map((menuItem) => {
            const { id, title, img, desc, price } = menuItem;
            return (
                <div key={id} className='menu-item' onClick={sampleFun}>
                  <img src={img} alt={title} className='photo' />
                  <div className='item-info'>
                    <header>
                      <h4>{title}</h4>
                      <h4 className='price'>
                        <span>₹{price}</span>
                      </h4>
                    </header>
                    <p className='item-text'>{desc}</p>
                  </div>
                </div>
            );
          })): (
            <div className = 'no-filter-items'>
                <h4>No items found <FontAwesomeIcon icon={faFaceFrown} /></h4>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

export default App;
