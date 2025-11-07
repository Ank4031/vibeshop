import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function currency(n) {
  return n.toLocaleString(undefined, { style: "currency", currency: "INR" });
}

export default function CheckoutPage() {
  const [checkoutData, setCheckoutData] = useState({ items: [], cartTotal: 0 });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("http://localhost:3000/api/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" }
        });
        const data = await res.json();
        if (res.ok && data && data.data) {
          console.log("hello checkout");
          setCheckoutData(data.data);
        } else {
          console.error("Failed to fetch checkout data");
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handlePlaceOrder = () => {
  alert(`Order placed! Total: ${currency(checkoutData.cartTotal)}`);
    navigate("/"); // navigate back to home
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Loading checkout...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6">Checkout</h1>

        {checkoutData.items.length === 0 ? (
          <div className="text-gray-500 text-center py-10">
            Your cart is empty.
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {checkoutData.items.map((item) => (
                <div
                  key={item.itemId}
                  className="flex items-center justify-between border rounded-lg p-4 bg-gray-50"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center overflow-hidden">
                      {item.product && item.product.imgurl ? (
                        <img
                          src={item.product.imgurl}
                          alt={item.product.name}
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
                    <div>
                      <div className="font-medium">{item.product?.name || "Unnamed Product"}</div>
                      <div className="text-gray-500 text-sm">
                        {currency(item.product?.price || 0)} × {item.quantity} = {currency(item.itemTotal)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 border-t pt-4 flex flex-col gap-4">
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>{currency(checkoutData.cartTotal)}</span>
              </div>
              <button
                onClick={handlePlaceOrder}
                className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                Place Order
              </button>
              <button
                onClick={() => navigate(-1)}
                className="w-full px-4 py-2 border rounded-lg hover:bg-gray-100 transition"
              >
                Back to Cart
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
