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
    reduceStock: (state, action: PayloadAction<{ id: string; quantity: number }>) => {
      const product = state.products.find(p => p.id === action.payload.id);
      if (product) {
        product.stock -= action.payload.quantity;
      }
    },
    // --- INICIO DE NUEVO CÓDIGO ---
    adjustStock: (state, action: PayloadAction<{ id: string; newStock: number }>) => {
      // Esta acción establece un valor de stock específico
      const { id, newStock } = action.payload;
      const product = state.products.find(p => p.id === id);
      if (product) {
        product.stock = newStock;
      }
    },
    // --- FIN DE NUEVO CÓDIGO ---
  },
});

// 3. Exportar las nuevas acciones
export const { addProduct, updateProduct, deleteProduct, reduceStock, adjustStock } = productsSlice.actions;

export default productsSlice.reducer;
