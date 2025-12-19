import { Link } from "react-router-dom";

/**
 * Simple footer with copyright and basic links.
 * Displayed at the bottom of all pages.
 */
function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto bg-white border-t shadow-sm">
      <div className="px-4 py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          {/* Copyright */}
          <div className="text-sm text-center md:text-left">
            <p className="text-gray-900">
              © {currentYear} <span className="font-semibold">React Shop</span>.
              All rights reserved.
            </p>
          </div>

          {/* Quick Links */}
          <nav className="flex gap-6 text-sm">
            <Link
              to="/"
              className="text-gray-700 transition-colors hover:text-gray-900"
            >
              Home
            </Link>
            <Link
              to="/contact"
              className="text-gray-700 transition-colors hover:text-gray-900"
            >
              Contact
            </Link>
            <Link
              to="/cart"
              className="text-gray-700 transition-colors hover:text-gray-900"
            >
              Cart
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
