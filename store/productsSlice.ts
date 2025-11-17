// store/productsSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { mockProducts } from '../data/mockData';
import { Product } from '../types';

interface ProductsState {
  products: Product[];
}

const initialState: ProductsState = {
  products: mockProducts,
};

export const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    addProduct: (state, action: PayloadAction<Product>) => {
      state.products.push(action.payload);
    },
    updateProduct: (state, action: PayloadAction<Product>) => {
      const index = state.products.findIndex(p => p.id === action.payload.id);
      if (index !== -1) {
        state.products[index] = action.payload;
      }
    },
    deleteProduct: (state, action: PayloadAction<string>) => {
      state.products = state.products.filter(p => p.id !== action.payload);
    },
    // Esta acción es para VENTAS (resta stock)
    reduceStock: (state, action: PayloadAction<{ id: string; quantity: number }>) => {
      const product = state.products.find(p => p.id === action.payload.id);
      if (product) {
        product.stock -= action.payload.quantity;
      }
    },
    // Esta acción es para AJUSTES (establece un stock exacto)
    adjustStock: (state, action: PayloadAction<{ id: string; newStock: number }>) => {
      const { id, newStock } = action.payload;
      const product = state.products.find(p => p.id === id);
      if (product) {
        product.stock = newStock;
      }
    },
    // --- INICIO DE NUEVO CÓDIGO ---
    // Esta acción es para COMPRAS (suma stock)
    increaseStock: (state, action: PayloadAction<{ productId: string; quantity: number }>) => {
      const { productId, quantity } = action.payload;
      const product = state.products.find(p => p.id === productId);
      if (product) {
        product.stock += quantity;
      }
    },
    // --- FIN DE NUEVO CÓDIGO ---
  },
});

// 3. Exportar las nuevas acciones
export const { addProduct, updateProduct, deleteProduct, reduceStock, adjustStock, increaseStock } = productsSlice.actions;

export default productsSlice.reducer;
