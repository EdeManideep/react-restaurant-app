import React, { useState } from 'react';
import './AddItems.css';
import PopupMessage from './PopupMessage';

const getRandomQuantity = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

function AddItem({ toggleAddItemPage }) {
    const [formData, setFormData] = useState({
        name: '',
        category: 'Non-veg Biryani',
        price: '',
        image: 'https://raw.githubusercontent.com/EdeManideep/Food_Item_Data_Images/main/Food_Item_Data_Images/item-.jpeg',
        description: '',
        count_products_available: getRandomQuantity(10, 40)
    });

    const [errors, setErrors] = useState({});
    const [popupMessageTop, setPopupMessageTop] = useState(''); 

    const validateForm = () => {
        const newErrors = {};
        if (!formData.name) newErrors.name = 'Name is required';
        if (!formData.category) newErrors.category = 'Category is required';
        if (!formData.price) newErrors.price = 'Price is required';
        if (!formData.image) newErrors.image = 'Image URL is required';
        if (!formData.description) newErrors.description = 'Description is required';
        if (formData.count_products_available <= 0) newErrors.count_products_available = 'Available quantity must be greater than 0';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!validateForm()) return;

        try {
            const response = await fetch('http://localhost:5000/add-item', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();
            if (response.ok) {
                setFormData({
                    name: '',
                    category: 'Non-veg Biryani',
                    price: '',
                    image: 'https://raw.githubusercontent.com/EdeManideep/Food_Item_Data_Images/main/Food_Item_Data_Images/item-.jpeg',
                    description: '',
                    count_products_available: getRandomQuantity(10, 40),
                });

                setPopupMessageTop('');
                setTimeout(() => setPopupMessageTop(`Item Added Successfully`), 0);
            } else {
                alert(`Error: ${data.error}`);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div className="form-container">
            {/* Popup message for updates */}
            <PopupMessage message={popupMessageTop} duration={1500} />

            <button type="button" className="back-button" onClick={toggleAddItemPage}>
                <div className="back-button-background">
                    <svg width="25px" height="25px" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
                        <path fill="#000000" d="M224 480h640a32 32 0 1 1 0 64H224a32 32 0 0 1 0-64z"></path>
                        <path fill="#000000" d="m237.248 512 265.408 265.344a32 32 0 0 1-45.312 45.312l-288-288a32 32 0 0 1 0-45.312l288-288a32 32 0 1 1 45.312 45.312L237.248 512z"></path>
                    </svg>
                </div>
                <p className="back-button-text">Menu</p>
            </button>

            <h2 className="form-title">Add New Item</h2>

            <form onSubmit={handleSubmit} className="item-form">
                <div className="form-group-add-item">
                    <label htmlFor="name" className="form-label">Name (60 characters max):</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        maxLength="60"
                        className="form-input"
                    />
                    {errors.name && <p className="error-message">{errors.name}</p>}
                </div>

                <div className="form-group-add-item">
                    <label htmlFor="category" className="form-label">Category (50 characters max):</label>
                    <input
                        type="text"
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        maxLength="50"
                        className="form-input"
                    />
                    {errors.category && <p className="error-message">{errors.category}</p>}
                </div>

                <div className="form-group-add-item">
                    <label htmlFor="price" className="form-label">Price (6 digits max):</label>
                    <input
                        type="number"
                        id="price"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        min='1'
                        max="999999"
                        className="form-input"
                    />
                    {errors.price && <p className="error-message">{errors.price}</p>}
                </div>

                <div className="form-group-add-item">
                    <label htmlFor="image" className="form-label">Image URL (110 characters max):</label>
                    <input
                        type="text"
                        id="image"
                        name="image"
                        value={formData.image}
                        onChange={handleChange}
                        maxLength="110"
                        className="form-input"
                    />
                    {errors.image && <p className="error-message">{errors.image}</p>}
                </div>

                <div className="form-group-add-item">
                    <label htmlFor="description" className="form-label">Description (300 characters max):</label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        maxLength="300"
                        className="form-textarea"
                    ></textarea>
                    {errors.description && <p className="error-message">{errors.description}</p>}
                </div>

                <div className="form-group-add-item">
                    <label htmlFor="count_products_available" className="form-label">Available Quantity (3 digits max):</label>
                    <input
                        type="number"
                        id="count_products_available"
                        name="count_products_available"
                        value={formData.count_products_available}
                        onChange={handleChange}
                        min='1'
                        max="999"
                        className="form-input"
                    />
                    {errors.count_products_available && <p className="error-message">{errors.count_products_available}</p>}
                </div>

                <button type="submit" className="submit-button">Submit</button>
            </form>
        </div>
    );
}

export default AddItem;
