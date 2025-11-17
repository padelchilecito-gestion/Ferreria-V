// store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import productsReducer from './productsSlice';
import cartReducer from './cartSlice';
import customersReducer from './customersSlice';
import suppliersReducer from './suppliersSlice';
import checksReducer from './checksSlice';

export const store = configureStore({
  reducer: {
    products: productsReducer,
    cart: cartReducer,
    customers: customersReducer,
    suppliers: suppliersReducer,
    checks: checksReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
