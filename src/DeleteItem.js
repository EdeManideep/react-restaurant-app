import React, { useState, useEffect } from 'react';
import './DeleteItem.css'; // Make sure your CSS is properly linked

function DeleteItem() {
    const [items, setItems] = useState([]);
    const [filteredItems, setFilteredItems] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedItem, setSelectedItem] = useState(null);

    useEffect(() => {
        // Fetch items from the backend
        const fetchItems = async () => {
            try {
                const response = await fetch('https://react-restaurant-app-1.onrender.com/items'); // Update URL if needed
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const data = await response.json();
                // Sort items alphabetically by name
                const sortedItems = data.sort((a, b) => a.name.localeCompare(b.name));
                setItems(sortedItems);
                setFilteredItems(sortedItems);
            } catch (error) {
                console.error('Error fetching items:', error);
            }
        };

        fetchItems();
    }, []);
    // console.log(items);

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        const filtered = items.filter(item =>
            item.name.toLowerCase().includes(e.target.value.toLowerCase())
        );
        setFilteredItems(filtered);
    };

    const handleDelete = async () => {
        if (!selectedItem) return;

        const confirmDelete = window.confirm(`Are you sure you want to delete ${selectedItem.name}?`);
        if (confirmDelete) {
            try {
                const response = await fetch(`https://react-restaurant-app-1.onrender.com/delete-item/${selectedItem.id}`, { // Update URL if needed
                    method: 'DELETE',
                });
                if (response.ok) {
                    // Remove the deleted item from the state
                    const updatedItems = items.filter(item => item.id !== selectedItem.id);
                    setItems(updatedItems);
                    setFilteredItems(updatedItems);
                    setSelectedItem(null);
                    setSearchTerm('');
                    alert(`Item "${selectedItem.name}" has been deleted successfully.`);
                } else {
                    alert(`Failed to delete item "${selectedItem.name}".`);
                }
            } catch (error) {
                console.error('Error deleting item:', error);
            }
        }
    };

    return (
        <div className="delete-item-container">
            <h2 className="delete-item-title">Delete an Item</h2>
            <input
                type="text"
                placeholder="Search item by name..."
                value={searchTerm}
                onChange={handleSearch}
                className="search-input"
            />
            <select
                className="item-select"
                value={selectedItem ? selectedItem.id : ''}
                onChange={(e) => {
                    const selectedId = e.target.value;
                    const selectedItem = items.find(item => item.id === parseInt(selectedId, 10));
                    setSelectedItem(selectedItem);
                }}
            >
                <option value="">Select an item to delete</option>
                {filteredItems.map((item) => (
                    <option key={item.id} value={item.id.toString()}>
                        {item.name}
                    </option>
                ))}
            </select>
            <button onClick={handleDelete} className="delete-button">
                Delete
            </button>
        </div>
    );
}

export default DeleteItem;
