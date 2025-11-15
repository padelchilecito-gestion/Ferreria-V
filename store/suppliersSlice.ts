import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { mockSuppliers } from '../data/mockData';
import { Supplier } from '../types';

interface SuppliersState {
  suppliers: Supplier[];
}

const initialState: SuppliersState = {
  suppliers: mockSuppliers,
};

export const suppliersSlice = createSlice({
  name: 'suppliers',
  initialState,
  // Acciones para modificar el estado (las dejaremos listas)
  reducers: {
    addSupplier: (state, action: PayloadAction<Supplier>) => {
      state.suppliers.push(action.payload);
    },
    updateSupplier: (state, action: PayloadAction<Supplier>) => {
      const index = state.suppliers.findIndex(s => s.id === action.payload.id);
      if (index !== -1) {
        state.suppliers[index] = action.payload;
      }
    },
    deleteSupplier: (state, action: PayloadAction<string>) => {
      state.suppliers = state.suppliers.filter(s => s.id !== action.payload);
    },
  },
});

export const { addSupplier, updateSupplier, deleteSupplier } = suppliersSlice.actions;

export default suppliersSlice.reducer;
