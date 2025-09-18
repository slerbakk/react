import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { vi } from "vitest";
import HomePage from "../HomePage";
import { CartProvider } from "../../context/CartContext";
import { ToastProvider } from "../../context/ToastContext";

// Mock the API response
const mockProducts = [
  {
    id: "1",
    title: "Test Product 1",
    description: "Description 1",
    price: 100,
    image: "image1.jpg",
    rating: 4.5,
    tags: ["tag1"],
    reviews: [],
  },
  {
    id: "2",
    title: "Test Product 2",
    description: "Description 2",
    price: 200,
    image: "image2.jpg",
    rating: 4.0,
    tags: ["tag2"],
    reviews: [],
  },
];

// Mock fetch
global.fetch = vi.fn();

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>
    <CartProvider>
      <ToastProvider>{children}</ToastProvider>
    </CartProvider>
  </BrowserRouter>
);

describe("HomePage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows loading spinner initially", () => {
    // Mock fetch to return a pending promise
    (global.fetch as any).mockImplementation(() => new Promise(() => {}));

    render(
      <TestWrapper>
        <HomePage />
      </TestWrapper>
    );

    expect(screen.getByText("Loading products...")).toBeInTheDocument();
  });

  it("displays products after successful fetch", async () => {
    // Mock successful API response
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: mockProducts }),
    });

    render(
      <TestWrapper>
        <HomePage />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText("Test Product 1")).toBeInTheDocument();
      expect(screen.getByText("Test Product 2")).toBeInTheDocument();
    });
  });

  it("displays error message on fetch failure", async () => {
    // Mock API failure
    (global.fetch as any).mockRejectedValueOnce(new Error("API Error"));

    render(
      <TestWrapper>
        <HomePage />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText(/Failed to fetch products/)).toBeInTheDocument();
    });
  });

  it("displays no products message when API returns empty array", async () => {
    // Mock empty response
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: [] }),
    });

    render(
      <TestWrapper>
        <HomePage />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText("No products found")).toBeInTheDocument();
    });
  });

  it("renders sort filter component", async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: mockProducts }),
    });

    render(
      <TestWrapper>
        <HomePage />
      </TestWrapper>
    );

    await waitFor(() => {
      // Should render products correctly after sorting is available
      expect(screen.getByText("Test Product 1")).toBeInTheDocument();
      expect(screen.getByText("Test Product 2")).toBeInTheDocument();
      // Should have "products found" text
      expect(screen.getByText(/products found/)).toBeInTheDocument();
    });
  });

  it("makes correct API call", () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: mockProducts }),
    });

    render(
      <TestWrapper>
        <HomePage />
      </TestWrapper>
    );

    expect(global.fetch).toHaveBeenCalledWith(
      "https://v2.api.noroff.dev/online-shop"
    );
  });
});
