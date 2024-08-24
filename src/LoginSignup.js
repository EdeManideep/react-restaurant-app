import React, { useState, useRef } from 'react';
import axios from 'axios';
import './LoginSignup.css';
import emailjs from "emailjs-com";

const API_URL = 'https://sheetdb.io/api/v1/g2oqzfvt4r6au';


const Popup = ({ closePopup }) => {
  // Automatically close the popup after 5 seconds
  React.useEffect(() => {
    const timer = setTimeout(() => {
      closePopup();
    }, 2500); // 2500ms = 2.5 seconds

    return () => clearTimeout(timer); // Clear timeout if the component unmounts
  }, [closePopup]);

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <img src="./images/email-sent.png" alt="Success" />
        <p>Email sent successfully!</p>
      </div>
    </div>
  );
};



const LoginSignup = ({ closeModal, hideLoginButton }) => {
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
  const [generatedOTP, setGeneratedOTP] = useState(''); // State to store the generated OTP
  const [emailVerified, setEmailVerified] = useState(false); // State to track email verification
  const form = useRef();

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setErrors({ name: '', email: '', otp: '', password: '', confirmPassword: '' });
    setGeneratedOTP(''); // Reset OTP on form toggle
    setEmailVerified(false); // Reset email verification on form toggle
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });

    // Real-time validation for email field
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
            setEmailVerified(true); // Email is valid
        }
    } else {
        setErrors({ ...errors, [id]: '' }); // Clear error for other fields
    }
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

    if (!isLogin) {
      if (formData.otp.trim() === '') {
        newErrors.otp = 'OTP is required.';
      }
    }

    // Password Validation
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (formData.password.trim() === '') {
      newErrors.password = 'Password is required.';
    } else if (!passwordPattern.test(formData.password)) {
      newErrors.password =
        'Password must be at least 8 characters long, contain one uppercase letter, one lowercase letter, one digit and one symbol.';
    }

    // Confirm Password Validation (only for signup)
    if (!isLogin) {
      if (formData.confirmPassword.trim() === '') {
        newErrors.confirmPassword = 'Confirm Password is required.';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match.';
      }
    }

    setErrors(newErrors);

    // Return whether the validation passed
    return Object.keys(newErrors).length === 0;
  };

  const handleOTPGeneration = () => {
    // Generate a random 4-digit OTP
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOTP(otp);

    // Send OTP via email
    sendEmailOTP(otp);

    // alert(`Your OTP is: ${otp}`); // For testing purposes, we show the OTP in an alert
  };

  const sendEmailOTP = (otp) => {
    const templateParams = {
      name: formData.name,
      otp: otp,
      email: formData.email,
    };    

    emailjs
      .send(
        'service_9ghb2jv', 
        'template_hjhueiv', 
        templateParams,
        'Mn_4WKImjdoWqHU8F'
      )
      .then(
        (result) => {
          console.log('OTP sent:', result.text);
          setShowPopup(true); // Show popup on success
          // alert("OTP sent to your email successfully.");
        },
        (error) => {
          console.log(error.text);
          // alert("Error sending OTP, please try again later.");
        }
      );
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Perform validation
    if (!handleValidationMessages()) {
      return;
    }

    // Verify the OTP
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
        closeModal();
        hideLoginButton();
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
          closeModal();
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
