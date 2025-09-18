import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import { CartProvider, useCart } from "../CartContext";
import { Product } from "../../types";

// Test component that uses the cart context
function TestComponent() {
  const {
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice,
  } = useCart();

  const mockProduct: Product = {
    id: "1",
    title: "Test Product",
    description: "Test description",
    price: 100,
    image: "test.jpg",
    rating: 4.5,
    tags: [],
    reviews: [],
  };

  return (
    <div>
      <div data-testid="total-items">{getTotalItems()}</div>
      <div data-testid="total-price">${getTotalPrice().toFixed(2)}</div>
      <div data-testid="items-count">{items.length}</div>

      <button onClick={() => addToCart(mockProduct)}>Add to Cart</button>

      <button onClick={() => removeFromCart("1")}>Remove from Cart</button>

      <button onClick={() => updateQuantity("1", 3)}>Update Quantity</button>

      <button onClick={clearCart}>Clear Cart</button>

      {items.map((item) => (
        <div key={item.id} data-testid={`item-${item.id}`}>
          {item.title} - Quantity: {item.quantity}
        </div>
      ))}
    </div>
  );
}

describe("CartContext", () => {
  it("starts with empty cart", () => {
    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );

    expect(screen.getByTestId("total-items")).toHaveTextContent("0");
    expect(screen.getByTestId("total-price")).toHaveTextContent("$0.00");
    expect(screen.getByTestId("items-count")).toHaveTextContent("0");
  });

  it("adds item to cart", () => {
    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );

    fireEvent.click(screen.getByText("Add to Cart"));

    expect(screen.getByTestId("total-items")).toHaveTextContent("1");
    expect(screen.getByTestId("total-price")).toHaveTextContent("$100.00");
    expect(screen.getByTestId("item-1")).toHaveTextContent(
      "Test Product - Quantity: 1"
    );
  });

  it("increases quantity when adding same item", () => {
    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );

    // Add same item twice
    fireEvent.click(screen.getByText("Add to Cart"));
    fireEvent.click(screen.getByText("Add to Cart"));

    expect(screen.getByTestId("total-items")).toHaveTextContent("2");
    expect(screen.getByTestId("total-price")).toHaveTextContent("$200.00");
    expect(screen.getByTestId("item-1")).toHaveTextContent(
      "Test Product - Quantity: 2"
    );
  });

  it("updates item quantity", () => {
    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );

    // Add item first
    fireEvent.click(screen.getByText("Add to Cart"));

    // Update quantity
    fireEvent.click(screen.getByText("Update Quantity"));

    expect(screen.getByTestId("total-items")).toHaveTextContent("3");
    expect(screen.getByTestId("total-price")).toHaveTextContent("$300.00");
    expect(screen.getByTestId("item-1")).toHaveTextContent(
      "Test Product - Quantity: 3"
    );
  });

  it("removes item from cart", () => {
    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );

    // Add item first
    fireEvent.click(screen.getByText("Add to Cart"));
    expect(screen.getByTestId("total-items")).toHaveTextContent("1");

    // Remove item
    fireEvent.click(screen.getByText("Remove from Cart"));
    expect(screen.getByTestId("total-items")).toHaveTextContent("0");
    expect(screen.queryByTestId("item-1")).not.toBeInTheDocument();
  });

  it("clears entire cart", () => {
    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );

    // Add items
    fireEvent.click(screen.getByText("Add to Cart"));
    fireEvent.click(screen.getByText("Add to Cart"));
    expect(screen.getByTestId("total-items")).toHaveTextContent("2");

    // Clear cart
    fireEvent.click(screen.getByText("Clear Cart"));
    expect(screen.getByTestId("total-items")).toHaveTextContent("0");
    expect(screen.getByTestId("total-price")).toHaveTextContent("$0.00");
  });

  it("throws error when used outside provider", () => {
    // Suppress console.error for this test
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    expect(() => {
      render(<TestComponent />);
    }).toThrow("useCart must be used within a CartProvider");

    consoleSpy.mockRestore();
  });
});
