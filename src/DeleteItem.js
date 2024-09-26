import React, { useState, useEffect } from 'react';
import './DeleteItem.css';

function DeleteItem({ onDeleteItem }) {
    const [items, setItems] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);

    // Fetch items from the server when the component mounts
    useEffect(() => {
        const fetchItems = async () => {
            try {
                const response = await fetch('https://react-restaurant-app-1.onrender.com/items');
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const data = await response.json();
                // Sort items alphabetically by name
                const sortedItems = data.sort((a, b) => a.name.localeCompare(b.name));
                setItems(sortedItems);
            } catch (error) {
                console.error('Error fetching items:', error);
            }
        };

        fetchItems();
    }, []);

    // Handle deleting the selected item
    const handleDelete = async () => {
        if (!selectedItem) return;

        const confirmDelete = window.confirm(`Are you sure you want to delete ${selectedItem.name}?`);
        if (confirmDelete) {
            try {
                const response = await fetch(`https://react-restaurant-app-1.onrender.com/delete-item/${selectedItem.id}`, {
                    method: 'DELETE',
                });
                if (response.ok) {
                    const updatedItems = items.filter(item => item.id !== selectedItem.id);
                    setItems(updatedItems);
                    alert(`Item "${selectedItem.name}" has been deleted successfully.`);
                    onDeleteItem(selectedItem);
                    setSelectedItem(null); // Clear the selected item after deletion
                } else {
                    alert(`Failed to delete item "${selectedItem.name}".`);
                }
            } catch (error) {
                console.error('Error deleting item:', error);
            }
        }
    };

    // Handle selection change in dropdown
    const handleSelectChange = (e) => {
        const selected = items.find(item => item.name === e.target.value);
        setSelectedItem(selected);
    };
    // console.log(selectedItem);

    return (
        <div className="delete-item-page">
            <div className="delete-item-box">
                <h2 className="delete-item-header">Delete an Item</h2>

                <select className="delete-item-select" onChange={handleSelectChange} value={selectedItem ? selectedItem.name : ''}>
                <option value="">Select an item</option>
                    {items.map((item) => (
                    <option key={item.id} value={item.name}>
                        {item.name}
                    </option>
                    ))}
                </select>

                {/* Delete button */}
                <button onClick={handleDelete} className="delete-item-btn">
                    Delete
                </button>
            </div>
        </div>
    );
}

export default DeleteItem;