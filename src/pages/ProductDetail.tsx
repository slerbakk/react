import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Product } from "../types";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";

function ProductDetail() {
  const { id } = useParams<{ id: string }>(); // Get product ID from URL
  const { addToCart } = useCart();
  const { showSuccess } = useToast();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const handleAddToCart = () => {
    addToCart(product);
    showSuccess(`${product.title} added to cart!`);
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `https://v2.api.noroff.dev/online-shop/${id}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        setProduct(result.data);
        setError(null);
      } catch (err) {
        setError("Failed to fetch product details. Please try again later.");
        console.error("Error fetching product:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <main className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex items-center justify-center min-h-64">
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-4 border-b-2 border-blue-600 rounded-full animate-spin"></div>
            <p className="text-gray-600">Loading product details...</p>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="py-12 text-center">
          <div className="mb-4 text-lg text-red-500">⚠️ {error}</div>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="py-12 text-center">
          <div className="text-lg text-gray-500">Product not found</div>
        </div>
      </main>
    );
  }

  return (
    <main className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Product Image */}
          <div className="relative">
            <img
              src={product.image.url}
              alt={product.image.alt || product.title}
              className="object-cover w-full rounded-lg h-96"
            />
            {/* Discount Badge */}
            {product.discountedPrice &&
              product.discountedPrice < product.price && (
                <div className="absolute px-3 py-1 text-sm font-bold text-white bg-red-500 rounded-lg top-4 left-4">
                  {Math.round(
                    (1 - product.discountedPrice / product.price) * 100
                  )}
                  % OFF
                </div>
              )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="mb-2 text-3xl font-bold text-gray-900">
                {product.title}
              </h1>

              {/* Rating */}
              <div className="flex items-center mb-4">
                <div className="flex text-lg text-yellow-400">
                  {"★".repeat(Math.floor(product.rating))}
                  {"☆".repeat(5 - Math.floor(product.rating))}
                </div>
                <span className="ml-2 text-gray-600">({product.rating})</span>
              </div>
            </div>

            {/* Price */}
            <div className="py-4 border-t border-b">
              {product.discountedPrice &&
              product.discountedPrice < product.price ? (
                <div className="flex items-center space-x-3">
                  <span className="text-3xl font-bold text-green-600">
                    ${product.discountedPrice}
                  </span>
                  <span className="text-xl text-gray-500 line-through">
                    ${product.price}
                  </span>
                  <span className="px-2 py-1 text-sm text-red-800 bg-red-100 rounded">
                    Save ${(product.price - product.discountedPrice).toFixed(2)}
                  </span>
                </div>
              ) : (
                <span className="text-3xl font-bold text-gray-900">
                  ${product.price}
                </span>
              )}
            </div>

            {/* Description */}
            <div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900">
                Description
              </h3>
              <p className="leading-relaxed text-gray-700">
                {product.description}
              </p>
            </div>

            {/* Tags */}
            {product.tags && product.tags.length > 0 && (
              <div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900">
                  Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 text-sm text-gray-700 bg-gray-100 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Add to Cart Button */}
            <div className="pt-4">
              <button
                onClick={handleAddToCart}
                className="w-full px-6 py-3 text-lg font-semibold text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                Add to Cart
              </button>
            </div>

            {/* Reviews */}
            {product.reviews && product.reviews.length > 0 && (
              <div>
                <h3 className="mb-4 text-lg font-semibold text-gray-900">
                  Customer Reviews
                </h3>
                <div className="space-y-4">
                  {product.reviews.map((review) => (
                    <div
                      key={review.id}
                      className="pl-4 border-l-4 border-blue-500"
                    >
                      <div className="flex items-center mb-2">
                        <div className="flex text-yellow-400">
                          {"★".repeat(review.rating)}
                          {"☆".repeat(5 - review.rating)}
                        </div>
                        <span className="ml-2 font-medium text-gray-900">
                          {review.username}
                        </span>
                      </div>
                      <p className="text-gray-700">{review.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

export default ProductDetail;
