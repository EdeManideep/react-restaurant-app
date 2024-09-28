import React, { useState, useEffect, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFaceFrown } from '@fortawesome/free-regular-svg-icons';
  import { Routes, Route, useNavigate } from  'react-router-dom';
// import items from './data';
import Filter from './Filter';
import LoginSignup from './LoginSignup';
import Navbar from './Navbar';
import Cart from './Cart';
import AddItems from './AddItems'
import ContactForm from './ContactForm';
import PopupMessage from './PopupMessage';
import BackToTop from './BackToTop';
import UpdateItem from './UpdateItem'
import DeleteItem from './DeleteItem';
import Orders from './Orders'

function App() {
  const [items, setItems] = useState([]);
  const [menuItems, setMenuItems] = useState(items);
  const navigate = useNavigate();
  const [refreshTime, setRefreshTime] = useState(true);

  // First useEffect: Fetch data once when the component mounts
  useEffect(() => {
    fetch('https://react-restaurant-app-1.onrender.com/items')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok ' + response.statusText);
        }else{
          setRefreshTime(false);
        }
        return response.json();
      })
      .then(data => setItems(data))
      .catch(error => console.error('Error fetching data:', error));
  }, []);
  // console.log(refreshTime);
  // console.log(items);
  

  // Second useEffect: Fetch data every 30 seconds (periodic update)
  useEffect(() => {
    const fetchItemsPeriodically = () => {
      fetch('https://react-restaurant-app-1.onrender.com/items')
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
          }
          return response.json();
        })
        .then(data => setItems(data))
        .catch(error => console.error('Error fetching data:', error));
    };

    // Set interval to update data every 30 seconds
    const interval = setInterval(() => {
      fetchItemsPeriodically();
    }, 30000); // 30 seconds = 30000 ms

    // Cleanup function to clear the interval when component unmounts
    return () => clearInterval(interval);
  }, []);

  const allCategories = ['all', ...new Set(items.map((item) => item.category))].sort((a, b) => {
    if (a.toLowerCase() === 'all') return -1; 
    return a.localeCompare(b); 
  });
  // console.log('allCategories:',{allCategories});
  
  // const [categories] = useState(allCategories);
  // console.log('categories:',{categories});
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [flagRemoveItemsInLoginSignup, setFlagRemoveItemsInLoginSignup] = useState(false);

  const [hideLoginButton, setHideLoginButton] = useState(() => {
    return JSON.parse(localStorage.getItem('hideLoginButton')) || false;
  });
  const [userName, setUserName] = useState(() => {
    return JSON.parse(localStorage.getItem('userName')) || '';
  });

  const [userId, setUserId] = useState(() => {
    return JSON.parse(localStorage.getItem('userId')) || '';
  });

  const [accountType, setAccountType] = useState(() => {
    return JSON.parse(localStorage.getItem('accountType')) || '';
  });

  // console.log(`userId:${userId}`);
  const [cartItems, setCartItems] = useState(() => {
    return JSON.parse(localStorage.getItem(`cartItems${userId}`)) || [];
  });
  
  useEffect(() => {
    // Fetch cart items from localStorage whenever userId changes
    const storedCartItems = JSON.parse(localStorage.getItem(`cartItems${userId}`)) || [];
    setCartItems(storedCartItems);
  }, [userId]); // Re-run effect whenever userId changes
  
  useEffect(() => {
    localStorage.setItem(`cartItems${userId}`, JSON.stringify(cartItems));
  }, [userId, cartItems]);

  const updatesearchquery = (value) => {
    setSearchQuery(value);
  };

  const filterItem = (category) => {
    setSelectedCategory(category);
  };
// console.log(userId,"uid")
  const filteredItems = useMemo(() => {
    let filtered = selectedCategory === 'all'
      ? items
      : items.filter((item) => item.category === selectedCategory);
  
    if (searchQuery) {
      filtered = filtered.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
  
    return filtered.sort((a, b) => a.name.localeCompare(b.name));
  }, [items, selectedCategory, searchQuery]);  

  useEffect(() => {
    setMenuItems(filteredItems);
  }, [filteredItems]);

  useEffect(() => {
    localStorage.setItem('hideLoginButton', JSON.stringify(hideLoginButton));
  }, [hideLoginButton]);

  useEffect(() => {
    localStorage.setItem('userId', JSON.stringify(userId));
    localStorage.setItem('userName', JSON.stringify(userName));
    localStorage.setItem('accountType', JSON.stringify(accountType));
  }, [userId, userName, accountType]);

  const handleUserDetailsRemoveLocalStorage = () => {
    setPopupMessageTop('');
    setTimeout(() => setPopupMessageTop(`${userName} Logged Out Successfully`), 0);
    localStorage.removeItem('hideLoginButton');
    localStorage.removeItem('userName');
    localStorage.removeItem('userId');
    localStorage.removeItem('accountType');
    // setHideLoginForm(true);
    setUserName('');
    setUserId('');
    setAccountType('');
    setCartItems([]);
    setHideLoginButton(false);
  };  

  const hideLoginButtonfunc = (value) => {
    setHideLoginButton(value);
  };

  const closeModal = (value) => {
    // setHideLoginForm(value);
  }

  const gettingUserName = (value) => {
    setUserName(value);
    setPopupMessageTop('');
    setTimeout(() => setPopupMessageTop(`${value} Login Successfully`), 0);
  }

  const gettingUserId = (value) => {
    setUserId(value);
  }

  const gettingAccountType = (value) => {
    setAccountType(value);
  }

  const flagRemoveItemsInLoginSignupFunction = (value) => {
    setFlagRemoveItemsInLoginSignup(value);
  }

  const addToCart = (item) => {
    if (userName) {
      setCartItems((prevItems) => {
        // Check if the item already exists in the cart
        const existingItem = prevItems.find(cartItem => cartItem.name === item.name);
  
        if (existingItem) {
          // If the item exists, update its count
          return prevItems.map(cartItem =>
            cartItem.name === item.name
              ? { ...cartItem, count: cartItem.count + 1 }
              : cartItem
          );
        } else {
          // If the item doesn't exist, add it to the cart with count 1
          const cartItem = {
            image: item.image,
            name: item.name,
            price: item.price,
            count: 1,
          };
          return [...prevItems, cartItem];
        }
      });
    } else {
      navigate('/loginsignup');
      setPopupMessageTop(''); // Clear the message temporarily
      setTimeout(() => setPopupMessageTop(`Login To Add Items Into The Cart`), 0);
    }
  };  

  const toggleCartPage = () => {
    navigate('/cart');
  };
  
  function updateCartItem(name, newQuantity) {
    let updatedCartItems;
  
    if (newQuantity === 0) {
      // Remove the item from the cart
      updatedCartItems = cartItems.filter(item => item.name !== name);
    } else {
      // Update the quantity of the item in the cart
      updatedCartItems = cartItems.map(item => {
        if (item.name === name) {
          return { ...item, count: newQuantity };
        }
        return item;
      });
    }
  
    // Update state and local storage
    setCartItems(updatedCartItems);
    localStorage.setItem(`cartItems${userId}`, JSON.stringify(updatedCartItems));
  }

  //clear the cartItems
  function clearCartItems(){
    setCartItems([]);
    localStorage.removeItem(`cartItems${userId}`);
  }

  // Function to handle when an item is deleted in DeleteItem component
  const handleDeleteItem = (deletedItem) => {
    const cartItem = cartItems.find(item => item.name === deletedItem.name);
    if (cartItem) {
        // Call updateCartItem to remove the item from the cart
        updateCartItem(deletedItem.name, 0);
        alert(`${deletedItem.name} was in the cart and has been removed.`);
    }
  };

  const [popupMessageTop, setPopupMessageTop] = useState('');
  
  return (
    <main style={{ 
      backgroundImage: refreshTime ? 'url(./images/bg-loading-menu-items.jpg)' : 'none',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      height: '100vh',
      width: '100%',
      position: 'relative',
      zIndex: 1000
    }}>

    { refreshTime && (
      <div className='loading-the-page-refreshTime'>
        <div className='loading-the-page'>
          <h4>
            <img src='./images/loading-icon.gif' alt='loading-icon'  className='loading-icon'/> 
            Preparing Database
            <br /><br />
            This may take a few seconds, please be patience
            <br /><br />
            Because the back end is deployed on free service!
          </h4>
          <h4 className='nameDesign'>-Flavors of India</h4>
        </div>
      </div>
    ) }

  { (menuItems.length > 0  || searchQuery) &&
    <Navbar 
        hideLoginButtonValue={hideLoginButton}
        userIdValue={userId}
        userNameValue={userName}
        accountTypeValue={accountType}
        handleUserDetailsRemoveLocalStorage={handleUserDetailsRemoveLocalStorage}
        flagRemoveItemsInLoginSignupFunction={flagRemoveItemsInLoginSignupFunction}
      /> }

    <PopupMessage message={popupMessageTop} duration={1500} />
    <BackToTop />
    
    <Routes>
      {refreshTime === false && <Route path='/' element={
        <section className="menu section">
          { (menuItems.length > 0  || searchQuery) &&
            <div className="title">
              <h2>Our Menu</h2>
              <div className="underline"></div>
            </div> }
          
          { (menuItems.length > 0  || searchQuery) &&
            <Filter 
              allCategories={allCategories} 
              filterItem={filterItem} 
              updatesearchquery={updatesearchquery}
            /> }

          <div className='section-center'>
            {menuItems.length !== 0 && (
              menuItems.map((menuItem, index) => {
              const { id, name, image, description, price,count_products_available
              } = menuItem;
              return (
                  <div key={id} className='menu-item'>
                    <img src={image} alt={name} className='photo' />
                    <div className='item-info'>
                      <header>
                        <h4>{name}</h4>
                      </header>
                      
                    </div>

                    <div className='item-info-center-algin'>
                      <p className='item-text'>{description}</p>
                      <h5 className='item-available-items'>Available Items: {count_products_available}</h5>
                      <div className='button-cart-price-item'>

                        <button onClick={() => {addToCart(menuItem); 
                                                if(userName){
                                                  setPopupMessageTop(''); // Clear the message temporarily
                                                  setTimeout(() => setPopupMessageTop(`${name} Added To Cart`), 0);
                                                }}
                                        } className='add-to-cart-button'>
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
            })) }
            
            { menuItems.length  === 0 && searchQuery && (
              <div className='no-filter-items'>
                  <h4>
                    No items found <FontAwesomeIcon icon={faFaceFrown} />
                    <br /><br />
                    Please try any other items
                  </h4>
              </div>
            )} 
          </div>

          { menuItems.length > 0 &&
            <div className="cart-icon-button" onClick={toggleCartPage}>
              <img src="./images/cart-icon.png" alt="Cart Icon" />
              <p className="goToCart-text">Go To Cart ⮞</p> {/* Moved inside the div */}
            </div> }
        </section>} /> }

        { userName === '' && <Route path='/loginsignup' element={<LoginSignup 
        closeModal={closeModal} 
        hideLoginButtonfunc={hideLoginButtonfunc}
        gettingUserName={gettingUserName}
        gettingUserId={gettingUserId}
        gettingAccountType={gettingAccountType}
        flagRemoveItemsInLoginSignupValue={flagRemoveItemsInLoginSignup}
        />} /> }
      { (menuItems.length > 0  || searchQuery) && <Route path='/cart' element={<Cart cartItems={cartItems} userId={userId} userName={userName} toggleCartPage={toggleCartPage} updateCartItem={updateCartItem} clearCartItems={clearCartItems}/>} /> }
      { userName !== '' && (menuItems.length > 0  || searchQuery) &&
      <>
        <Route path='/contact' element={<ContactForm />} />
        <Route path='/orders' element={<Orders accountType={accountType} />} />
      </>}
      { userName !== '' && (menuItems.length > 0  || searchQuery) && accountType === 'admin' && 
      <>
        <Route path='/addItem' element={<AddItems />} />
        <Route path='/updateItem' element={<UpdateItem items={items} />} />
        <Route path='/deleteItem' element={<DeleteItem onDeleteItem={handleDeleteItem} />} />
      </>}

      { refreshTime === false && <Route path="*" element={
        <div class="full-page-not-found" style={{ 
          backgroundImage: 'url(./images/bg-loading-menu-items.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: '100vh',
          width: '100%',
          position: 'relative',
          zIndex: 1001
        }}>
          <div class="message-container-not-found">
              <h2>Page Not Found</h2>
              <p>Sorry, the page you are looking for does not exist.</p>
              <a href="/" class="home-button">Go Back Home</a>
          </div>
        </div>} /> }

    </Routes>
    
    </main>
  );
}

export default App;