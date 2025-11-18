import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Purchase } from '../types';
import { db } from '../firebase';
import { collection, getDocs, addDoc, updateDoc, doc } from 'firebase/firestore';

interface PurchasesState {
  purchases: Purchase[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
}

const initialState: PurchasesState = {
  purchases: [],
  status: 'idle',
};

// 1. Fetch Compras
export const fetchPurchases = createAsyncThunk('purchases/fetchPurchases', async () => {
  const querySnapshot = await getDocs(collection(db, "purchases"));
  const purchases: Purchase[] = [];
  querySnapshot.forEach((doc) => {
    purchases.push({ id: doc.id, ...doc.data() } as Purchase);
  });
  // Ordenar por fecha descendente
  return purchases.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
});

// 2. Añadir Compra
export const addPurchase = createAsyncThunk('purchases/addPurchase', async (newPurchase: Omit<Purchase, 'id'>) => {
  const docRef = await addDoc(collection(db, "purchases"), newPurchase);
  return { id: docRef.id, ...newPurchase } as Purchase;
});

// 3. Actualizar Estado de Compra (Pagada/Pendiente)
export const updatePurchaseStatus = createAsyncThunk('purchases/updatePurchaseStatus', async ({ id, status }: { id: string; status: Purchase['status'] }) => {
    const purchaseRef = doc(db, "purchases", id);
    await updateDoc(purchaseRef, { status });
    return { id, status };
});

export const purchasesSlice = createSlice({
  name: 'purchases',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPurchases.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.purchases = action.payload;
      })
      .addCase(addPurchase.fulfilled, (state, action) => {
        state.purchases.push(action.payload);
      })
      .addCase(updatePurchaseStatus.fulfilled, (state, action) => {
        const purchase = state.purchases.find(p => p.id === action.payload.id);
        if (purchase) purchase.status = action.payload.status;
      });
  },
});

export default purchasesSlice.reducer;
