import { createContext, useContext, useReducer, ReactNode } from "react";
import { CartItem, CartState, Product } from "../types";

// Cart action types
type CartAction =
  | { type: "ADD_ITEM"; payload: { product: Product } }
  | { type: "REMOVE_ITEM"; payload: { productId: string } }
  | {
      type: "UPDATE_QUANTITY";
      payload: { productId: string; quantity: number };
    }
  | { type: "CLEAR_CART" };

// Cart context type
interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

// Create the Cart Context
const CartContext = createContext<CartContextType | undefined>(undefined);

// Action types for our cart reducer
const CART_ACTIONS = {
  ADD_ITEM: "ADD_ITEM",
  REMOVE_ITEM: "REMOVE_ITEM",
  UPDATE_QUANTITY: "UPDATE_QUANTITY",
  CLEAR_CART: "CLEAR_CART",
} as const;

// Cart reducer function - handles all cart state changes
function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case CART_ACTIONS.ADD_ITEM: {
      const { product } = action.payload;
      const existingItem = state.items.find((item) => item.id === product.id);

      if (existingItem) {
        // If item already exists, increase quantity
        return {
          ...state,
          items: state.items.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      } else {
        // If new item, add it with quantity 1
        return {
          ...state,
          items: [...state.items, { ...product, quantity: 1 }],
        };
      }
    }

    case CART_ACTIONS.REMOVE_ITEM: {
      const { productId } = action.payload;
      return {
        ...state,
        items: state.items.filter((item) => item.id !== productId),
      };
    }

    case CART_ACTIONS.UPDATE_QUANTITY: {
      const { productId, quantity } = action.payload;
      if (quantity <= 0) {
        // If quantity is 0 or less, remove item
        return {
          ...state,
          items: state.items.filter((item) => item.id !== productId),
        };
      }
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === productId ? { ...item, quantity } : item
        ),
      };
    }

    case CART_ACTIONS.CLEAR_CART: {
      return {
        ...state,
        items: [],
      };
    }

    default:
      return state;
  }
}

// Initial cart state
const initialState: CartState = {
  items: [],
};

// Cart Provider Component
interface CartProviderProps {
  children: ReactNode;
}

/**
 * Provides shopping cart state and functions to all child components.
 * Manages cart items, quantities, and total calculations.
 * @param {CartProviderProps} props - Provider props containing children
 */

export function CartProvider({ children }: CartProviderProps) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  /**
   * Adds a product to cart or increments quantity if already exists.
   * @param {Product} product - Product to add to cart
   */
  const addToCart = (product: Product) => {
    dispatch({ type: CART_ACTIONS.ADD_ITEM, payload: { product } });
  };

  /**
   * Removes a product completely from the cart.
   * @param {string} productId - ID of product to remove
   */

  const removeFromCart = (productId: string) => {
    dispatch({ type: CART_ACTIONS.REMOVE_ITEM, payload: { productId } });
  };

  /**
   * Updates the quantity of a cart item.
   * @param {string} productId - ID of product to update
   * @param {number} quantity - New quantity (minimum 1)
   */

  const updateQuantity = (productId: string, quantity: number) => {
    dispatch({
      type: CART_ACTIONS.UPDATE_QUANTITY,
      payload: { productId, quantity },
    });
  };

  const clearCart = () => {
    dispatch({ type: CART_ACTIONS.CLEAR_CART });
  };

  /**
   * Calculates total number of items in cart.
   * @returns {number} Total quantity of all items
   */
  const getTotalItems = (): number => {
    return state.items.reduce((total, item) => total + item.quantity, 0);
  };

  /**
   * Calculates total price of all cart items including discounts.
   * @returns {number} Total price
   */
  const getTotalPrice = (): number => {
    return state.items.reduce((total, item) => {
      const price = item.discountedPrice || item.price;
      return total + price * item.quantity;
    }, 0);
  };

  // Context value
  const value = {
    items: state.items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// Custom hook to use the cart context
export function useCart(): CartContextType {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}

export default CartContext;
