import React, { useState } from 'react';
import axios from 'axios';
import './LoginSignup.css';

const API_URL = 'https://sheetdb.io/api/v1/g2oqzfvt4r6au';

const LoginSignup = ({ closeModal, hideLoginButton }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setErrors({ name: '', email: '', password: '', confirmPassword: '' }); // Reset errors on form toggle
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
    setErrors({ ...errors, [id]: '' }); // Clear error for the current field
  };

  const handleValidationMessages = () => {
    let newErrors = {};

    // Name Validation (only for signup)
    if (!isLogin) {
      if (formData.name.trim() === '') {
        newErrors.name = 'Name is required.';
      } else if (!/^[a-zA-Z\s]+$/.test(formData.name.trim())) {
        newErrors.name = 'Name can only contain letters and spaces.';
      }
    }  

    // Email Validation
    const emailPattern = /^[a-zA-Z0-9][a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (formData.email.trim() === '') {
      newErrors.email = 'Email is required.';
    } else if (!emailPattern.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address.';
    }

    // Password Validation
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (formData.password.trim() === '') {
      newErrors.password = 'Password is required.';
    } else if (!passwordPattern.test(formData.password)) {
      newErrors.password =
        'Password must be at least 8 characters long, contain one uppercase letter, one lowercase letter, one digit, and one symbol.';
    }

    // Confirm Password Validation (only for signup)
    if (!isLogin) {
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match.';
      }else if (formData.confirmPassword.trim() === '') {
        newErrors.password = 'Confirm Password is required.';
      }
    }

    setErrors(newErrors);

    // Return whether the validation passed
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Perform validation
    if (!handleValidationMessages()) {
      return;
    }

    if (!isLogin) {
      const data = {
        Name: formData.name,
        Email: formData.email,
        Password: formData.password,
      };

      try {
        await axios.post(API_URL, data);
        closeModal(); // Close modal on successful login
        hideLoginButton(); // You can add any action after a successful sign-up
        setFormData({ name: '', email: '', password: '', confirmPassword: '' });
      } catch (error) {
        setErrors({ ...errors, form: 'Failed to sign up. Please try again.' });
      }
    } else {
      try {
        const response = await axios.get(API_URL);
        const users = response.data;
        const user = users.find(
          (user) => user.Email === formData.email && user.Password === formData.password
        );

        if (user) {
          hideLoginButton();
          closeModal(); // Close modal on successful login
        } else {
          setErrors({ ...errors, form: 'Invalid email or password!' });
        }
      } catch (error) {
        setErrors({ ...errors, form: 'Failed to log in. Please try again.' });
      }
    }
  };

  return (
    <div className="modal-overlay">
      <div className="form-wrapper">
        <div className="form-left">
          <div className="form-left-content">
            <h3>{isLogin ? 'Login' : "Looks like you're new here!"}</h3>
            <p>{isLogin ? 'Get access to your Orders, Wishlist, and Recommendations' : "Sign up with your email to get started"}</p>
          </div>
          <div className="img-LoginSignup">
            {isLogin ? <img src="./images/login.png" alt="Login Illustration" /> : <img src="./images/signup.png" alt="Signup Illustration" />}
          </div>
        </div>

        <div className="form-right">
          <button className="close-btn" onClick={closeModal}>×</button>
          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={handleInputChange}
                />
                {errors.name && <p className="error-text">{errors.name}</p>}
              </div>
            )}
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="text"
                id="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleInputChange}
              />
              {errors.email && <p className="error-text">{errors.email}</p>}
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleInputChange}
              />
              {errors.password && <p className="error-text">{errors.password}</p>}
            </div>
            {!isLogin && (
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                />
                {errors.confirmPassword && <p className="error-text">{errors.confirmPassword}</p>}
              </div>
            )}
            <button type="submit" className="btn">
              {isLogin ? 'Login' : 'Sign Up'}
            </button>
            {errors.form && <p className="error-text">{errors.form}</p>}
          </form>
          <button onClick={toggleForm} className="toggle-btn">
            {isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Login'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginSignup;
