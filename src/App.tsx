import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { ToastProvider } from "./context/ToastContext";
import Header from "./components/Header";
import HomePage from "./pages/HomePage";
import ProductDetail from "./pages/ProductDetail";
import CartPage from "./pages/CartPage";
import CheckoutSuccess from "./pages/CheckoutSuccess";
import ContactPage from "./pages/ContactPage";
import ToastContainer from "./components/ToastContainer";
import { Product, ProductsApiResponse } from "./types";
import Footer from "./components/Footer";

/**
 * Root application component with routing and context providers.
 * Wraps the app with CartProvider, ToastProvider, and Router.
 */

function App() {
  const [products, setProducts] = useState<Product[]>([]);

  // Fetch products for search functionality
  useEffect(() => {
    const fetchProducts = async (): Promise<void> => {
      try {
        const response = await fetch("https://v2.api.noroff.dev/online-shop");
        if (response.ok) {
          const result: ProductsApiResponse = await response.json();
          setProducts(result.data);
        }
      } catch (err) {
        console.error("Error fetching products for search:", err);
      }
    };

    fetchProducts();
  }, []);

  return (
    <ToastProvider>
      <CartProvider>
        <Router>
          <div className="flex flex-col min-h-screen bg-gray-50">
            <Header products={products} />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout/success" element={<CheckoutSuccess />} />
              <Route path="/contact" element={<ContactPage />} />
            </Routes>
            <Footer />
            <ToastContainer />
          </div>
        </Router>
      </CartProvider>
    </ToastProvider>
  );
}

export default App;
