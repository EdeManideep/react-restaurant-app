import React, { useEffect, useState } from 'react';
import './PopupMessage.css';

function PopupMessage({ message, duration }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (message) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
      }, duration || 3000); // Default to 3 seconds if duration not provided
      
      return () => clearTimeout(timer); // Cleanup timer
    }
  }, [message, duration]);

  return (
    visible && (
      <div className="popup-message">
        <p>{message}</p>
      </div>
    )
  );
}

export default PopupMessage;
