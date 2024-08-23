import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFaceFrown } from '@fortawesome/free-regular-svg-icons';
import items from './data';
import Filter from './Filter';
import LoginSignup from './LoginSignup'
import Navbar from './Navbar';


const allCategories = ['all', ...new Set(items.map((item) => item.category))].sort((a, b) => {
  if (a.toLowerCase() === 'all') return -1; // Keep 'all' as the first category
  return a.localeCompare(b); // Sort the rest alphabetically
});


function App() {
  const [menuItems, setMenuItems] = useState(items);
  menuItems.sort((a, b) => a.title.localeCompare(b.title));
  const [categories] = useState(allCategories);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [hideLoginForm,setHideLoginForm] = useState(false);
  const [hideLoginButton, setHideLoginButton] = useState(false);

  // const handlesetFlag = (value) =>{
  //   setFlag(value);
  // };

  const updatesearchquery = (value) => {
    setSearchQuery(value);
  };

  const filterItem = (category) => {
    setSelectedCategory(category);
  };

  useEffect(() => {
    let filteredItem = selectedCategory === 'all'
      ? items
      : items.filter((item) => item.category === selectedCategory);

    if (searchQuery) {
      filteredItem = filteredItem.filter((item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort the items by title
    filteredItem.sort((a, b) => a.title.localeCompare(b.title));

    setMenuItems(filteredItem);
  }, [searchQuery, selectedCategory]);

  return (
    <main>
      <Navbar handlesetHideLoginForm={setHideLoginForm} hideLoginButtonValue={hideLoginButton} />
      {hideLoginForm && <LoginSignup closeModal={() => setHideLoginForm(false)} hideLoginButton={() => setHideLoginButton(true)} />}

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
              <article key={id} className='menu-item'>
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
              </article>
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
