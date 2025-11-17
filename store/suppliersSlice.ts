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
    // --- INICIO DE NUEVO CÓDIGO ---
    updateSupplierBalance: (state, action: PayloadAction<{ supplierId: string; dueAmount: number }>) => {
      // Esta acción incrementa la deuda que tenemos con un proveedor
      const { supplierId, dueAmount } = action.payload;
      const supplier = state.suppliers.find(s => s.id === supplierId);
      
      if (supplier) {
        // Sumamos lo que le debemos a su saldo actual
        supplier.balance += dueAmount;
      }
    },
    // --- FIN DE NUEVO CÓDIGO ---
  },
});

// 4. Exportar la nueva acción
export const { addSupplier, updateSupplier, deleteSupplier, updateSupplierBalance } = suppliersSlice.actions;

export default suppliersSlice.reducer;
