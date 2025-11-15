import { configureStore } from '@reduxjs/toolkit';
import productsReducer from './productsSlice';
import cartReducer from './cartSlice';
import customersReducer from './customersSlice'; // 1. Importar el nuevo reducer

export const store = configureStore({
  reducer: {
    products: productsReducer,
    cart: cartReducer,
    customers: customersReducer, // 2. Añadir el reducer de clientes
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
