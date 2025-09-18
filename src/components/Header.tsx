import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import SearchBar from "./SearchBar";
import { HeaderProps } from "../types";

function Header({ products = [] }: HeaderProps): JSX.Element {
  const { getTotalItems } = useCart();

  return (
    <header className="bg-white border-b shadow-sm">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link
              to="/"
              className="text-2xl font-bold text-gray-900 hover:text-gray-700"
            >
              React Shop
            </Link>
          </div>

          {/* Search Bar - Hidden on small screens */}
          <div className="flex-1 hidden max-w-2xl mx-8 md:flex">
            <SearchBar products={products} />
          </div>

          {/* Navigation */}
          <nav className="flex items-center space-x-4 sm:space-x-8">
            <Link
              to="/"
              className="hidden text-gray-700 hover:text-gray-900 sm:block"
            >
              Home
            </Link>
            <Link
              to="/contact"
              className="hidden text-gray-700 hover:text-gray-900 sm:block"
            >
              Contact
            </Link>
            <Link
              to="/cart"
              className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              Cart ({getTotalItems()})
            </Link>
          </nav>
        </div>

        {/* Mobile Search Bar */}
        <div className="pb-4 md:hidden">
          <SearchBar products={products} />
        </div>
      </div>
    </header>
  );
}

export default Header;
