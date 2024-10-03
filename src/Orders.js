import React, { useEffect, useState, useCallback } from 'react';
import './Orders.css';

function Orders({ accountType, userId }) {
    const [orders, setOrders] = useState([]);
    const [loadingOrderId, setLoadingOrderId] = useState(null);
    const [insufficientQuantity, setInsufficientQuantity] = useState(null); // For popup message

    // Function to fetch orders from the database
    const fetchOrders = useCallback(async () => {
        try {
            const response = await fetch('https://react-restaurant-app-1.onrender.com/orders'); 
            const data = await response.json();
            // Filter orders if account type is user
            if (accountType === 'user') {
                const userOrders = data.filter(order => order.user_id === userId);
                setOrders(userOrders);
            } else {
                setOrders(data);
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    }, [accountType, userId]);

    // Function to check item availability from the database
    const fetchItemAvailability = async (itemName) => {
        try {
            const response = await fetch(`https://react-restaurant-app-1.onrender.com/item-availability/${itemName}`);
            const data = await response.json();
            return data.available_count; // Assuming the available count is returned
        } catch (error) {
            console.error('Error fetching item availability:', error);
            return null;
        }
    };

    // Function to update order status and check availability
    const handleAcceptOrder = async (orderId, itemName, orderQuantity) => {
        setLoadingOrderId(orderId);
        try {
            const availableCount = await fetchItemAvailability(itemName);

            if (availableCount === null) {
                throw new Error('Failed to fetch available item count.');
            }

            if (orderQuantity > availableCount) {
                setInsufficientQuantity('Insufficient quantity available');
                // Automatically decline the order if quantity exceeds available count
                await updateOrderStatus(orderId, 'declined');
            } else {
                // Accept the order and reduce the available count
                await updateOrderStatus(orderId, 'accepted');
                await updateItemCount(itemName, availableCount - orderQuantity);
            }
            
            setTimeout(() => {
                setLoadingOrderId(null);
                setInsufficientQuantity(null); // Clear popup after some time
            }, 2000);

            fetchOrders(); // Refresh orders after update

        } catch (error) {
            console.error('Error processing order:', error);
            setLoadingOrderId(null);
        }
    };

    // Function to update item count in the database
    const updateItemCount = async (itemName, newCount) => {
        try {
            await fetch(`https://react-restaurant-app-1.onrender.com/update-available-count/${itemName}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ available_count: newCount }),
            });
        } catch (error) {
            console.error('Error updating item count:', error);
        }
    };

    // Function to update order status
    const updateOrderStatus = async (orderId, status) => {
        try {
            await fetch(`https://react-restaurant-app-1.onrender.com/orders/${orderId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ order_status: status }),
            });
        } catch (error) {
            console.error('Error updating order status:', error);
        }
    };

    useEffect(() => {
        fetchOrders(); // Fetch orders when the component mounts

        // Set an interval to fetch orders every 30 seconds
        const interval = setInterval(() => {
            fetchOrders();
        }, 30000);

        return () => clearInterval(interval);
    }, [fetchOrders]);

    const capitalize = (text) => text.charAt(0).toUpperCase() + text.slice(1);

    return (
        <div className="orders-container">
            <h2>Orders</h2>
            {insufficientQuantity && (
                <div className="popup-message">{insufficientQuantity}</div> // Popup message for insufficient quantity
            )}
            {orders.length === 0 ? (
                <p>No orders to display</p>
            ) : (
                <table className="orders-table">
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            {accountType === 'admin' && (
                                <>
                                    <th>User ID</th>
                                    <th>User Name</th>
                                    <th>Item Name</th>
                                    <th>Quantity</th>
                                    <th>Order Creation Date & Time (IST)</th>
                                    <th>Order Status</th>
                                </>
                            )}
                            {accountType === 'user' && (
                                <>
                                    <th>Item Name</th>
                                    <th>Quantity</th>
                                    <th>Order Creation Date & Time (IST)</th>
                                    <th>Order Status</th>
                                </>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(order => (
                            <tr key={order.order_id}>
                                <td>{order.order_id}</td>
                                {accountType === 'admin' && (
                                    <>
                                        <td>{order.user_id}</td>
                                        <td>{order.user_name}</td>
                                    </>
                                )}
                                <td>{order.item_name}</td>
                                <td>{order.quantity}</td>
                                <td>{new Date(order.order_creation_date_time).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</td>
                                <td>
                                    {loadingOrderId === order.order_id ? (
                                        <span>Updating To DB</span>
                                    ) : accountType === 'admin' && order.order_status === 'pending' ? (
                                        <div>
                                            <button onClick={() => handleAcceptOrder(order.order_id,  order.item_name, order.quantity)}>Accept</button>
                                            <button onClick={() => updateOrderStatus(order.order_id, 'declined')}>Decline</button>
                                        </div>
                                    ) : (
                                        <span>{capitalize(order.order_status)}</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default Orders;
