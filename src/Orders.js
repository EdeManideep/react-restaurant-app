import React, { useEffect, useState } from 'react';
import './Orders.css';

function Orders({ accountType }) {
    const [orders, setOrders] = useState([]);
    const [loadingOrderId, setLoadingOrderId] = useState(null);

    // Function to fetch orders from the database
    const fetchOrders = async () => {
        try {
            const response = await fetch('https://react-restaurant-app-1.onrender.com/orders'); 
            const data = await response.json();
            setOrders(data);
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };

    // Function to update order status
    const updateOrderStatus = async (orderId, status) => {
        setLoadingOrderId(orderId);
        try {
            await fetch(`https://react-restaurant-app-1.onrender.com/orders/${orderId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ order_status: status }),
            });
            fetchOrders();

            setTimeout(() => {
                setLoadingOrderId(null);
            }, 2000);

        } catch (error) {
            console.error('Error updating order status:', error);
            setLoadingOrderId(null);
        }
    };

    useEffect(() => {
        fetchOrders(); // Fetch orders when the component mounts

        // Set an interval to fetch orders every 30 seconds
        const interval = setInterval(() => {
            fetchOrders();
        }, 30000); // 30000 milliseconds = 30 seconds

        // Cleanup interval on component unmount
        return () => clearInterval(interval);
    }, []);

    const capitalize = (text) => {
        return text.charAt(0).toUpperCase() + text.slice(1);
    };

    return (
        <div className="orders-container">
            <h2>Orders</h2>
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
                                            <button onClick={() => updateOrderStatus(order.order_id, 'accepted')}>Accept</button>
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
