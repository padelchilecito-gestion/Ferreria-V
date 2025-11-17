// store/index.ts
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage'; 
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';

import productsReducer from './productsSlice';
import cartReducer from './cartSlice';
import customersReducer from './customersSlice';
import suppliersReducer from './suppliersSlice';
import checksReducer from './checksSlice';
import salesReducer from './salesSlice';
import settingsReducer from './settingsSlice';
import purchasesReducer from './purchasesSlice'; // 1. Importar el nuevo reducer

// 2. Combinamos todos los reducers
const rootReducer = combineReducers({
  products: productsReducer,
  cart: cartReducer,
  customers: customersReducer,
  suppliers: suppliersReducer,
  checks: checksReducer,
  sales: salesReducer,
  settings: settingsReducer,
  purchases: purchasesReducer, // 3. Añadir el reducer de compras
});

const persistConfig = {
  key: 'root', 
  storage, 
  // 4. Añadir 'purchases' a la whitelist
  whitelist: ['products', 'customers', 'suppliers', 'checks', 'sales', 'settings', 'purchases'],
  // 'cart' sigue fuera para que se limpie al recargar
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
