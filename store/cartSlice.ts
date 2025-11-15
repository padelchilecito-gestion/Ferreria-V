import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Product, CartItem } from '../types';

// Define la forma del estado de esta porción
interface CartState {
  items: CartItem[];
}

const initialState: CartState = {
  items: [],
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  // Acciones que modifican el estado del carrito
  reducers: {
    addToCart: (state, action: PayloadAction<Product>) => {
      const product = action.payload;
      const existingItem = state.items.find(item => item.id === product.id);
      
      if (existingItem) {
        // Si ya existe, solo incrementa la cantidad
        existingItem.quantity += 1;
      } else {
        // Si es nuevo, añádelo al carrito con cantidad 1
        state.items.push({ ...product, quantity: 1 });
      }
    },
    updateQuantity: (state, action: PayloadAction<{ id: string; quantity: number }>) => {
      const { id, quantity } = action.payload;
      const itemToUpdate = state.items.find(item => item.id === id);
      
      if (itemToUpdate) {
        itemToUpdate.quantity = quantity;
      }
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      const idToRemove = action.payload;
      state.items = state.items.filter(item => item.id !== idToRemove);
    },
    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const { addToCart, updateQuantity, removeFromCart, clearCart } = cartSlice.actions;

export default cartSlice.reducer;
