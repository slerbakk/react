import { useState, useEffect } from "react";
import ProductCard from "../components/ProductCard";
import SortFilter from "../components/SortFilter";
import { Product } from "../types";

/**
 * Home page displaying all products with sorting and filtering options.
 * Fetches products from API and handles loading/error states.
 */

function HomePage() {
  // State to store our products from the API
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState<string>("default");
  const [filteredAndSortedProducts, setFilteredAndSortedProducts] = useState<
    Product[]
  >([]);

  // Fetch products from the API when component mounts
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch("https://v2.api.noroff.dev/online-shop");

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        setProducts(result.data); // The API returns data in a 'data' property
        setError(null);
      } catch (err) {
        setError("Failed to fetch products. Please try again later.");
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []); // Empty dependency array means this runs once when component mounts

  // Sort and filter products whenever products or sortOption changes
  useEffect(() => {
    let sortedProducts = [...products];

    switch (sortOption) {
      case "price-low-high":
        sortedProducts.sort(
          (a, b) =>
            (a.discountedPrice || a.price) - (b.discountedPrice || b.price)
        );
        break;
      case "price-high-low":
        sortedProducts.sort(
          (a, b) =>
            (b.discountedPrice || b.price) - (a.discountedPrice || a.price)
        );
        break;
      case "name-a-z":
        sortedProducts.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "name-z-a":
        sortedProducts.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case "rating-high-low":
        sortedProducts.sort((a, b) => b.rating - a.rating);
        break;
      default:
        // Keep original order
        break;
    }

    setFilteredAndSortedProducts(sortedProducts);
  }, [products, sortOption]);

  /**
   * Updates the sort option for products.
   * @param {string} newSortOption - Sort option (e.g., "price-low-high", "name-a-z")
   */

  const handleSortChange = (newSortOption: string) => {
    setSortOption(newSortOption);
  };

  return (
    <main className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
      {/* Hero Section */}
      <div className="mb-12 text-center">
        <h2 className="mb-4 text-4xl font-bold text-gray-900">
          Welcome to React Shop
        </h2>
        <p className="text-xl text-gray-600">
          Discover amazing products at great prices
        </p>
      </div>

      {/* Products Section */}
      {loading ? (
        <div className="flex items-center justify-center min-h-64">
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-4 border-b-2 border-blue-600 rounded-full animate-spin"></div>
            <p className="text-gray-600">Loading products...</p>
          </div>
        </div>
      ) : error ? (
        <div className="py-12 text-center">
          <div className="mb-4 text-lg text-red-500">⚠️ {error}</div>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      ) : (
        <>
          {/* Filter and Sort Controls */}
          <div className="flex items-center justify-between mb-6">
            <div className="text-gray-600">
              {filteredAndSortedProducts.length} product
              {filteredAndSortedProducts.length !== 1 ? "s" : ""} found
            </div>
            <SortFilter
              onSortChange={handleSortChange}
              currentSort={sortOption}
            />
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredAndSortedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* No Products Message */}
          {filteredAndSortedProducts.length === 0 && !loading && !error && (
            <div className="py-12 text-center">
              <div className="mb-4 text-4xl">🔍</div>
              <h3 className="mb-2 text-lg font-medium text-gray-900">
                No products found
              </h3>
              <p className="text-gray-600">
                Try adjusting your search or filters
              </p>
            </div>
          )}
        </>
      )}
    </main>
  );
}

export default HomePage;
