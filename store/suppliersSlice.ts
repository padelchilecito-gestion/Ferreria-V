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
    updateSupplierBalance: (state, action: PayloadAction<{ supplierId: string; dueAmount: number }>) => {
      // Incrementa la deuda
      const { supplierId, dueAmount } = action.payload;
      const supplier = state.suppliers.find(s => s.id === supplierId);
      
      if (supplier) {
        supplier.balance += dueAmount;
      }
    },
    // --- INICIO DE NUEVO CÓDIGO ---
    addSupplierPayment: (state, action: PayloadAction<{ supplierId: string; paymentAmount: number }>) => {
      // REGISTRA UN PAGO (reduce la deuda)
      const { supplierId, paymentAmount } = action.payload;
      const supplier = state.suppliers.find(s => s.id === supplierId);
      
      if (supplier) {
        supplier.balance -= paymentAmount;
      }
    },
    // --- FIN DE NUEVO CÓDIGO ---
  },
});

// Exportar la nueva acción
export const { 
  addSupplier, 
  updateSupplier, 
  deleteSupplier, 
  updateSupplierBalance,
  addSupplierPayment // <-- NUEVO
} = suppliersSlice.actions;

export default suppliersSlice.reducer;
