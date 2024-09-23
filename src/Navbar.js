import React, { useState } from 'react';
import './Navbar.css';

const Navbar = ({handlesetHideLoginForm, hideLoginButtonValue, userNameValue, accountTypeValue, handleUserDetailsRemoveLocalStorage, flagRemoveItemsInLoginSignupFunction, setVisibleItemFunction, setVisibleEditItemFunction, setVisibleDeleteItemFunction, setVisibleContactFormFunction}) => {
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  const handleSignInLoginForm = (event) => {
    event.preventDefault();
    handlesetHideLoginForm(true);
  };

  const toggleDropdown = () => {
    setIsDropdownVisible(!isDropdownVisible);
  };

  const handleLogout = () => {
    setIsDropdownVisible(false); // Hide dropdown after logout
    handleUserDetailsRemoveLocalStorage(); // Remove user details from localStorage
    flagRemoveItemsInLoginSignupFunction(true); // Trigger any additional actions on logout
  };

  let lastScrollTop = 0;

  window.addEventListener('scroll', function() {
    let currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (currentScrollTop > lastScrollTop) {
      // Scrolling down
      document.querySelector('.navbar-div').style.transform = 'translateY(-100%)';
      setIsDropdownVisible(false);
    } else {
      // Scrolling up
      document.querySelector('.navbar-div').style.transform = 'translateY(0)';
      setIsDropdownVisible(false);
    }

    lastScrollTop = currentScrollTop;
  });

  const handleAddItem = () => {
    setVisibleItemFunction();
  }

  const handleEditItem = () => {
    setVisibleEditItemFunction();
  }

  const handleDeleteItem = () => {
    setVisibleDeleteItemFunction();
  }

  const handleContactForm = () => {
    setVisibleContactFormFunction();
  }

  return (
    <div className="navbar-div">
      <img src='./images/logo-navbar.png' alt='Profile' className='restaurant-logo-navbar' />
      
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
            <div className="dropdown-menu">
              <div className='dropdown-menu-buttons'>
                {accountTypeValue === 'admin' && (
                  <>
                    <button className="add-item-button" onClick={() => { handleAddItem(); toggleDropdown(); }}>
                      Add Item
                    </button>

                    <button className="edit-item-button" onClick={() => { handleEditItem(); toggleDropdown(); }}>
                      Edit Item
                    </button>

                    <button className="delete-item-button" onClick={() => { handleDeleteItem(); toggleDropdown(); }}>
                      Delete Item
                    </button>
                  </>
                )}

                <button className="contact-button" onClick={ () => { handleContactForm(); toggleDropdown(); }}>
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
