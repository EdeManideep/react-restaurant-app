import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFaceFrown } from '@fortawesome/free-regular-svg-icons';
import './Cart.css';

function Cart({ cartItems, userName, toggleCartPage, updateCartItem, clearCartItems }) {
  const [selectedValues, setSelectedValues] = useState({});
  const [popupMessage, setPopupMessage] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [flagDisplayClearButton, setFlagDisplayClearButton] = useState(false);

  useEffect(() => {
    if(cartItems.length === 0){
      setFlagDisplayClearButton(false);
    }else{
      setFlagDisplayClearButton(true);
    }
  },[cartItems]);

  const handleSelectChange = (title, value) => {
    setSelectedValues(prevValues => ({
      ...prevValues,
      [title]: value,
    }));
  };

  const handleAddItem = (title, currentCount, selectedValue) => {
    const newCount = currentCount + selectedValue;

    if (newCount > 100) {
      setPopupMessage(`Each item is limited to 100.`);
      setTimeout(() => setPopupMessage(''), 3000);
      return;
    }

    updateCartItem(title, newCount);
  };

  const handleRemoveItem = (title, currentCount, selectedValue) => {
    const newCount = currentCount - selectedValue;

    if (newCount <= 0) {
      updateCartItem(title, 0);
    } else {
      updateCartItem(title, newCount);
    }
  };

  const openConfirmation = () => {
    setShowConfirmation(true);
  }

  const confirmClearCart = () => {
    clearCartItems();
    setShowConfirmation(false);
  };

  const cancelClearCart = () => {
    setShowConfirmation(false);
  };

  return (
    <div className='cart'>
      <div>
        <div className='back-clear-cart-button'>
          <button type="button" className="back-button" onClick={toggleCartPage}>
            <div className="back-button-background">
              <svg width="25px" height="25px" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
                <path fill="#000000" d="M224 480h640a32 32 0 1 1 0 64H224a32 32 0 0 1 0-64z"></path>
                <path fill="#000000" d="m237.248 512 265.408 265.344a32 32 0 0 1-45.312 45.312l-288-288a32 32 0 0 1 0-45.312l288-288a32 32 0 1 1 45.312 45.312L237.248 512z"></path>
              </svg>
            </div>
            <p className="back-button-text">Menu</p>
          </button>

          {flagDisplayClearButton && <button className="delete-items-button" onClick={openConfirmation}>
            <svg viewBox="0 0 448 512" className="svgIcon"><path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"></path></svg>
          </button>}
        </div>
        <h2>Your Cart</h2>
        <div className="underline"></div>
      </div>

      {cartItems.length === 0 || !userName ? (
        <div className='empty-cart-div'>
          <h4>Your cart is empty <FontAwesomeIcon icon={faFaceFrown} /></h4>
          {!userName && <h4>Login for a better experience.</h4>}
        </div>
      ) : (
        <div>
          {popupMessage && <div className='popup-message'>{popupMessage}</div>}
          <div className='cart-header'>
            <span className='cart-header-item-name'>Item Name</span>
            <span className='cart-header-item-count'>Count</span>
            <span className='cart-header-item-price'>Price</span>
            <span className='cart-header-item-total-price'>Total Price</span>
            <span className='cart-header-item-action'>Item Action's</span>
          </div>
          <ul>
            {cartItems.map((item, index) => {
              const totalCost = item.price * item.count;
              const selectedValue = selectedValues[item.title] || 1;

              return (
                <li key={index} className='cart-item'>
                    <div className='cart-item-img-name'>
                      <img src={item.img} alt={item.title} className='cart-item-img' />
                      <span className='item-name'>{item.title}</span>
                    </div>

                    <div className='cart-item-info-actions'>
                      <div className='cart-item-info'>
                        <span>{item.count}</span>
                        <span>₹{item.price}</span>
                        <span>₹{totalCost}</span>
                      </div>
                      <div className="item-actions">
                        <select value={selectedValue} onChange={(e) => handleSelectChange(item.title, parseInt(e.target.value))} className="item-select">
                          {[...Array(5).keys()].map(i => (
                            <option key={i + 1} value={i + 1}>{i + 1}</option>
                          ))}
                        </select>
                        <button onClick={() => handleAddItem(item.title, item.count, selectedValue)} className="add-item">Add Item</button>
                        <button onClick={() => handleRemoveItem(item.title, item.count, selectedValue)} className="delete-item">Remove Item</button>
                        <button onClick={() => updateCartItem(item.title, 0)} className="delete-item">Delete Item</button>
                      </div>
                    </div>
                </li>
              );
            })}
          </ul>

          {showConfirmation && (
            <div className="confirmation-modal">
              <div className="confirmation-content">
                <h4>Are you sure you want to clear your cart?</h4>
                <div className="confirmation-actions">
                  <button onClick={confirmClearCart} className="confirm-button">
                    Yes, clear it
                  </button>
                  <button onClick={cancelClearCart} className="cancel-button">
                    No, keep it
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Cart;
