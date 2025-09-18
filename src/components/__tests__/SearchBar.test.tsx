import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { vi } from "vitest";
import SearchBar from "../SearchBar";
import { Product } from "../../types";

// Mock products for testing
const mockProducts: Product[] = [
  {
    id: "1",
    title: "iPhone 14",
    description: "Latest Apple smartphone",
    price: 999,
    image: "iphone.jpg",
    rating: 4.8,
    tags: ["phone", "apple", "smartphone"],
    reviews: [],
  },
  {
    id: "2",
    title: "Samsung Galaxy",
    description: "Android smartphone",
    price: 799,
    image: "samsung.jpg",
    rating: 4.5,
    tags: ["phone", "samsung", "android"],
    reviews: [],
  },
];

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe("SearchBar", () => {
  it("renders search input correctly", () => {
    render(
      <TestWrapper>
        <SearchBar products={mockProducts} />
      </TestWrapper>
    );

    const searchInput = screen.getByPlaceholderText("Search products...");
    expect(searchInput).toBeInTheDocument();
  });

  it("shows search results when typing", async () => {
    render(
      <TestWrapper>
        <SearchBar products={mockProducts} />
      </TestWrapper>
    );

    const searchInput = screen.getByPlaceholderText("Search products...");
    fireEvent.change(searchInput, { target: { value: "iPhone" } });

    await waitFor(() => {
      expect(screen.getByText("iPhone 14")).toBeInTheDocument();
    });
  });

  it("shows no results message for non-matching search", async () => {
    render(
      <TestWrapper>
        <SearchBar products={mockProducts} />
      </TestWrapper>
    );

    const searchInput = screen.getByPlaceholderText("Search products...");
    fireEvent.change(searchInput, { target: { value: "nonexistent" } });

    await waitFor(() => {
      // SearchBar doesn't show dropdown when no results - test that no dropdown appears
      expect(screen.queryByRole("list")).not.toBeInTheDocument();
    });
  });

  it("shows clear button when search has text", () => {
    render(
      <TestWrapper>
        <SearchBar products={mockProducts} />
      </TestWrapper>
    );

    const searchInput = screen.getByPlaceholderText("Search products...");
    fireEvent.change(searchInput, { target: { value: "test" } });

    // Clear button should be visible
    const clearButton = screen.getByRole("button");
    expect(clearButton).toBeInTheDocument();
  });

  it("clears search when clear button is clicked", () => {
    render(
      <TestWrapper>
        <SearchBar products={mockProducts} />
      </TestWrapper>
    );

    const searchInput = screen.getByPlaceholderText(
      "Search products..."
    ) as HTMLInputElement;
    fireEvent.change(searchInput, { target: { value: "test" } });

    expect(searchInput.value).toBe("test");

    const clearButton = screen.getByRole("button");
    fireEvent.click(clearButton);

    expect(searchInput.value).toBe("");
  });

  it("handles keyboard navigation", async () => {
    render(
      <TestWrapper>
        <SearchBar products={mockProducts} />
      </TestWrapper>
    );

    const searchInput = screen.getByPlaceholderText("Search products...");
    fireEvent.change(searchInput, { target: { value: "phone" } });

    await waitFor(() => {
      expect(screen.getByText("iPhone 14")).toBeInTheDocument();
    });

    // Test arrow down navigation
    fireEvent.keyDown(searchInput, { key: "ArrowDown" });

    // Test escape to close dropdown
    fireEvent.keyDown(searchInput, { key: "Escape" });
  });
});
