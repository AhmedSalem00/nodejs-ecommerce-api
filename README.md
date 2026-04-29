# 🛒 Node.js E-Commerce Backend API

A full-stack e-commerce backend built with Node.js, Express, and MongoDB using MVC architecture. It includes authentication, products, orders, payments, and admin features.

---

## 🚀 Tech Stack
Node.js • Express • MongoDB • Mongoose • JWT • Bcrypt • Cloudinary • MVC Pattern

---

## ✨ Features

🔐 Auth & Security  
- User registration & login  
- JWT authentication (token/cookies)  
- Password hashing (bcrypt)  
- Protected routes & middleware  

👤 User  
- Update profile  
- Role-based access control  

🛍️ Products  
- CRUD operations (create, read, update, delete)  
- Image upload (Cloudinary)  
- Categories  
- Filters & search  

🛒 Orders  
- Create orders  
- User order history  
- Order management  

⭐ Reviews  
- Product rating system  
- User reviews  

💳 Payments  
- Payment gateway integration  

🧑‍💼 Admin  
- Manage users, products, orders  

---

## 🏗️ Architecture
MVC Pattern (Models • Controllers • Routes)  
Clean and scalable backend structure  

---

## ⚙️ Setup

npm install  

Create .env:
MONGO_URI=your_mongo_url  
JWT_SECRET=your_secret  
CLOUDINARY_NAME=your_name  
CLOUDINARY_API_KEY=your_key  
CLOUDINARY_SECRET=your_secret  

npm run dev  

Server: http://localhost:3000  

---

## 🔌 API

Auth:
POST /api/register  
POST /api/login  

Products:
GET /api/products  
POST /api/products  
PUT /api/products/:id  
DELETE /api/products/:id  

Orders:
POST /api/orders  
GET /api/orders  

Reviews:
POST /api/reviews  

---

## 💡 Note
This project is based on a YouTube tutorial (Node.js + Express + MongoDB eCommerce API).

---

## 🚀 Author
Built with Node.js, Express & MongoDB
