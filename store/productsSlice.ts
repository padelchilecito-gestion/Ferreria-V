import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { mockProducts } from '../data/mockData';
import { Product } from '../types';

// Define la forma del estado de esta porción
interface ProductsState {
  products: Product[];
}

// Usa los mockProducts como estado inicial
const initialState: ProductsState = {
  products: mockProducts,
};

export const productsSlice = createSlice({
  name: 'products',
  initialState,
  // Aquí definimos las "mutaciones" o cambios al estado.
  // Son las únicas funciones que pueden modificar el estado de los productos.
  reducers: {
    // Ejemplo de acción: reducir el stock de un producto
    // La llamaremos más adelante desde el PointOfSale
    reduceStock: (state, action: PayloadAction<{ id: string; quantity: number }>) => {
      const product = state.products.find(p => p.id === action.payload.id);
      if (product) {
        product.stock -= action.payload.quantity;
      }
    },
    // Podríamos añadir más acciones como: addProduct, updateProduct, etc.
  },
});

// Exportamos las acciones para usarlas en los componentes
export const { reduceStock } = productsSlice.actions;

// Exportamos el reductor para añadirlo al store
export default productsSlice.reducer;
