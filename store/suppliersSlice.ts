import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Supplier } from '../types';
import { db } from '../firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';

interface SuppliersState {
  suppliers: Supplier[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: SuppliersState = {
  suppliers: [],
  status: 'idle',
  error: null
};

// 1. Fetch Proveedores
export const fetchSuppliers = createAsyncThunk('suppliers/fetchSuppliers', async () => {
  const querySnapshot = await getDocs(collection(db, "suppliers"));
  const suppliers: Supplier[] = [];
  querySnapshot.forEach((doc) => {
    suppliers.push({ id: doc.id, ...doc.data() } as Supplier);
  });
  return suppliers;
});

// 2. Añadir Proveedor
export const addSupplier = createAsyncThunk('suppliers/addSupplier', async (newSupplier: Omit<Supplier, 'id'>) => {
  const docRef = await addDoc(collection(db, "suppliers"), newSupplier);
  return { id: docRef.id, ...newSupplier } as Supplier;
});

// 3. Actualizar Proveedor
export const updateSupplier = createAsyncThunk('suppliers/updateSupplier', async (supplier: Supplier) => {
  const { id, ...data } = supplier;
  const supplierRef = doc(db, "suppliers", id);
  await updateDoc(supplierRef, data as any);
  return supplier;
});

// 4. Eliminar Proveedor
export const deleteSupplier = createAsyncThunk('suppliers/deleteSupplier', async (id: string) => {
  await deleteDoc(doc(db, "suppliers", id));
  return id;
});

// 5. Actualizar Saldo (Deuda por Compra)
export const updateSupplierBalance = createAsyncThunk('suppliers/updateSupplierBalance', async ({ supplierId, dueAmount }: { supplierId: string; dueAmount: number }, { getState }) => {
    const state = getState() as any;
    const supplier = state.suppliers.suppliers.find((s: Supplier) => s.id === supplierId);
    if (supplier) {
        const newBalance = supplier.balance + dueAmount;
        const supplierRef = doc(db, "suppliers", supplierId);
        await updateDoc(supplierRef, { balance: newBalance });
        return { id: supplierId, balance: newBalance };
    }
    throw new Error("Proveedor no encontrado");
});

// 6. Registrar Pago a Proveedor
export const addSupplierPayment = createAsyncThunk('suppliers/addSupplierPayment', async ({ supplierId, paymentAmount }: { supplierId: string; paymentAmount: number }, { getState }) => {
    const state = getState() as any;
    const supplier = state.suppliers.suppliers.find((s: Supplier) => s.id === supplierId);
    if (supplier) {
        const newBalance = supplier.balance - paymentAmount;
        const supplierRef = doc(db, "suppliers", supplierId);
        await updateDoc(supplierRef, { balance: newBalance });
        return { id: supplierId, balance: newBalance };
    }
    throw new Error("Proveedor no encontrado");
});

export const suppliersSlice = createSlice({
  name: 'suppliers',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSuppliers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.suppliers = action.payload;
      })
      .addCase(addSupplier.fulfilled, (state, action) => {
        state.suppliers.push(action.payload);
      })
      .addCase(updateSupplier.fulfilled, (state, action) => {
        const index = state.suppliers.findIndex(s => s.id === action.payload.id);
        if (index !== -1) state.suppliers[index] = action.payload;
      })
      .addCase(deleteSupplier.fulfilled, (state, action) => {
        state.suppliers = state.suppliers.filter(s => s.id !== action.payload);
      })
      .addCase(updateSupplierBalance.fulfilled, (state, action) => {
        const supplier = state.suppliers.find(s => s.id === action.payload.id);
        if (supplier) supplier.balance = action.payload.balance;
      })
      .addCase(addSupplierPayment.fulfilled, (state, action) => {
        const supplier = state.suppliers.find(s => s.id === action.payload.id);
        if (supplier) supplier.balance = action.payload.balance;
      });
  },
});

export default suppliersSlice.reducer;
