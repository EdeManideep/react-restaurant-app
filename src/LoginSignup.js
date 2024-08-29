import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import './LoginSignup.css';
import emailjs from "emailjs-com";

const API_URL = 'https://sheetdb.io/api/v1/g2oqzfvt4r6au';

const Popup = ({ closePopup }) => {
  React.useEffect(() => {
    const timer = setTimeout(() => {
      closePopup();
    }, 2500);

    return () => clearTimeout(timer);
  }, [closePopup]);

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <img src="./images/email-sent.png" alt="Success" />
        <p>Email sent successfully!</p>
        <p>Check your email for OTP</p>
      </div>
    </div>
  );
};

const LoginSignup = ({ closeModal, hideLoginButtonfunc, gettingUserName, flagRemoveItemsInLoginSignupValue}) => {
  const [showPopup, setShowPopup] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    otp: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    otp: '',
    password: '',
    confirmPassword: '',
  });
  const [generatedOTP, setGeneratedOTP] = useState('');
  const [emailVerified, setEmailVerified] = useState(false);
  const form = useRef();
  useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem('loginData'));
    if (savedData) {
      setFormData({
        name: savedData.name || '',
        email: savedData.email || '',
        password: savedData.password || '',
        otp: '',
        confirmPassword: '',
      });
      setIsLogin(savedData.isLogin);
      hideLoginButtonfunc(isLogin); // Hide the login button if user is already logged in
      closeModal(false); // Close the modal immediately if the user is logged in
      
    }
  }, [hideLoginButtonfunc, closeModal, isLogin]);

  if(flagRemoveItemsInLoginSignupValue){
    localStorage.removeItem('loginData');
  }

  useEffect(() => {
    // Actions or updates to be performed whenever flagRemoveItemsInLoginSignupValue changes
    if (flagRemoveItemsInLoginSignupValue) {
      localStorage.removeItem('loginData');
      setFormData({
        name: '',
        email: '',
        otp: '',
        password: '',
        confirmPassword: '',
      });
      // setIsLogin(false);
    }
  }, [flagRemoveItemsInLoginSignupValue]);

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setErrors({ name: '', email: '', otp: '', password: '', confirmPassword: '' });
    setGeneratedOTP('');
    // setEmailVerified(false);
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });

    if (id === 'email') {
      const emailPattern = /^[a-zA-Z0-9][a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (value.trim() === '') {
        setErrors({ ...errors, email: 'Email is required.' });
        setEmailVerified(false);
      } else if (!emailPattern.test(value)) {
        setErrors({ ...errors, email: 'Please enter a valid email address.' });
        setEmailVerified(false);
      } else {
        setErrors({ ...errors, email: '' });
        setEmailVerified(true);
      }
    } else {
      setErrors({ ...errors, [id]: '' });
    }
  };

  const handleValidationMessages = () => {
    let newErrors = {};

    if (!isLogin) {
      if (formData.name.trim() === '') {
        newErrors.name = 'Name is required.';
      } else if (!/^[a-zA-Z\s]+$/.test(formData.name.trim())) {
        newErrors.name = 'Name can only contain letters and spaces.';
      }
    }

    const emailPattern = /^[a-zA-Z0-9][a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (formData.email.trim() === '') {
      newErrors.email = 'Email is required.';
    } else if (!emailPattern.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!isLogin && formData.otp.trim() === '') {
      newErrors.otp = 'OTP is required.';
    }

    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (formData.password.trim() === '') {
      newErrors.password = 'Password is required.';
    } else if (!passwordPattern.test(formData.password)) {
      newErrors.password =
        'At least 8 characters long, contain one uppercase letter, one lowercase letter, one digit and one symbol.';
    }

    if (!isLogin && (formData.confirmPassword.trim() === '' || formData.password !== formData.confirmPassword)) {
      newErrors.confirmPassword = formData.password !== formData.confirmPassword ? 'Passwords do not match.' : 'Confirm Password is required.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleOTPGeneration = () => {
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOTP(otp);
    sendEmailOTP(otp);
  };

  const sendEmailOTP = (otp) => {
    const templateParams = {
      name: formData.name,
      otp: otp,
      email: formData.email,
    };

    emailjs
      .send('service_9ghb2jv', 'template_hjhueiv', templateParams, 'Mn_4WKImjdoWqHU8F')
      .then(
        (result) => {
          setShowPopup(true);
        },
        (error) => {
          console.log(error.text);
        }
      );
  };

  const closingtheloginform=()=>{
    closeModal(false);
  }

  const closePopup = () => {
    setShowPopup(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!handleValidationMessages()) {
      return;
    }

    if (!isLogin && formData.otp !== generatedOTP) {
      setErrors({ ...errors, otp: 'Invalid OTP!' });
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
        setIsLogin(true);
        // localStorage.setItem('loginData', JSON.stringify({ ...formData, isLogin }));
        // closeModal(closeModal);
        // hideLoginButtonfunc(isLogin);
        // setFormData({ name: '', email: '', password: '', confirmPassword: '' });
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
          formData.name=user.Name;
          gettingUserName(user.Name)
          localStorage.setItem('loginData', JSON.stringify({ ...formData, isLogin }));
          hideLoginButtonfunc(isLogin);
          closeModal(false);
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
          <button className="close-btn" onClick={closingtheloginform}>×</button>
          <form ref={form} onSubmit={handleSubmit}>
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
              <div className="email-input-container">
                <input
                  type="text"
                  id="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
                {!isLogin && emailVerified && !generatedOTP && (
                  <button type="button" className="verify-email-btn" onClick={handleOTPGeneration}>
                    Verify Email
                  </button>
                )}
              </div>
              {errors.email && <p className="error-text">{errors.email}</p>}
            </div>
            {!isLogin && (
              <div className="form-group">
                <label htmlFor="otp">OTP</label>
                <input
                  type="text"
                  id="otp"
                  placeholder="Enter the OTP"
                  value={formData.otp}
                  onChange={handleInputChange}
                />
                {errors.otp && <p className="error-text">{errors.otp}</p>}
              </div>
            )}
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
      {showPopup && <Popup closePopup={closePopup} />}
    </div>
  );
};

export default LoginSignup;
