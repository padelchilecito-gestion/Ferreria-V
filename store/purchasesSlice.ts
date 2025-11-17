// store/purchasesSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Purchase } from '../types';

interface PurchasesState {
  purchases: Purchase[];
}

const initialState: PurchasesState = {
  purchases: [], // Comenzamos sin historial de compras
};

export const purchasesSlice = createSlice({
  name: 'purchases',
  initialState,
  reducers: {
    addPurchase: (state, action: PayloadAction<Purchase>) => {
      state.purchases.push(action.payload);
    },
    // Podríamos añadir acciones para 'pagar' o 'anular' una factura de compra
    updatePurchaseStatus: (state, action: PayloadAction<{ id: string; status: 'Pendiente de pago' | 'Pagada' }>) => {
      const purchase = state.purchases.find(p => p.id === action.payload.id);
      if (purchase) {
        purchase.status = action.payload.status;
      }
    },
  },
});

export const { addPurchase, updatePurchaseStatus } = purchasesSlice.actions;

export default purchasesSlice.reducer;
