import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { vi } from "vitest";
import ProductCard from "../ProductCard";
import { CartProvider } from "../../context/CartContext";
import { ToastProvider } from "../../context/ToastContext";
import { Product } from "../../types";

// Mock product data
const mockProduct: Product = {
  id: "1",
  title: "Test Product",
  description: "A test product description",
  price: 99.99,
  discountedPrice: 79.99,
  image: "https://example.com/image.jpg",
  rating: 4.5,
  tags: ["test", "product"],
  reviews: [],
};

// Wrapper component with all necessary providers
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>
    <CartProvider>
      <ToastProvider>{children}</ToastProvider>
    </CartProvider>
  </BrowserRouter>
);

describe("ProductCard", () => {
  it("renders product information correctly", () => {
    render(
      <TestWrapper>
        <ProductCard product={mockProduct} />
      </TestWrapper>
    );

    // Check if product title is rendered
    expect(screen.getByText("Test Product")).toBeInTheDocument();

    // Check if original price is shown with strikethrough
    expect(screen.getByText("$99.99")).toBeInTheDocument();

    // Check if discounted price is shown
    expect(screen.getByText("$79.99")).toBeInTheDocument();

    // Check if rating is displayed
    expect(screen.getByText("(4.5)")).toBeInTheDocument();

    // Check if discount badge element exists with red background
    const discountBadge = document.querySelector(".bg-red-500");
    expect(discountBadge).toBeInTheDocument();
  });

  it("renders product without discount correctly", () => {
    const productWithoutDiscount = {
      ...mockProduct,
      discountedPrice: undefined,
    };

    render(
      <TestWrapper>
        <ProductCard product={productWithoutDiscount} />
      </TestWrapper>
    );

    // Should show regular price
    expect(screen.getByText("$99.99")).toBeInTheDocument();

    // Should not show discount badge
    expect(screen.queryByText("OFF")).not.toBeInTheDocument();
  });

  it("handles add to cart click", () => {
    render(
      <TestWrapper>
        <ProductCard product={mockProduct} />
      </TestWrapper>
    );

    const addToCartButton = screen.getByText("Add to Cart");
    fireEvent.click(addToCartButton);

    // Should show success toast (we can check if the toast appears)
    // Note: This is a basic test - in a real app you might want to mock the context
  });

  it("navigates to product detail on card click", () => {
    render(
      <TestWrapper>
        <ProductCard product={mockProduct} />
      </TestWrapper>
    );

    const productCard = screen.getByRole("link");
    expect(productCard).toHaveAttribute("href", "/product/1");
  });

  it("renders product image with correct attributes", () => {
    render(
      <TestWrapper>
        <ProductCard product={mockProduct} />
      </TestWrapper>
    );

    const image = screen.getByAltText("Test Product");
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("src", "https://example.com/image.jpg");
  });
});
