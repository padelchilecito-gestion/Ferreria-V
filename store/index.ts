import { configureStore } from '@reduxjs/toolkit';
import productsReducer from './productsSlice';
import cartReducer from './cartSlice'; // 1. Importar el nuevo reducer

export const store = configureStore({
  reducer: {
    products: productsReducer,
    cart: cartReducer, // 2. Añadir el reducer del carrito al store
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
