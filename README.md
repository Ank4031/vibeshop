# Vibe Commerce

A full-stack e-commerce demo built with React (frontend) and Node.js/Express + MongoDB (backend).

## Desktop page
<img width="252" height="153" alt="Screenshot 2025-11-07 184214" src="https://github.com/user-attachments/assets/25ccf7b0-0bd5-4089-9397-4f33ee5faf76" />

## Cart Information
<img width="259" height="135" alt="Screenshot 2025-11-07 184223" src="https://github.com/user-attachments/assets/550e5bb7-2c48-401d-97e1-012e8255011c" />

## Ckeckout page
<img width="209" height="150" alt="Screenshot 2025-11-07 184231" src="https://github.com/user-attachments/assets/8dab64df-8a4e-4c22-b2e4-91340dbbd597" />


## Features
- Product listing and search
- Add to cart, remove from cart, update quantity
- Cart summary and checkout flow
- Backend API with product, cart, and checkout endpoints
- Modern UI with Tailwind CSS

## Folder Structure
```
Vibe Commerce/
├── backend/
│   ├── package.json
│   ├── src/
│   │   ├── app.js
│   │   ├── index.js
│   │   ├── config/db.js
│   │   ├── controllers/main.js
│   │   ├── models/cart.js
│   │   ├── models/product.js
│   │   ├── routes/route.js
│   │   └── utilities/
│   │       ├── apierror.js
│   │       ├── apiresponse.js
│   │       └── asynchandler.js
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   ├── public/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── CheckoutPage.jsx
│   │   ├── components/
│   │   │   ├── e_com_page.jsx
│   │   │   └── opencart.jsx
│   │   └── ...
└── README.md
```

## Backend Setup
1. Install dependencies:
   ```powershell
   cd backend
   npm install
   ```
2. Configure MongoDB connection in `src/config/db.js`.
3. Start the backend server:
   ```powershell
   node src/index.js
   ```
   The server runs on `http://localhost:3000` by default.

## Frontend Setup
1. Install dependencies:
   ```powershell
   cd frontend
   npm install
   ```
2. Start the frontend dev server:
   ```powershell
   npm run dev
   ```
   The app runs on `http://localhost:5173` by default (Vite).

## API Endpoints
- `GET /api/products` — List products
- `POST /api/addnewproduct` — Add a new product
- `POST /api/cart` — Add item to cart
- `GET /api/cart` — Get cart items
- `DELETE /api/cart/:id` — Remove item from cart
- `POST /api/checkout` — Get checkout summary
- `POST /api/cart/empty` — Empty the cart

## Frontend Pages
- **Product Listing:** Search and add products to cart
- **Cart Drawer:** View, update, and remove cart items
- **Checkout Page:** See itemized totals and place order

## Customization
- Update product model in `backend/src/models/product.js` for more fields
- Style components with Tailwind in `frontend/src/`
- Add more routes or features as needed


