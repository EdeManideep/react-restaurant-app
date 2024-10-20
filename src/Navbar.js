import React, { useState, useEffect, useRef } from 'react';
import './Navbar.css';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ hideLoginButtonValue, userNameValue, accountTypeValue, handleUserDetailsRemoveLocalStorage, flagRemoveItemsInLoginSignupFunction }) => {
  const navigate = useNavigate();
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const dropdownRef = useRef(null);  // To reference your dropdown element
  const navbarRef = useRef(null);    // To reference the navbar element
  const lastScrollTop = useRef(0);   // To persist the last scroll position across renders

  const handleSignInLoginForm = (event) => {
    event.preventDefault();
    navigate('/loginsignup');
  };

  const toggleDropdown = () => {
    setIsDropdownVisible(!isDropdownVisible);
  };

  // Effect to handle clicks outside of the dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownVisible(false);  // Hide dropdown if clicked outside
      }
    };

    // Add event listener on mount
    document.addEventListener('mousedown', handleClickOutside);

    // Cleanup event listener on unmount
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Effect to hide dropdown on component change (component unmount or route change)
  useEffect(() => {
    return () => {
      setIsDropdownVisible(false);  // Hide dropdown when the component is about to unmount
    };
  }, []);

  const handleLogout = () => {
    setIsDropdownVisible(false);
    handleUserDetailsRemoveLocalStorage();
    flagRemoveItemsInLoginSignupFunction(true);
    navigate('/loginsignup');
  };

  useEffect(() => {
    const handleScroll = () => {
      let currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;

      if (currentScrollTop > lastScrollTop.current) {
        // Scrolling down
        navbarRef.current.style.transform = 'translateY(-100%)';
        setIsDropdownVisible(false); // Hide dropdown when scrolling down
      } else {
        // Scrolling up
        navbarRef.current.style.transform = 'translateY(0)';
        setIsDropdownVisible(false); // Hide dropdown when scrolling up
      }

      lastScrollTop.current = currentScrollTop;
    };

    window.addEventListener('scroll', handleScroll);

    // Cleanup event listener on unmount
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="navbar-div" ref={navbarRef}>
      <img src='./images/logo-navbar.png' alt='Profile' className='restaurant-logo-navbar' onClick={() => navigate('/')} />

      {!hideLoginButtonValue && (
        <button className="navbar-loginsignup-button" onClick={handleSignInLoginForm}>
          Login / Sign Up
        </button>
      )}

      {hideLoginButtonValue && (
        <div className="profile-container">
          <button className="profile-button" onClick={toggleDropdown}>
            <img src='./images/profile.png' alt='Profile' className='profile-img-navbar' />
            {userNameValue}
          </button>
          {isDropdownVisible && (
            <div ref={dropdownRef} className="dropdown-menu">
              <div className='dropdown-menu-buttons'>
                {accountTypeValue === 'admin' && (
                  <>
                    <button className="add-item-button" onClick={() => { navigate('/addItem'); setIsDropdownVisible(false); }}>
                      Add Item
                    </button>

                    <button className="edit-item-button" onClick={() => { navigate('/updateItem'); setIsDropdownVisible(false); }}>
                      Edit Item
                    </button>

                    <button className="delete-item-button" onClick={() => { navigate('/deleteItem'); setIsDropdownVisible(false); }}>
                      Delete Item
                    </button>
                  </>
                )}

                <button className="orders-button" onClick={() => { navigate('/orders'); setIsDropdownVisible(false); }}>
                  Orders
                </button>

                <button className="contact-button" onClick={() => { navigate('/contact'); setIsDropdownVisible(false); }}>
                  Contact Us
                </button>

                <button className="logout-button" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Navbar;
