import React, { useRef } from "react";
import emailjs from "emailjs-com";
import './ContactForm.css';

function Contact({ toggleContactFormPage }) {
  const form = useRef();

  const sendEmail = (e) => {
    e.preventDefault();

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
          alert("Message sent successfully");
          form.current.reset();
        },
        (error) => {
          console.log(error.text);
          alert("Error sending message, please try again later.");
        }
      );
  };

  return (
    <div className="boby-contactForm">
        <form ref={form} onSubmit={sendEmail} className="contact-form">
        <h1 className="form-title">Contact</h1>
        <button type="button" className="back-button" onClick={toggleContactFormPage}>
            <div className="back-button-background">
                <svg width="25px" height="25px" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
                    <path fill="#000000" d="M224 480h640a32 32 0 1 1 0 64H224a32 32 0 0 1 0-64z"></path>
                    <path fill="#000000" d="m237.248 512 265.408 265.344a32 32 0 0 1-45.312 45.312l-288-288a32 32 0 0 1 0-45.312l288-288a32 32 0 1 1 45.312 45.312L237.248 512z"></path>
                </svg>
            </div>
            <p className="back-button-text">Menu</p>
        </button>
        <div className="input-container">
            <label>Name</label>
            <input type="text" name="from_name" required className="form-input" placeholder="Enter your name" />
        </div>

        <div className="input-container">
            <label>Email</label>
            <input type="email" name="from_email" pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$" required className="form-input" placeholder="Enter your Email / Gmail" />
        </div>

        <div className="input-container">
            <label>Message</label>
            <textarea name="message" required className="form-message" placeholder="Type your message...." />
        </div>

        <div className="submit-btn">
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