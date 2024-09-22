import React, { useRef, useState } from "react";
import emailjs from "emailjs-com";
import './ContactForm.css';
import PopupMessage from './PopupMessage';

function Contact({ toggleContactFormPage }) {
  const form = useRef();
  const [popupMessageTop, setPopupMessageTop] = useState('');
  const [errors, setErrors] = useState({ name: '', email: '', message: '' });

  const validateForm = () => {
    const name = form.current.from_name.value.trim();
    const email = form.current.from_email.value.trim();
    const message = form.current.message.value.trim();
    const newErrors = { name: '', email: '', message: '' };

    if (!name) {
      newErrors.name = 'Name is required';
    }
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/.test(email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!message) {
      newErrors.message = 'Message is required';
    }

    setErrors(newErrors);

    return !newErrors.name && !newErrors.email && !newErrors.message;
  };

  const sendEmail = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    emailjs
      .sendForm(
        "service_tggzghh", 
        "template_vc3ibpf", 
        form.current,
        "TUeXsduFLHUHPVKai"
      )
      .then(
        (result) => {
          console.log(result.text);
          setPopupMessageTop('');
          setTimeout(() => setPopupMessageTop(`Mail sent successfully`), 0);
          form.current.reset();
          setErrors({ name: '', email: '', message: '' });
        },
        (error) => {
          console.log(error.text);
          setPopupMessageTop('');
          setTimeout(() => setPopupMessageTop(`Error sending mail, please try again later`), 0);
        }
      );
  };

  return (
    <div className="boby-contactForm">
      <PopupMessage message={popupMessageTop} duration={1500} />

      <form ref={form} onSubmit={sendEmail} className="contact-form">
      <div className="back-icon-contact-form-div">
        <button type="button" className="back-icon-contact-form-btn" onClick={toggleContactFormPage}>
            <img src="./images/back-icon-contact-form.png" alt="back-icon-contact-form" />
        </button>
        <p>Menu</p>
      </div>

        <h1 className="form-title">Contact Us</h1>

        <div className="input-container-div">
          <div className="input-container">
            <label>Name</label>
            <input
              type="text"
              name="from_name"
              className="form-input"
              placeholder="Enter your name"
            />
            {errors.name && <p className="error-message">{errors.name}</p>}
          </div>

          <div className="input-container">
            <label>Email</label>
            <input
              type="email"
              name="from_email"
              className="form-input"
              placeholder="Enter your Email / Gmail"
            />
            {errors.email && <p className="error-message">{errors.email}</p>}
          </div>

          <div className="input-container">
            <label>Message</label>
            <textarea
              name="message"
              className="form-message"
              placeholder="Type your message..."
            />
            {errors.message && <p className="error-message">{errors.message}</p>}
          </div>
        </div>

        <div className="submit-btn-contact">
          <button type="submit">
            <p>Send</p>
            <span className="submit-icon">✉️</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default Contact;
