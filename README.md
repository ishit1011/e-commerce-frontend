# 🎮 Gaming E-Commerce Frontend

This is the **frontend** for a full-stack e-commerce platform focused on selling gaming consoles and accessories. It includes a responsive customer-facing interface, admin dashboard, and a rider PWA.

## 🌐 Live Deployment
- **Frontend (Vercel):** [https://e-commerce-frontend-delta-rose.vercel.app/](https://e-commerce-frontend-delta-rose.vercel.app/)

---

## 📦 Features

### 👤 Customer
- Google Sign-In (Only pre-approved users)
- Product Listing with:
  - Color and size variants
- Product Detail page
- Cart with selected variants
- Checkout (mock)
- Order placement via backend

### 🛠 Admin Dashboard
- View all orders
- Change order status (Paid → Shipped)
- Assign a rider to an order

### 🚴‍♂️ Rider PWA
- Google login
- View assigned orders
- Update status: Shipped → Delivered / Undelivered
- Mobile responsive

---

## 🔧 Tech Stack
- **React.js**
- **Tailwind CSS**
- **Firebase** (for Google Authentication)
- **Axios** for API calls
- **React Router DOM** for navigation
- **Deployed on Vercel**

---

## ⚙️ Setup Instructions

1. **Clone the repo**
   ```bash
   git clone https://github.com/yourusername/gaming-ecommerce-frontend.git
   cd gaming-ecommerce-frontend



# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
