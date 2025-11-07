import React, { useReducer, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function currency(n) {
  return n.toLocaleString(undefined, { style: "currency", currency: "INR" });
}

function cartReducer(state, action) {
  switch (action.type) {
    case "hydrate":
      return action.payload || [];
    case "add": {
      const item = state.find((i) => i._id === action.payload._id);
      if (item) {
        return state.map((i) =>
          i._id === item._id ? { ...i, qty: i.qty + action.payload.qty } : i
        );
      }
      return [...state, { ...action.payload, qty: action.payload.qty }];
    }
    case "remove":
      return state.filter((i) => i._id !== action.payload);
    case "change":
      return state
        .map((i) =>
          i._id === action.payload.id
            ? { ...i, qty: Math.max(1, action.payload.qty) }
            : i
        )
        .filter((i) => i.qty > 0);
    case "clear":
      return [];
    default:
      return state;
  }
}

function useCart() {
  const [cart, dispatch] = useReducer(cartReducer, []);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("simple_cart_v1");
      if (raw) dispatch({ type: "hydrate", payload: JSON.parse(raw) });
    } catch (e) {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("simple_cart_v1", JSON.stringify(cart));
    } catch (e) {}
  }, [cart]);

  const totals = cart.reduce(
    (acc, it) => {
      acc.items += it.qty;
      acc.subtotal += it.qty * it.price;
      return acc;
    },
    { items: 0, subtotal: 0 }
  );

  return { cart, dispatch, totals };
}

function ProductCard({ product, onAdd }) {
  const [qty, setQty] = useState(1);

  const handleAdd = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product._id, qty }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to add to cart");

      onAdd({ ...product, qty });
      alert("Product added to cart!");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="border rounded-lg p-4 flex flex-col shadow-sm hover:shadow-md transition">
      <div className="h-40 bg-gray-100 rounded-md flex items-center justify-center mb-4 overflow-hidden">
        {product.imgurl ? (
          <img
            src={product.imgurl}
            alt={product.name}
            className="object-cover h-full w-full"
          />
        ) : (
          <svg
            className="w-24 h-24 text-gray-300"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M3 7h18M5 7v10a2 2 0 002 2h10a2 2 0 002-2V7M8 10h.01M12 10h.01M16 10h.01"
            />
          </svg>
        )}
      </div>
      <h3 className="font-semibold text-lg">{product.name}</h3>
      <p className="text-sm text-gray-500 flex-1 mt-2">{product.description}</p>
      <div className="mt-4 flex items-center justify-between">
  <div className="text-xl font-bold">{currency(product.price)}</div>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <input
          type="number"
          min={1}
          value={qty}
          onChange={(e) => setQty(Number(e.target.value))}
          className="w-20 border rounded-md p-1 text-center"
        />
        <button
          onClick={handleAdd}
          className="px-3 py-1 rounded-md bg-indigo-600 text-white text-sm hover:bg-indigo-700"
        >
          Add
        </button>
      </div>
    </div>
  );
}

function CartDrawer({ open, onClose, cart, dispatch, totals }) {
  const navigate = useNavigate(); // navigation hook

  if (!open) return null;

  const handleClear = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/emptycart", {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to clear cart on server");
      dispatch({ type: "clear" });
    } catch (err) {
      alert(err.message);
    }
  };

  const handleCheckout = () => {
    navigate("/checkoutpage"); // navigate on click
  };

  return (
    <div className="fixed inset-0 z-40 flex">
      <div
        className="absolute inset-0 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      <aside className="ml-auto w-full max-w-md bg-white h-full p-6 overflow-auto shadow-xl z-50 relative">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Your Cart ({totals.items})</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            Close
          </button>
        </div>

        {cart.length === 0 ? (
          <div className="text-gray-500 mt-8">
            Your cart is empty — add something nice ✨
          </div>
        ) : (
          <div className="space-y-4">
            {cart.map((it) => (
              <div
                key={it._id}
                className="flex items-center gap-3 border rounded-md p-3"
              >
                <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center overflow-hidden">
                  {it.imgurl ? (
                    <img
                      src={it.imgurl}
                      alt={it.name}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <svg
                      className="w-8 h-8 text-gray-300"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M3 3h18v4H3zM3 7v11a2 2 0 002 2h14a2 2 0 002-2V7"
                      />
                    </svg>
                  )}
                </div>
                <div className="flex-1">
                  <div className="font-medium">{it.name}</div>
                  <div className="text-sm text-gray-500">
                    {currency(it.price)} × {it.qty} = {currency(it.price * it.qty)}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    disabled
                    type="number"
                    min={1}
                    value={it.qty}
                    onChange={(e) =>
                      dispatch({
                        type: "change",
                        payload: { id: it._id, qty: Number(e.target.value) },
                      })
                    }
                    className="w-16 p-1 border rounded"
                  />
                  <button
                    onClick={async () => {
                      try {
                        await fetch(`http://localhost:3000/api/cart/${it._id}`, {
                          method: "DELETE",
                        });
                        dispatch({ type: "remove", payload: it._id });
                      } catch (err) {
                        alert("Failed to remove item from server");
                      }
                    }}
                    className="text-red-500 text-sm"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}

            <div className="pt-3 border-t flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-500">Subtotal</div>
                <div className="font-bold text-lg">{currency(totals.subtotal)}</div>
              </div>
              <div className="space-x-2">
                <button onClick={handleClear} className="px-3 py-2 border rounded">
                  Clear
                </button>
                <button
                  onClick={handleCheckout}
                  className="px-3 py-2 bg-green-600 text-white rounded"
                >
                  Checkout
                </button>
              </div>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}

export default function App() {
  const { cart, dispatch, totals } = useCart();
  const [products, setProducts] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate(); // <-- add navigate

  const handleCheckout = () => {
    navigate("/checkoutpage"); // unified checkout handler
  };

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("http://localhost:3000/api/cart");
        const data = await res.json();
        let itemsArr = [];
        if (data && data.data) {
          if (Array.isArray(data.data.items)) itemsArr = data.data.items;
          else if (Array.isArray(data.data)) itemsArr = data.data;
        }
        if (itemsArr.length > 0) {
          const backendCart = itemsArr.map((item) => {
            const prod = item.product || {};
            return {
              _id: item._id,
              productId: prod._id || "",
              name: prod.name || "Unnamed",
              price: prod.price || 0,
              imgurl: prod.imgurl || "",
              qty: item.quantity || 1,
              description: prod.description || "",
            };
          });
          dispatch({ type: "hydrate", payload: backendCart });
        }
      } catch (e) {
        console.error("Failed to fetch cart:", e);
      }
    })();
  }, [dispatch]);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("http://localhost:3000/api/products");
        const data = await res.json();
        if (data) setProducts(data.data);
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.description.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-6">
      <header className="max-w-6xl mx-auto flex items-center justify-between pb-6">
        <div className="flex items-center gap-4">
          <div className="text-2xl font-bold">VibeShop</div>
          <div className="text-sm text-gray-500">Simple cart demo</div>
        </div>
        <div className="flex items-center gap-3">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products..."
            className="px-3 py-2 border rounded-md w-64"
          />
          <button
            onClick={() => setShowCart(true)}
            className="relative inline-flex items-center gap-2 px-3 py-2 bg-indigo-600 text-white rounded-md"
          >
            <svg
              className="w-5 h-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.2 6.4A1 1 0 007 21h10a1 1 0 001-0.8L19 13M7 13l-2-6"
              />
            </svg>
            Cart
            <span className="ml-1 bg-white text-indigo-700 rounded-full px-2 py-0.5 text-xs font-semibold">
              {totals.items}
            </span>
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        <section className="md:col-span-2">
          <h2 className="text-xl font-semibold mb-4">Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {filtered.map((p) => (
              <ProductCard
                key={p._id}
                product={p}
                onAdd={(prod) => dispatch({ type: "add", payload: prod })}
              />
            ))}
          </div>
        </section>

        <aside className="hidden md:block">
          <div className="sticky top-8 border rounded-lg p-4 bg-white shadow-sm">
            <h3 className="font-semibold">Summary</h3>
            <div className="mt-4">
              <div className="flex items-center justify-between text-sm text-gray-600">
                <div>Items</div>
                <div>{totals.items}</div>
              </div>
              <div className="flex items-center justify-between mt-2 text-lg font-bold">
                <div>Subtotal</div>
                <div>{currency(totals.subtotal)}</div>
              </div>
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => setShowCart(true)}
                  className="flex-1 px-3 py-2 bg-indigo-600 text-white rounded"
                >
                  Open Cart
                </button>
                <button
                  onClick={handleCheckout} // <-- navigate to checkout page
                  className="px-3 py-2 border rounded"
                >
                  Checkout
                </button>
              </div>
            </div>
          </div>
        </aside>
      </main>

      <footer className="max-w-6xl mx-auto mt-12 text-center text-sm text-gray-500">
        Built with ♥ using React + Tailwind
      </footer>

      <CartDrawer
        open={showCart}
        onClose={() => setShowCart(false)}
        cart={cart}
        dispatch={dispatch}
        totals={totals}
      />
    </div>
  );
}
