# 🍽️ Restaurant Web App – *Flavors of India*

A responsive and interactive restaurant web application built using **React.js** and **Node.js**, offering a seamless user experience for browsing menus, managing carts, placing orders, and booking tables.

---

## 🔥 Features

### 🛒 Cart & Checkout
- Dynamic cart management with item count and total calculation.
- Checkout with animated buttons for:
  - ✅ **Take Away**
  - 🍽️ **Book a Table**

### 📦 Order Management
- Stores orders in CockroachDB with `"pending"` status.
- Sends order confirmation emails using **EmailJS**, including `user_id` and `user_name`.
- Admin dashboard to:
  - View all orders
  - Update order statuses
  - Track real-time item availability
- Inventory count updates after each order, ensuring no overbooking.

### 🎨 UI/UX
- Clean, modern design with responsive layout.
- Basic custom **CSS styling** and **animations** for pop-ups and transitions.
- Validation for all forms with user-friendly error messages.
- Background images shown when no menu items are available.

---

## 🧠 Technologies Used

- **Frontend**: React.js, JSX, CSS
- **Backend**: Node.js, Express
- **Database**: CockroachDB
- **Email**: EmailJS
- **Hosting**: Netlify (Frontend), Render (Backend)
- **Version Control**: GitHub
- **Other**: sheetDB (for external sheet storage)

---

## 🚀 Live Demo

🔗 **Frontend**: [https://react-restaurant-app1.netlify.app](https://react-restaurant-app1.netlify.app)  
🔗 **GitHub Repository**: [https://github.com/EdeManideep/react-restaurant-app](https://github.com/EdeManideep/react-restaurant-app)

---

## 🔑 Guest Login Credentials

> Use these to explore the full user experience without signing up:

- **Email**: `guest@gmail.com`
- **Password**: `Guest@1234`

---

## 🧑‍💻 Author

**EDE MANIDEEP**  
Built during personal learning & exploration phase to practice full-stack development and UI design using modern tools and APIs.

---

## 🛠 Skills Used

- React.js
- Node.js
- JavaScript / JSX
- CSS
- EmailJS
- Netlify / Render
- CockroachDB
- sheetDB
- GitHub
