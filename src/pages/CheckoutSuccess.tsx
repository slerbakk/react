import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CartItem } from "../types";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";

function CheckoutSuccess() {
  const navigate = useNavigate();
  const { items, clearCart, getTotalPrice } = useCart();
  const { showSuccess } = useToast();
  const [orderNumber, setOrderNumber] = useState("");
  const [orderItems, setOrderItems] = useState([]);
  const [orderTotal, setOrderTotal] = useState(0);
  const [hasProcessedOrder, setHasProcessedOrder] = useState(false);

  useEffect(() => {
    // Only process if we have items and haven't processed yet
    if (items.length > 0 && !hasProcessedOrder) {
      // Generate a random order number
      const randomOrderNumber = `ORD-${Date.now().toString().slice(-6)}`;
      setOrderNumber(randomOrderNumber);

      // Save order details before clearing cart
      setOrderItems([...items]);
      setOrderTotal(getTotalPrice());

      // Mark as processed
      setHasProcessedOrder(true);

      // Clear the cart and show success message
      clearCart();
      showSuccess("Order placed successfully!");

      // Scroll to top
      window.scrollTo(0, 0);
    }
    // If no items and no processed order, redirect to home (direct URL access)
    else if (
      items.length === 0 &&
      orderItems.length === 0 &&
      !hasProcessedOrder
    ) {
      navigate("/");
    }
  }, [
    items,
    navigate,
    clearCart,
    getTotalPrice,
    showSuccess,
    hasProcessedOrder,
    orderItems.length,
  ]);

  // Show loading while processing order
  if (orderItems.length === 0 && hasProcessedOrder === false) {
    return (
      <main className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex items-center justify-center min-h-64">
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-4 border-b-2 border-blue-600 rounded-full animate-spin"></div>
            <p className="text-gray-600">Processing your order...</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Success Header */}
        <div className="mb-8 text-center">
          <div className="mb-4 text-6xl">✅</div>
          <h1 className="mb-2 text-3xl font-bold text-green-600">
            Order Confirmed!
          </h1>
          <p className="text-lg text-gray-600">
            Thank you for your purchase. Your order has been successfully
            placed.
          </p>
        </div>

        {/* Order Details Card */}
        <div className="p-6 mb-8 bg-white border rounded-lg shadow-sm">
          <div className="pb-4 mb-6 border-b border-gray-200">
            <h2 className="mb-2 text-xl font-semibold text-gray-900">
              Order Details
            </h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Order Number:</span>
                <span className="ml-2 font-medium text-gray-900">
                  {orderNumber}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Order Date:</span>
                <span className="ml-2 font-medium text-gray-900">
                  {new Date().toLocaleDateString()}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Total Items:</span>
                <span className="ml-2 font-medium text-gray-900">
                  {orderItems.reduce((total, item) => total + item.quantity, 0)}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Total Amount:</span>
                <span className="ml-2 font-medium text-green-600">
                  ${orderTotal.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Ordered Items */}
          <div>
            <h3 className="mb-4 text-lg font-semibold text-gray-900">
              Items Ordered
            </h3>
            <div className="space-y-4">
              {orderItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center p-3 rounded-lg bg-gray-50"
                >
                  <img
                    src={item.image?.url || item.image}
                    alt={item.title}
                    className="object-cover w-16 h-16 rounded-md"
                  />
                  <div className="flex-1 ml-4">
                    <h4 className="font-medium text-gray-900">{item.title}</h4>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-sm text-gray-600">
                        Quantity: {item.quantity}
                      </span>
                      <div className="text-sm">
                        {item.discountedPrice &&
                        item.discountedPrice < item.price ? (
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-green-600">
                              ${item.discountedPrice} each
                            </span>
                            <span className="text-gray-500 line-through">
                              ${item.price}
                            </span>
                          </div>
                        ) : (
                          <span className="font-medium text-gray-900">
                            ${item.price} each
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="mt-1 text-sm font-semibold text-gray-900">
                      Subtotal: $
                      {(
                        (item.discountedPrice || item.price) * item.quantity
                      ).toFixed(2)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Delivery Information */}
        <div className="p-6 mb-8 border border-blue-200 rounded-lg bg-blue-50">
          <h3 className="mb-3 text-lg font-semibold text-blue-900">
            📦 What's Next?
          </h3>
          <div className="space-y-2 text-sm text-blue-800">
            <p>• Order confirmation has been sent to your email</p>
            <p>• Your order will be processed within 1-2 business days</p>
            <p>• Free shipping - expected delivery in 3-5 business days</p>
            <p>
              • Track your order with the order number:{" "}
              <strong>{orderNumber}</strong>
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <Link
            to="/"
            className="px-6 py-3 text-center text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            Continue Shopping
          </Link>
          <button
            onClick={() => window.print()}
            className="px-6 py-3 text-blue-600 transition-colors border border-blue-600 rounded-lg hover:bg-blue-50"
          >
            Print Order Summary
          </button>
        </div>

        {/* Customer Service */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            Questions about your order?{" "}
            <Link
              to="/contact"
              className="text-blue-600 underline hover:text-blue-800"
            >
              Contact our customer service
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}

export default CheckoutSuccess;
