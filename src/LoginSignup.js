import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import './LoginSignup.css';
import emailjs from "emailjs-com";
import Loading from './Loading';
import { useNavigate } from  'react-router-dom';

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

const LoginSignup = ({ hideLoginButtonfunc, gettingUserName, gettingUserId, gettingAccountType, flagRemoveItemsInLoginSignupValue}) => {

  const navigate = useNavigate();
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
  const [loginType, setLoginType] = useState('user');
  const adminMails = ['manideepede9@gmail.com'];
  const [showEyePasswordIcon, setShowEyePasswordIcon] = useState(true);
  const [showEyeConfirmPasswordIcon, setShowConfirmEyePasswordIcon] = useState(true);
  const [loading, setLoading] = useState(false);

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
      hideLoginButtonfunc(isLogin);
      navigate('/');
    }
  }, [hideLoginButtonfunc, navigate, isLogin]);

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

    if ((!isLogin || (isLogin && loginType === 'admin')) && formData.otp.trim() === '' && generatedOTP === '') {
      newErrors.otp = 'OTP is required, Please Verify Email to send the OTP.';
    } else if ((!isLogin || (isLogin && loginType === 'admin')) && formData.otp.trim() === '') {
      newErrors.otp = 'OTP is required, Check Your Email for OTP.';
    } else if (formData.otp.trim().length < 4) {
      newErrors.otp = 'OTP must be at least 4 characters.';
    } else if (formData.otp.trim() !== generatedOTP) {
      newErrors.otp = 'Invalid OTP.';
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
    // console.log(formData);
    // console.log(formData.email);
  if (isLogin && loginType === 'admin' && !adminMails.includes(formData.email)) {
    setErrors({ ...errors, email: 'Email is not in admin mails. Please try user login.' });
    // console.log('not admin');
    return '';
  }
  
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
    navigate('/');
  }

  const closePopup = () => {
    setShowPopup(false);
  };

  const loginTypeAdminFunction = () => {
    setLoginType('admin');
  }
  
  const loginTypeUserFunction = () => {
    setLoginType('user');
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!handleValidationMessages()) {
      return;
    }
    
    if (!isLogin && formData.otp !== generatedOTP) {
      setErrors({ ...errors, otp: 'Invalid OTP!' });
      return;
    }
    setLoading(true);

    if (!isLogin) {
      console.log("trying signup.");
      const data = {
        user_name: formData.name,
        user_email: formData.email,
        user_password: formData.password,
        account_type: 'user',
      };

      try {
        await axios.post(API_URL, data);
        setIsLogin(true);
      } catch (error) {
        setErrors({ ...errors, form: 'Failed to sign up. Please try again.' });
      }
      setLoading(false);
    } else {
      try {
        console.log("loging trying");
        const response = await axios.get(API_URL);
        const users = response.data;
        const user = users.find(
          (user) => user.user_email === formData.email && user.user_password === formData.password
        );
        console.log(user);

        if (user) {
          formData.name=user.user_name;
          gettingUserName(user.user_name);
          gettingUserId(user.user_id);
          gettingAccountType(user.account_type);
          localStorage.setItem('loginData', JSON.stringify({user_id : user.user_id, name : user.user_name, email : user.user_email, password : user.user_password, isLogin }));
          hideLoginButtonfunc(isLogin);
          navigate('/');
        } else {
          setErrors({ ...errors, form: 'Invalid email or password!' });
          setLoading(false);
        }
      } catch (error) {
        setErrors({ ...errors, form: 'Failed to log in. Please try again.' });
      }
    }
  };

  const [isAdmin, setIsAdmin] = useState(false); // Toggle state for admin/user

  const handleToggleChange = (e) => {
    setLoading(false);
    setIsAdmin(e.target.checked);
    if (e.target.checked) {
      loginTypeAdminFunction();
    } else {
      loginTypeUserFunction();
    }
  };

  const togglePasswordVisibility = () => {
    setShowEyePasswordIcon(!showEyePasswordIcon);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmEyePasswordIcon(!showEyeConfirmPasswordIcon);
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
          {isLogin && (
            <div className='toggle-button-div'>
              <h4 id="user-heading" style={{ textDecoration: !isAdmin ? 'underline' : 'none' }}>User</h4>

              <div className="toggle-button">
                <input 
                  id="toggleButton" 
                  type="checkbox" 
                  checked={isAdmin} 
                  onChange={handleToggleChange} 
                />
                <label htmlFor="toggleButton">
                  <div className="toggle-button-handle"></div>
                </label>
              </div>

              <h4 id="admin-heading" style={{ textDecoration: isAdmin ? 'underline' : 'none' }}>Admin</h4>
            </div>
          )}


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
                {(!isLogin || loginType === 'admin') && emailVerified && !generatedOTP && (
                  <button type="button" className="verify-email-btn" onClick={handleOTPGeneration}>
                    Verify Email
                  </button>
                )}
              </div>
              {errors.email && <p className="error-text">{errors.email}</p>}
            </div>
            {(!isLogin || loginType === 'admin') && (
              <div className="form-group">
                <label htmlFor="otp">OTP</label>
                <input
                  type="password"
                  id="otp"
                  placeholder="Enter the OTP"
                  // minLength={4}
                  maxLength={4}
                  value={formData.otp}
                  onChange={handleInputChange}
                />
                {errors.otp && <p className="error-text">{errors.otp}</p>}
              </div>
            )}
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className='password-input-wrapper'>
                <input
                  type={showEyePasswordIcon ? "password" : "text"}
                  id="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="password-input" />

                {formData.password &&
                  <span className="toggle-password-icon" onClick={togglePasswordVisibility}>
                    {showEyePasswordIcon ? (
                      <img src="./images/open-eye-icon.png" alt="Show Password" className="password-icon" />
                    ) : (
                      <img src="./images/hidden-eye-icon.png" alt="Hide Password" className="password-icon" />
                    )}
                  </span>
                }
              </div>

              {errors.password && <p className="error-text">{errors.password}</p>}
            </div>
            {!isLogin && (
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <div className='password-input-wrapper'>
                  <input
                    type={showEyeConfirmPasswordIcon ? 'password' : 'text'}
                    id="confirmPassword"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="password-input" />
                  
                  {formData.confirmPassword &&
                    <span className="toggle-password-icon" onClick={toggleConfirmPasswordVisibility}>
                      {showEyePasswordIcon ? (
                        <img src="./images/open-eye-icon.png" alt="Show Password" className="password-icon" />
                      ) : (
                        <img src="./images/hidden-eye-icon.png" alt="Hide Password" className="password-icon" />
                      )}
                    </span>
                  }
                </div>
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
      {loading && <Loading text="Verifying Credentials" />}
        </div>
      </div>
      {showPopup && <Popup closePopup={closePopup} />}
    </div>
  );
};

export default LoginSignup;
