import React, { useState, useEffect, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFaceFrown } from '@fortawesome/free-regular-svg-icons';
import items from './data';
import Filter from './Filter';
import LoginSignup from './LoginSignup';
import Navbar from './Navbar';
import Cart from './Cart'; 

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
    return JSON.parse(localStorage.getItem('hideLoginButton')) || false;
  });
  const [userName, setUserName] = useState(() => {
    return JSON.parse(localStorage.getItem('userName')) || '';
  });

  const [cartItems, setCartItems] = useState(() => {
    return JSON.parse(localStorage.getItem('cartItems')) || [];
  });
  
  const [showCart, setShowCart] = useState(false);  // State to show/hide Cart

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

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
    localStorage.setItem('hideLoginButton', JSON.stringify(hideLoginButton));
  }, [hideLoginButton]);

  useEffect(() => {
    localStorage.setItem('userName', JSON.stringify(userName));
  }, [userName]);

  const handleUserDetailsRemoveLocalStorage = () => {
    localStorage.removeItem('hideLoginButton');
    localStorage.removeItem('userName');
    setHideLoginForm(true);
    setUserName('');
    setHideLoginButton(false);
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

  const setHideLoginFormfunc = (value) => {
    setHideLoginForm(value);
  }

  const flagRemoveItemsInLoginSignupFunction = (value) => {
    setFlagRemoveItemsInLoginSignup(value);
  }

  const addToCart = (item) => {
    if (userName) {
      setCartItems((prevItems) => {
        // Check if the item already exists in the cart
        const existingItem = prevItems.find(cartItem => cartItem.title === item.title);
  
        if (existingItem) {
          // If the item exists, update its count
          return prevItems.map(cartItem =>
            cartItem.title === item.title
              ? { ...cartItem, count: cartItem.count + 1 }
              : cartItem
          );
        } else {
          // If the item doesn't exist, add it to the cart with count 1
          const cartItem = {
            img: item.img,
            title: item.title,
            price: item.price,
            count: 1,
          };
          return [...prevItems, cartItem];
        }
      });
    } else {
      setHideLoginForm(true);  // Show login form if user is not logged in
    }
  };  

  const toggleCartPage = () => {
    setShowCart((prevShowCart) => !prevShowCart);
  };

  function updateCartItem(title, newQuantity) {
    let updatedCartItems;
  
    if (newQuantity === 0) {
      // Remove the item from the cart
      updatedCartItems = cartItems.filter(item => item.title !== title);
    } else {
      // Update the quantity of the item in the cart
      updatedCartItems = cartItems.map(item => {
        if (item.title === title) {
          return { ...item, count: newQuantity };
        }
        return item;
      });
    }
  
    // Update state and local storage
    setCartItems(updatedCartItems);
    localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
  }

  //clear the cartItems
  function clearCartItems(){
    setCartItems([]);
    localStorage.removeItem('cartItems');
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
          gettingUserName={gettingUserName}
          flagRemoveItemsInLoginSignupValue={flagRemoveItemsInLoginSignup}
        />
      )}

      {!showCart ? (
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
              menuItems.map((menuItem, index) => {
              const { id, title, img, desc, price } = menuItem;
              return (
                  <div key={id} className='menu-item'>
                    <img src={img} alt={title} className='photo' />
                    <div className='item-info'>
                      <header>
                        <h4>{title}</h4>
                      </header>
                      
                    </div>

                    <div className='item-info-center-algin'>
                      <p className='item-text'>{desc}</p>

                      <div className='button-cart-price-item'>
                        {/* <button onClick={() => addToCart(menuItem)}>Add</button> */}

                        <button onClick={() => addToCart(menuItem)} className='add-to-cart-button'>
                          ADD TO CART <img src="./images/cart-icon.png" alt="Cart Icon" className='cart-image-on-button'/>
                          <div class="arrow-wrapper">
                              <div class="arrow"></div>
                          </div>
                        </button>

                        <h4 className='price'>
                            <span>₹{price}</span>
                        </h4>
                      </div>
                    </div>
                  </div>
              );
            })): (
              <div className='no-filter-items'>
                  <h4>No items found <FontAwesomeIcon icon={faFaceFrown} /></h4>
              </div>
            )}
          </div>

          {/* Cart Image Button */}
          <div className="cart-icon-button"
            onClick={toggleCartPage}>
            <img src="./images/cart-icon.png" alt="Cart Icon" />
          </div>
        </section>
      ) : (
        <Cart cartItems={cartItems} userName={userName} toggleCartPage={toggleCartPage} updateCartItem={updateCartItem} clearCartItems={clearCartItems}/> 
      )}
      
    </main>
  );
}

export default App;
