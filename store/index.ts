import { configureStore } from '@reduxjs/toolkit';
import productsReducer from './productsSlice';
// Importaremos más reducers aquí (customersReducer, cartReducer, etc.)

export const store = configureStore({
  reducer: {
    // Aquí definimos cómo se verá tu estado global
    // state.products será manejado por productsReducer
    products: productsReducer,
    // ... aquí irán los demás
  },
});

// Tipos importantes para usar con TypeScript en tus componentes
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
