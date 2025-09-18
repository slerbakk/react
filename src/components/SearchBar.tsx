import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { SearchBarProps, Product } from "../types";

function SearchBar({ products }: SearchBarProps): JSX.Element {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
  const searchRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Filter products based on search term
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setSearchResults([]);
      setIsDropdownOpen(false);
      return;
    }

    const filteredProducts = products
      .filter(
        (product) =>
          product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          product.tags?.some((tag) =>
            tag.toLowerCase().includes(searchTerm.toLowerCase())
          )
      )
      .slice(0, 5); // Limit to 5 results for dropdown

    setSearchResults(filteredProducts);
    setIsDropdownOpen(filteredProducts.length > 0);
    setHighlightedIndex(-1);
  }, [searchTerm, products]);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isDropdownOpen) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < searchResults.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case "Enter":
        e.preventDefault();
        if (highlightedIndex >= 0) {
          // Navigate to highlighted product
          const selectedProduct = searchResults[highlightedIndex];
          window.location.href = `/product/${selectedProduct.id}`;
        }
        break;
      case "Escape":
        setIsDropdownOpen(false);
        setHighlightedIndex(-1);
        break;
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Handle product click
  const handleProductClick = () => {
    setSearchTerm("");
    setIsDropdownOpen(false);
  };

  // Clear search
  const clearSearch = () => {
    setSearchTerm("");
    setSearchResults([]);
    setIsDropdownOpen(false);
  };

  return (
    <div className="relative flex-1 max-w-lg mx-4">
      {/* Search Input */}
      <div className="relative" ref={searchRef}>
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={handleSearchChange}
          onKeyDown={handleKeyDown}
          onFocus={() =>
            searchTerm && setIsDropdownOpen(searchResults.length > 0)
          }
          className="w-full px-4 py-2 pl-10 pr-10 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />

        {/* Search Icon */}
        <div className="absolute inset-y-0 left-0 flex items-center pl-3">
          <svg
            className="w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        {/* Clear Button */}
        {searchTerm && (
          <button
            onClick={clearSearch}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {isDropdownOpen && (
        <div
          ref={dropdownRef}
          className="absolute left-0 right-0 z-50 mt-1 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-lg top-full max-h-96"
        >
          {searchResults.length > 0 ? (
            <>
              <div className="px-4 py-2 text-sm text-gray-500 border-b">
                {searchResults.length} result
                {searchResults.length !== 1 ? "s" : ""} found
              </div>
              {searchResults.map((product, index) => (
                <Link
                  key={product.id}
                  to={`/product/${product.id}`}
                  onClick={handleProductClick}
                  className={`block px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors ${
                    index === highlightedIndex ? "bg-blue-50" : ""
                  }`}
                >
                  <div className="flex items-center">
                    <img
                      src={
                        typeof product.image === "string"
                          ? product.image
                          : product.image?.url
                      }
                      alt={product.title}
                      className="object-cover w-12 h-12 mr-3 rounded-md"
                    />
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900 line-clamp-1">
                        {product.title}
                      </h4>
                      <div className="flex items-center justify-between mt-1">
                        <div className="flex items-center space-x-2">
                          {product.discountedPrice &&
                          product.discountedPrice < product.price ? (
                            <>
                              <span className="text-sm font-semibold text-green-600">
                                ${product.discountedPrice}
                              </span>
                              <span className="text-xs text-gray-500 line-through">
                                ${product.price}
                              </span>
                            </>
                          ) : (
                            <span className="text-sm font-semibold text-gray-900">
                              ${product.price}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center">
                          <span className="text-xs text-yellow-400">★</span>
                          <span className="ml-1 text-xs text-gray-600">
                            {product.rating}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </>
          ) : (
            <div className="px-4 py-6 text-center text-gray-500">
              <div className="mb-2 text-2xl">🔍</div>
              <p>No products found for "{searchTerm}"</p>
              <p className="mt-1 text-sm">Try different keywords</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default SearchBar;
