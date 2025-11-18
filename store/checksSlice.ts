import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Check } from '../types';
import { db } from '../firebase';
import { collection, getDocs, addDoc, updateDoc, doc, deleteDoc } from 'firebase/firestore';

interface ChecksState {
  checks: Check[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: ChecksState = {
  checks: [],
  status: 'idle',
  error: null,
};

// 1. Fetch Cheques
export const fetchChecks = createAsyncThunk('checks/fetchChecks', async () => {
  const querySnapshot = await getDocs(collection(db, "checks"));
  const checks: Check[] = [];
  querySnapshot.forEach((doc) => {
    checks.push({ id: doc.id, ...doc.data() } as Check);
  });
  return checks.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
});

// 2. Añadir Cheque
export const addCheck = createAsyncThunk('checks/addCheck', async (newCheck: Omit<Check, 'id'>) => {
  const docRef = await addDoc(collection(db, "checks"), newCheck);
  return { id: docRef.id, ...newCheck } as Check;
});

// 3. Actualizar Estado
export const updateCheckStatus = createAsyncThunk('checks/updateCheckStatus', async ({ id, status }: { id: string; status: Check['status'] }) => {
    const checkRef = doc(db, "checks", id);
    await updateDoc(checkRef, { status });
    return { id, status };
});

// 4. Eliminar Cheque (ESTA ES LA FUNCIÓN QUE NECESITAS)
export const deleteCheck = createAsyncThunk('checks/deleteCheck', async (id: string) => {
    await deleteDoc(doc(db, "checks", id));
    return id; // Devolvemos el ID para saber cuál borrar del estado local
});

export const checksSlice = createSlice({
  name: 'checks',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchChecks.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.checks = action.payload;
      })
      .addCase(addCheck.fulfilled, (state, action) => {
        state.checks.push(action.payload);
      })
      .addCase(updateCheckStatus.fulfilled, (state, action) => {
        const check = state.checks.find(c => c.id === action.payload.id);
        if (check) check.status = action.payload.status;
      })
      // Manejo de la eliminación en el estado local
      .addCase(deleteCheck.fulfilled, (state, action) => {
        state.checks = state.checks.filter(c => c.id !== action.payload);
      });
  },
});

export default checksSlice.reducer;
