import React, { useState } from 'react';
import './Navbar.css';
import { useNavigate } from  'react-router-dom';

const Navbar = ({ hideLoginButtonValue, userNameValue, accountTypeValue, handleUserDetailsRemoveLocalStorage, flagRemoveItemsInLoginSignupFunction }) => {

  const navigate = useNavigate();

  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  const handleSignInLoginForm = (event) => {
    event.preventDefault();
    navigate('/loginsignup');
  };

  const toggleDropdown = () => {
    setIsDropdownVisible(!isDropdownVisible);
  };

  const handleLogout = () => {
    setIsDropdownVisible(false);
    handleUserDetailsRemoveLocalStorage();
    flagRemoveItemsInLoginSignupFunction(true);
    navigate('/loginsignup');
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
    navigate('/addItem');
  }

  const handleEditItem = () => {
    navigate('/updateItem');
  }

  const handleDeleteItem = () => {
    navigate('/deleteItem');
  }

  const handleContactForm = () => {
    navigate('/contact');
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
