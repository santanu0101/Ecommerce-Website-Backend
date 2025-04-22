
# 🛍️ E-Commerce Backend API

This is the backend RESTful API for an E-Commerce platform supporting multiple sellers, users, orders, cart functionality, category-based products, and integrated payment gateway PayPal. Built with Node.js, Express.js, MongoDB.

---

## 📁 Features

- User/Seller Registration & Login
- Role-based access ( Seller, User)
- Product management by sellers
- Categories (with validation before delete)
- Cart functionality per user
- Orders with history and status tracking
- Payment gateway integration (PayPal)
- seller-specific order control
- JWT-based authentication and authorization

---

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB + Mongoose
- **Auth**: JWT + bcrypt
- **Payment**:  PayPal
- **Error Handling**: Centralized middleware
- **Environment**: dotenv

---

## ⚙️ Setup Instructions

### 1. Clone the Repo
```bash
git clone https://github.com/santanu0101/Ecommerce-Website-Backend.git
cd ecommerce-website-backend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Create `.env` File

```env
PORT=8000
MONGO_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=sk_test_yourkey
PAYPAL_CLIENT_ID=your_paypal_id
PAYPAL_CLIENT_SECRET=your_paypal_secret
PAYPAL_MODE=sandbox
```

### 4. Start Server
```bash
npm run dev
```

---

## 🧪 API Routes Overview

| Resource  | Method & Route               | Access      |
|-----------|------------------------------|-------------|
| Users     | POST `/register`, `/login`   | Public      |
| Profile   | GET `/profile`               | Authenticated |
| Products  | CRUD `/products`, filter/sort| Seller/Admin/User |
| Categories| CRUD `/categories`           | Seller/Admin |
| Cart      | GET, POST, PUT, DELETE `/cart`| User       |
| Orders    | POST `/orders`               | User        |
| Orders    | GET `/orders`, `/orders/:id` | User/Admin/Seller |
| Payments  | POST `/payment/stripe-intent`<br>POST `/payment/paypal-create` | Authenticated |
| Admin     | GET `/users`, manage orders  | Admin       |

---

## 🧩 Connecting Frontend

You can use any frontend framework (React, Vue, Angular) to consume this API.

### Required Steps:

1. **Set `Authorization` Header** with JWT token after login:
```js
axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
```

2. **Use `/payment/stripe-intent` or `/payment/paypal-create`** to initiate payment. Then redirect to Stripe or use PayPal buttons.

3. **Use CORS on backend** (already configured or add `cors` middleware).

4. **Protect sensitive routes using middleware** (already implemented).

---

## 🧾 Seller-Specific Behavior

- Sellers can only:
  - Add/edit/delete their own products
  - Update status of orders containing **only their products**
  - Cannot manage other sellers' products

---

## 💳 Payment Flow

- Call `/payment/stripe-intent` with amount → use `client_secret` on frontend.
- OR Call `/payment/paypal-create` → capture with `/paypal-capture`.
- Backend verifies payments using SDK/webhooks.

---

## 📂 Project Structure

```
src/
│
├── controllers/
├── models/
├── routes/
├── middlewares/
├── utils/
├── config/
└── index.js
```

---

## 📬 Contribute or Customize

- You can clone this and add a frontend in `/client`.
- Open issues or pull requests if you improve features!

---

## 🧠 Tips

- Always validate category before deleting
- Seller cannot change another seller’s product or order
- Use Postman/ThunderClient for testing

---

## 📞 Support

If you have any questions or need help integrating frontend, feel free to contact or open an issue.

---

> 🚀 Built with ❤️ by Santanu Raj
