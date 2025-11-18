import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Sale } from '../types';
import { db } from '../firebase';
import { collection, getDocs, addDoc } from 'firebase/firestore';

interface SalesState {
  sales: Sale[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
}

const initialState: SalesState = {
  sales: [],
  status: 'idle',
};

// 1. Fetch Ventas
export const fetchSales = createAsyncThunk('sales/fetchSales', async () => {
  const querySnapshot = await getDocs(collection(db, "sales"));
  const sales: Sale[] = [];
  querySnapshot.forEach((doc) => {
    sales.push({ id: doc.id, ...doc.data() } as Sale);
  });
  // Ordenar por fecha (más reciente primero si se desea, o dejarlo al componente)
  return sales.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
});

// 2. Añadir Venta
export const addSale = createAsyncThunk('sales/addSale', async (newSale: Omit<Sale, 'id'>) => {
  const docRef = await addDoc(collection(db, "sales"), newSale);
  return { id: docRef.id, ...newSale } as Sale;
});

export const salesSlice = createSlice({
  name: 'sales',
  initialState,
  reducers: {}, // Ya no necesitamos reducers síncronos
  extraReducers: (builder) => {
    builder
      .addCase(fetchSales.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.sales = action.payload;
      })
      .addCase(addSale.fulfilled, (state, action) => {
        state.sales.push(action.payload);
      });
  },
});

export default salesSlice.reducer;
