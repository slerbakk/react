import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import { CartItem } from "../types";

/**
 * Shopping cart page displaying cart items, quantities, and checkout.
 * Allows updating quantities, removing items, and proceeding to checkout.
 */

function CartPage() {
  const navigate = useNavigate();
  const { items, removeFromCart, updateQuantity, clearCart, getTotalPrice } =
    useCart();
  const { showSuccess, showInfo } = useToast();

  /**
   * Updates item quantity or removes item if quantity becomes 0.
   * @param {string} productId - ID of the product to update
   * @param {number} newQuantity - New quantity value
   */

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity < 1) {
      const item = items.find((item) => item.id === productId);
      removeFromCart(productId);
      showInfo(`${item.title} removed from cart`);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  // Handle remove item
  const handleRemoveItem = (productId) => {
    const item = items.find((item) => item.id === productId);
    removeFromCart(productId);
    showInfo(`${item.title} removed from cart`);
  };

  // Handle clear cart
  const handleClearCart = () => {
    clearCart();
    showSuccess("Cart cleared successfully!");
  };

  // Handle checkout
  const handleCheckout = () => {
    // In a real app, you would process payment here
    // For now, we'll just navigate to success page
    navigate("/checkout/success");
  };

  // If cart is empty
  if (items.length === 0) {
    return (
      <main className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <div className="py-12">
            <div className="mb-4 text-6xl">🛒</div>
            <h1 className="mb-4 text-3xl font-bold text-gray-900">
              Your cart is empty
            </h1>
            <p className="mb-8 text-lg text-gray-600">
              Looks like you haven't added any items to your cart yet.
            </p>
            <Link
              to="/"
              className="inline-block px-6 py-3 text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="mb-8 text-3xl font-bold text-gray-900">Shopping Cart</h1>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex p-4 bg-white border rounded-lg shadow-sm"
                >
                  {/* Product Image */}
                  <div className="flex-shrink-0">
                    <img
                      src={item.image?.url || item.image}
                      alt={item.title}
                      className="object-cover w-20 h-20 rounded-md"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 ml-4">
                    <div className="flex justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">
                          <Link
                            to={`/product/${item.id}`}
                            className="hover:text-blue-600"
                          >
                            {item.title}
                          </Link>
                        </h3>

                        {/* Price */}
                        <div className="mt-1">
                          {item.discountedPrice &&
                          item.discountedPrice < item.price ? (
                            <div className="flex items-center space-x-2">
                              <span className="text-lg font-bold text-green-600">
                                ${item.discountedPrice}
                              </span>
                              <span className="text-sm text-gray-500 line-through">
                                ${item.price}
                              </span>
                            </div>
                          ) : (
                            <span className="text-lg font-bold text-gray-900">
                              ${item.price}
                            </span>
                          )}
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center mt-3 space-x-3">
                          <label className="text-sm font-medium text-gray-700">
                            Quantity:
                          </label>
                          <div className="flex items-center border rounded-md">
                            <button
                              onClick={() =>
                                handleQuantityChange(item.id, item.quantity - 1)
                              }
                              className="px-3 py-1 text-gray-600 hover:text-gray-800 hover:bg-gray-100"
                            >
                              -
                            </button>
                            <span className="px-3 py-1 text-center border-l border-r min-w-[50px]">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                handleQuantityChange(item.id, item.quantity + 1)
                              }
                              className="px-3 py-1 text-gray-600 hover:text-gray-800 hover:bg-gray-100"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Remove Button */}
                      <div className="flex flex-col items-end justify-between">
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          ✕
                        </button>

                        {/* Item Total */}
                        <div className="text-lg font-bold text-gray-900">
                          $
                          {(
                            (item.discountedPrice || item.price) * item.quantity
                          ).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Clear Cart Button */}
            <div className="mt-6">
              <button
                onClick={handleClearCart}
                className="px-4 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50"
              >
                Clear Cart
              </button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="p-6 bg-white border rounded-lg shadow-sm">
              <h2 className="mb-4 text-lg font-semibold text-gray-900">
                Order Summary
              </h2>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    Subtotal (
                    {items.reduce((total, item) => total + item.quantity, 0)}{" "}
                    items)
                  </span>
                  <span className="font-medium">
                    ${getTotalPrice().toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium text-green-600">Free</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-medium">$0.00</span>
                </div>

                <div className="pt-3 border-t">
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold text-gray-900">
                      Total
                    </span>
                    <span className="text-lg font-bold text-gray-900">
                      ${getTotalPrice().toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleCheckout}
                className="w-full px-6 py-3 mt-6 text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                Proceed to Checkout
              </button>

              {/* Continue Shopping */}
              <Link
                to="/"
                className="block w-full px-6 py-3 mt-3 text-center text-blue-600 transition-colors border border-blue-600 rounded-lg hover:bg-blue-50"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default CartPage;
