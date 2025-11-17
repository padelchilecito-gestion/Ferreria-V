// store/index.ts
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage'; // Importa el storage (localStorage por defecto)
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

// 1. Combinamos todos los reducers en un 'rootReducer'
const rootReducer = combineReducers({
  products: productsReducer,
  cart: cartReducer,
  customers: customersReducer,
  suppliers: suppliersReducer,
  checks: checksReducer,
});

// 2. Configuración de persistencia
const persistConfig = {
  key: 'root', // Clave principal en localStorage
  storage, // El motor de almacenamiento (localStorage)
  whitelist: ['products', 'customers', 'suppliers', 'checks'], // Slices que SÍ queremos persistir
  // 'cart' no se incluye aquí para que se vacíe al recargar (opcional, pero común)
};

// 3. Creamos un reducer "persistido"
const persistedReducer = persistReducer(persistConfig, rootReducer);

// 4. Configuramos el store para que use el reducer persistido
export const store = configureStore({
  reducer: persistedReducer, // Usamos el reducer con persistencia
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignorar estas acciones que usa redux-persist
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

// 5. Exportamos el 'persistor' que usará nuestra UI
export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
