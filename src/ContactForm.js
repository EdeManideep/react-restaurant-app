import React, { useRef } from "react";
import emailjs from "emailjs-com";
import './ContactForm.css';

const Contact = () => {
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