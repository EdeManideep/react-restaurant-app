import React, { useState, useEffect } from 'react';
import './UpdateItem.css';
import PopupMessage from './PopupMessage';

function EditItem({ toggleEditItemPage }) {
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    image: '',
    description: '',
    count_products_available: ''
  });
  
  useEffect(() => {
    // Fetch items to populate the dropdown
    fetch('https://react-restaurant-app-1.onrender.com/items')
    .then((response) => response.json())
    .then((data) => {
      // Sort items in alphabetical order by name
      const sortedItems = data.sort((a, b) => a.name.localeCompare(b.name));
      setItems(sortedItems);
    })
    .catch((error) => console.error('Error fetching items:', error));
  }, []);
  
  const handleSelectChange = (e) => {
    const selected = items.find(item => item.name === e.target.value);
    if (selected) {
      setSelectedItem(selected);
      setFormData({
        name: selected.name,
        category: selected.category,
        price: selected.price,
        image: selected.image,
        description: selected.description,
        count_products_available: selected.count_products_available
      });
    } else {
      // Reset form and selected item if no valid selection
      setSelectedItem(null);
      setFormData({
        name: '',
        category: '',
        price: '',
        image: '',
        description: '',
        count_products_available: ''
      });
    }
  };
  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const [popupMessageTop, setPopupMessageTop] = useState(''); 

  const [errors, setErrors] = useState({});

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

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedItem) {
      setPopupMessageTop('');
      setTimeout(() => setPopupMessageTop(`Please select a valid item to update`), 0);
      return;
    }

    if (!validateForm()) {
      return;
    }

    // Convert ID to string
    const itemId = selectedItem.id.toString();
    console.log('Updating item:', itemId, formData);

    fetch(`https://react-restaurant-app-1.onrender.com/update-item/${itemId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        setPopupMessageTop('');
        setTimeout(() => setPopupMessageTop(`Item updated successfully`), 0);

        // Reset form data and selected item after successful update
        setFormData({
          name: '',
          category: '',
          price: '',
          image: '',
          description: '',
          count_products_available: ''
        });
        setSelectedItem(null);
      })
      .catch((error) => console.error('Error updating item:', error));
  };

  return (
    <div className="edit-item-container">
      <PopupMessage message={popupMessageTop} duration={1500} />

      <button type="button" className="back-button" onClick={toggleEditItemPage}>
        <div className="back-button-background">
          <svg width="25px" height="25px" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
            <path fill="#000000" d="M224 480h640a32 32 0 1 1 0 64H224a32 32 0 0 1 0-64z"></path>
            <path fill="#000000" d="m237.248 512 265.408 265.344a32 32 0 0 1-45.312 45.312l-288-288a32 32 0 0 1 0-45.312l288-288a32 32 0 1 1 45.312 45.312L237.248 512z"></path>
          </svg>
        </div>
        <p className="back-button-text">Menu</p>
      </button>
      
      <h2 className="edit-item-title">Edit Item</h2>
      <select className="dropdown-update-item" onChange={handleSelectChange} value={selectedItem ? selectedItem.name : ''}>
        <option value="">Select an item</option>
        {items.map((item) => (
          <option key={item.id} value={item.name}>
            {item.name}
          </option>
        ))}
      </select>

      {selectedItem && (
        <form className="edit-form" onSubmit={handleSubmit}>
          <label className="form-label">Name (60 characters max)</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            maxLength="60"
            className="form-input-update-item"
          />
          {errors.name && <p className="error-message">{errors.name}</p>}

          <label className="form-label">Category (50 characters max)</label>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            maxLength="50"
            className="form-input-update-item"
          />
          {errors.category && <p className="error-message">{errors.category}</p>}

          <label className="form-label">Price (6 digits max)</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            min="1"
            max="999999"
            className="form-input-update-item"
          />
          {errors.price && <p className="error-message">{errors.price}</p>}

          <label className="form-label">Image URL (110 characters max)</label>
          <input
            type="text"
            name="image"
            value={formData.image}
            onChange={handleChange}
            maxLength="110"
            className="form-input-update-item"
          />
          {errors.image && <p className="error-message">{errors.image}</p>}

          <label className="form-label">Description (300 characters max)</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            maxLength="300"
            className="form-textarea-update-item"
          />
          {errors.description && <p className="error-message">{errors.description}</p>}

          <label className="form-label">Available Quantity (3 digits max)</label>
          <input
            type="number"
            name="count_products_available"
            value={formData.count_products_available}
            onChange={handleChange}
            min="1"
            max="999"
            className="form-input-update-item"
          />
          {errors.count_products_available && <p className="error-message">{errors.count_products_available}</p>}

          <button type="submit" className="submit-button-update-item">Update Item</button>
        </form>
      )}
    </div>
  );
}

export default EditItem;
