import React, { useState } from 'react';
import './Navbar.css';

const Navbar = ({handlesetHideLoginForm, hideLoginButtonValue, userNameValue, handleUserDetailsRemoveLocalStorage, flagRemoveItemsInLoginSignupFunction}) => {
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

  return (
    <div className="navbar-div">
      {!hideLoginButtonValue && (
        <button className="navbar-button" onClick={handleSignInLoginForm}>
          Login / Sign Up
        </button>
      )}

      {hideLoginButtonValue && (
        <div className="profile-container">
          <button className="profile-button" onClick={toggleDropdown}>
            {userNameValue}
          </button>
          {isDropdownVisible && (
            <div className="dropdown-menu">
              <button className="logout-button" onClick={handleLogout}>
                Logout
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Navbar;
