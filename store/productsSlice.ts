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
    // 1. Añadimos la nueva acción 'addProduct'
    addProduct: (state, action: PayloadAction<Product>) => {
      state.products.push(action.payload);
    },
    reduceStock: (state, action: PayloadAction<{ id: string; quantity: number }>) => {
      const product = state.products.find(p => p.id === action.payload.id);
      if (product) {
        product.stock -= action.payload.quantity;
      }
    },
  },
});

// 2. Exportamos la nueva acción
export const { addProduct, reduceStock } = productsSlice.actions;

export default productsSlice.reducer;
