import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import { ProductCardProps } from "../types";

/**
 * Displays a product card with image, title, rating, price, and add to cart button.
 * Clicking the card navigates to the product detail page.
 * @param {ProductCardProps} props - Component props containing product data
 */

function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const { showSuccess } = useToast();

  /**
   * Adds product to cart and prevents navigation when clicking the button.
   * @param {React.MouseEvent<HTMLButtonElement>} e - Click event
   */

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); // Prevent navigation when clicking the button
    addToCart(product);
    showSuccess(`${product.title} added to cart!`);
  };

  return (
    <Link
      to={`/product/${product.id}`}
      className="block overflow-hidden transition-shadow bg-white rounded-lg shadow-md hover:shadow-lg"
    >
      {/* Product Image */}
      <div className="relative">
        <img
          src={
            typeof product.image === "string"
              ? product.image
              : product.image?.url
          }
          alt={
            typeof product.image === "string"
              ? product.title
              : product.image?.alt || product.title
          }
          className="object-cover w-full h-48"
          loading="lazy"
        />
        {/* Discount Badge */}
        {product.discountedPrice && (
          <div className="absolute px-2 py-1 text-sm font-bold text-white bg-red-500 rounded top-2 left-2">
            {Math.round((1 - product.discountedPrice / product.price) * 100)}%
            OFF
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4">
        <h3 className="mb-2 font-semibold text-gray-900 line-clamp-2">
          {product.title}
        </h3>

        {/* Rating */}
        <div className="flex items-center mb-2">
          <div className="flex text-yellow-400">
            {"★".repeat(Math.floor(product.rating))}
            {"☆".repeat(5 - Math.floor(product.rating))}
          </div>
          <span className="ml-1 text-sm text-gray-600">({product.rating})</span>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between">
          <div>
            {product.discountedPrice &&
            product.discountedPrice < product.price ? (
              <div className="flex items-center space-x-2">
                <span className="text-lg font-bold text-green-600">
                  ${product.discountedPrice}
                </span>
                <span className="text-sm text-gray-500 line-through">
                  ${product.price}
                </span>
              </div>
            ) : (
              <span className="text-lg font-bold text-gray-900">
                ${product.price}
              </span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            className="px-3 py-1 text-sm text-white bg-blue-600 rounded hover:bg-blue-700"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </Link>
  );
}

export default ProductCard;
