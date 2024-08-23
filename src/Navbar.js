import React from 'react';
import './Navbar.css';

const Navbar = ({ handlesetHideLoginForm, hideLoginButtonValue }) => {
  const handleSignInLoginForm = (event) => {
    event.preventDefault();
    handlesetHideLoginForm(true);
  };

  return (
    <div className="navbar-div">
      {!hideLoginButtonValue && (
        <button className="navbar-button" onClick={handleSignInLoginForm}>
          Login / Sign Up
        </button>
      )}
    </div>
  );
};

export default Navbar;
