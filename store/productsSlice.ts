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
    // 1. Añadir acción de actualizar
    updateProduct: (state, action: PayloadAction<Product>) => {
      const index = state.products.findIndex(p => p.id === action.payload.id);
      if (index !== -1) {
        state.products[index] = action.payload;
      }
    },
    // 2. Añadir acción de eliminar
    deleteProduct: (state, action: PayloadAction<string>) => {
      state.products = state.products.filter(p => p.id !== action.payload);
    },
    reduceStock: (state, action: PayloadAction<{ id: string; quantity: number }>) => {
      const product = state.products.find(p => p.id === action.payload.id);
      if (product) {
        product.stock -= action.payload.quantity;
      }
    },
  },
});

// 3. Exportar las nuevas acciones
export const { addProduct, updateProduct, deleteProduct, reduceStock } = productsSlice.actions;

export default productsSlice.reducer;
