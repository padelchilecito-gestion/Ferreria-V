// store/salesSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Sale } from '../types';

interface SalesState {
  sales: Sale[];
}

const initialState: SalesState = {
  sales: [],
};

export const salesSlice = createSlice({
  name: 'sales',
  initialState,
  reducers: {
    addSale: (state, action: PayloadAction<Sale>) => {
      // Simplemente añade la nueva venta al historial
      state.sales.push(action.payload);
    },
    // (Aquí podríamos añadir acciones futuras como 'cancelSale', 'updateSale', etc.)
  },
});

export const { addSale } = salesSlice.actions;

export default salesSlice.reducer;
