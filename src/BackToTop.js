import React, { useState } from 'react';
// import { IoIosArrowDropupCircle } from 'react-icons/io';
import './BackToTop.css';

function BackToTop() {
    const [visible, setVisible] = useState(false);

    const toggleVisible = () => {
        const scrolled = document.documentElement.scrollTop;
        if (scrolled > 300) {
            setVisible(true);
        } else if (scrolled <= 300) {
            setVisible(false);
        }
    };

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    window.addEventListener('scroll', toggleVisible);

    return (
        <div
            style={{ display: visible ? 'inline' : 'none' }}
            className='backToTop'
        >
            {/* <button onClick={scrollToTop} aria-label='Back to top'>
                <IoIosArrowDropupCircle className="backToTop-icon" />
            </button> */}

            <button onClick={scrollToTop} class="backToTop-Btn">
                <svg height="1.2em" class="arrow" viewBox="0 0 512 512"><path d="M233.4 105.4c12.5-12.5 32.8-12.5 45.3 0l192 192c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L256 173.3 86.6 342.6c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l192-192z"></path></svg>
                <p class="backToTop-text">Back To Top ⮞</p>
            </button>
        </div>
    );
}

export default BackToTop;
