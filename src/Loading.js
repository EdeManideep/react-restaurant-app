import React from 'react';
import './Loading.css';

const Loading = ({ text }) => {
    return (
        <div className="loading-container">
            <img src="./images/loading-logo.gif" alt="Loading" className="loading-gif" />
            <span className="loading-text">{text}</span>
        </div>
    );
};

export default Loading;