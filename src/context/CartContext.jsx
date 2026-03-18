// src/context/CartContext.jsx
// =============================================
// Update: Tambah action UPDATE_QUANTITY untuk tombol + dan - (Tugas 3)
// =============================================
import { createContext, useContext, useReducer } from 'react';

const initialState = {
  items: [],
  totalItems: 0,
  totalPrice: 0,
};

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingIndex = state.items.findIndex(
        (item) => item.id === action.payload.id
      );
      let newItems;
      if (existingIndex >= 0) {
        newItems = state.items.map((item, index) =>
          index === existingIndex
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        newItems = [...state.items, { ...action.payload, quantity: 1 }];
      }
      return {
        items: newItems,
        totalItems: newItems.reduce((sum, item) => sum + item.quantity, 0),
        totalPrice: newItems.reduce(
          (sum, item) => sum + item.price * item.quantity, 0
        ),
      };
    }

    case 'REMOVE_ITEM': {
      const newItems = state.items.filter(
        (item) => item.id !== action.payload
      );
      return {
        items: newItems,
        totalItems: newItems.reduce((sum, item) => sum + item.quantity, 0),
        totalPrice: newItems.reduce(
          (sum, item) => sum + item.price * item.quantity, 0
        ),
      };
    }

    // ===== Tugas 3: UPDATE_QUANTITY =====
    // payload: { id, delta } — delta = +1 atau -1
    case 'UPDATE_QUANTITY': {
      const { id, delta } = action.payload;
      let newItems = state.items
        .map((item) =>
          item.id === id
            ? { ...item, quantity: item.quantity + delta }
            : item
        )
        // Hapus item jika quantity jadi 0 atau kurang
        .filter((item) => item.quantity > 0);

      return {
        items: newItems,
        totalItems: newItems.reduce((sum, item) => sum + item.quantity, 0),
        totalPrice: newItems.reduce(
          (sum, item) => sum + item.price * item.quantity, 0
        ),
      };
    }

    case 'CLEAR_CART':
      return initialState;

    default:
      return state;
  }
}

const CartContext = createContext();

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const addItem = (product) => {
    dispatch({ type: 'ADD_ITEM', payload: product });
  };

  const removeItem = (productId) => {
    dispatch({ type: 'REMOVE_ITEM', payload: productId });
  };

  // ===== Tugas 3: fungsi updateQuantity =====
  const updateQuantity = (productId, delta) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id: productId, delta } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  return (
    <CartContext.Provider
      value={{ ...state, addItem, removeItem, updateQuantity, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
