import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFaceFrown } from '@fortawesome/free-regular-svg-icons';
import './Cart.css';
import PopupMessage from './PopupMessage';
import { useNavigate } from  'react-router-dom';
import Loading from './Loading';
import emailjs from 'emailjs-com';

function Cart({ cartItems, userId, userName, updateCartItem, clearCartItems }) {
  const [popupMessageTop, setPopupMessageTop] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [flagDisplayClearButton, setFlagDisplayClearButton] = useState(false);
  const [showCheckoutOptions, setShowCheckoutOptions] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const toggleCartPage = () => {
    navigate('/');
  };

  useEffect(() => {
    if (cartItems.length === 0) {
      setFlagDisplayClearButton(false);
    } else {
      setFlagDisplayClearButton(true);
    }
  }, [cartItems]);

  const handleAddItem = (name, currentCount) => {
    const newCount = currentCount + 1;

    if (newCount > 100) {
      setPopupMessageTop('');
      setTimeout(() => setPopupMessageTop(`Each item is limited to 100.`), 0);
      return;
    }

    
    updateCartItem(name, newCount);
    setPopupMessageTop('');
    setTimeout(() => setPopupMessageTop(`${name} Updated Successfully`), 0);
  };

  const handleRemoveItem = (name, currentCount) => {
    const newCount = currentCount - 1;

    if (newCount <= 0) {
      updateCartItem(name, 0);
      setPopupMessageTop(`${name} Deleted From Cart!`);
    } else {
      updateCartItem(name, newCount);
      setPopupMessageTop(''); // Clear the message temporarily
      setTimeout(() => setPopupMessageTop(`${name} Removed From Cart`), 0); // Delay setting the message
    }
  };

  const openConfirmation = () => {
    setShowConfirmation(true);
  };

  const confirmClearCart = () => {
    clearCartItems();
    setShowConfirmation(false);
  };

  const cancelClearCart = () => {
    setShowConfirmation(false);
  };

  // Function to handle checkout button click
  const handleCheckout = () => {
    setShowCheckoutOptions(!showCheckoutOptions);
    setLoading(false);
  };

  // Calculate total count of items and total amount
  const totalItemCount = cartItems.reduce((acc, item) => acc + item.count, 0);
  const totalAmount = cartItems.reduce((acc, item) => acc + (item.count * item.price), 0);
  console.log(cartItems);

  const submitCartItems = async () => {
    try {
        setLoading(true);
        const response = await fetch('https://react-restaurant-app-1.onrender.com/add-cart-item', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user_id: userId,
                user_name: userName,
                order_status: 'pending',
                cart_items: cartItems.map(item => ({
                    item_name: item.name,
                    quantity: item.count,
                    itemId: item.itemId,
                })),
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Server error: ${errorData.error || 'Unknown error'}`);
        } else {
            setPopupMessageTop('Cart items added successfully');
            setTimeout(() => {
                clearCartItems();
            }, 2000);
        }
    } catch (error) {
        console.error('Error submitting cart items:', error.message || error);
        setPopupMessageTop('Failed to add cart items');
        setLoading(false);
    }
};


const sendTakeAwayOrderEmail = (userId, userName, cartItems) => {
  // Format the cart items into a string for the email
  const formattedCartItems = cartItems
    .map((item) => `Item: ${item.name}, Quantity: ${item.count}, Item ID: ${item.itemId}`)
    .join('\n'); // Join items with a line break

  const templateParams = {
    user_id: userId,
    user_name: userName,
    cart_items: formattedCartItems, // Send formatted cart items
  };

  emailjs
    .send('service_9ghb2jv', 'template_su2nsh6', templateParams, 'Mn_4WKImjdoWqHU8F') // Replace with your actual service ID, template ID, and user ID
    .then(
      (result) => {
        console.log('Email sent successfully:', result.text);
      },
      (error) => {
        console.log('Email sending failed:', error.text);
      }
    );
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
            <div className="delete-icon">
              <svg viewBox="0 0 16 16" className="bi bi-trash3-fill" fill="currentColor" height="18" width="18" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06Zm6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528ZM8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5"
                ></path>
              </svg>
            </div>

            <div className="delete-items-button-text">Clear Cart 🛒</div>
          </button>
          }
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
          <PopupMessage message={popupMessageTop} duration={1500} />
          <div className='cart-header'>
            <span className='cart-header-item-name'>Item Name</span>
            <span className='cart-header-item-count'>Quantity</span>
            <span className='cart-header-item-price'>Price</span>
            <span className='cart-header-item-total-price'>Total Price</span>
            <span className='cart-header-item-action'>Item Action's</span>
          </div>
          <ul>
            {cartItems.map((item, index) => {
              const totalCost = item.price * item.count;

              return (
                <li key={index} className='cart-item'>
                    <div className='cart-item-img-name'>
                      <img src={item.image} alt={item.name} className='cart-item-img' />
                      <span className='item-name'>{item.name}</span>
                    </div>

                    <div className='cart-item-info-actions'>
                      <div className='cart-item-info'>
                        <span>{item.count}</span>
                        <span>₹{item.price}</span>
                        <span>₹{totalCost}</span>
                      </div>
                      <div className="item-actions">
                        <button onClick={() => handleAddItem(item.name, item.count)} className="add-remove-item">➕</button>
                        <span>{item.count}</span>
                        <button onClick={() => handleRemoveItem(item.name, item.count)} className="add-remove-item">➖</button>
                        <button onClick={() => {updateCartItem(item.name, 0); setPopupMessageTop(`${item.name} Deleted From Cart`);}} className="delete-item">Delete Item</button>
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

          <div className="checkout-section">
            <h4>Total Count of Items: {totalItemCount}</h4>
            <h4>Total Amount: ₹{totalAmount}</h4>
            <button className="checkout-button" onClick={handleCheckout}>Checkout</button>
          </div>

          {showCheckoutOptions && (
            <div className="confirmation-modal">
              <div className="confirmation-content">
                <button className="close-btn-cart" onClick={handleCheckout}>×</button>
                <h4>Choose One Option</h4>
                <div className="confirmation-actions">
                <button className="option-button" onClick={submitCartItems} >Take Away</button>
                <button className="option-button">Book a Table</button>
                </div>
                {loading && <Loading text="Request Processing" />}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Cart;
