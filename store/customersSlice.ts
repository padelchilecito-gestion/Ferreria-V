import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Customer } from '../types';
import { db } from '../firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';

interface CustomersState {
  customers: Customer[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: CustomersState = {
  customers: [],
  status: 'idle',
  error: null,
};

// 1. Fetch Clientes
export const fetchCustomers = createAsyncThunk('customers/fetchCustomers', async () => {
  const querySnapshot = await getDocs(collection(db, "customers"));
  const customers: Customer[] = [];
  querySnapshot.forEach((doc) => {
    customers.push({ id: doc.id, ...doc.data() } as Customer);
  });
  return customers;
});

// 2. Añadir Cliente
export const addCustomer = createAsyncThunk('customers/addCustomer', async (newCustomer: Omit<Customer, 'id'>) => {
  const docRef = await addDoc(collection(db, "customers"), newCustomer);
  return { id: docRef.id, ...newCustomer } as Customer;
});

// 3. Actualizar Cliente (Datos generales)
export const updateCustomer = createAsyncThunk('customers/updateCustomer', async (customer: Customer) => {
  const { id, ...data } = customer;
  const customerRef = doc(db, "customers", id);
  await updateDoc(customerRef, data as any);
  return customer;
});

// 4. Eliminar Cliente
export const deleteCustomer = createAsyncThunk('customers/deleteCustomer', async (id: string) => {
  await deleteDoc(doc(db, "customers", id));
  return id;
});

// 5. Actualizar Saldo (Deuda) - Se usa en Ventas
export const updateCustomerBalance = createAsyncThunk('customers/updateCustomerBalance', async ({ customerId, dueAmount }: { customerId: string; dueAmount: number }, { getState }) => {
    const state = getState() as any;
    const customer = state.customers.customers.find((c: Customer) => c.id === customerId);
    if (customer) {
        const newBalance = customer.balance + dueAmount;
        const customerRef = doc(db, "customers", customerId);
        await updateDoc(customerRef, { balance: newBalance });
        return { id: customerId, balance: newBalance };
    }
    throw new Error("Cliente no encontrado");
});

// 6. Registrar Pago (Abono)
export const addCustomerPayment = createAsyncThunk('customers/addCustomerPayment', async ({ customerId, paymentAmount }: { customerId: string; paymentAmount: number }, { getState }) => {
    const state = getState() as any;
    const customer = state.customers.customers.find((c: Customer) => c.id === customerId);
    if (customer) {
        const newBalance = customer.balance - paymentAmount;
        const customerRef = doc(db, "customers", customerId);
        await updateDoc(customerRef, { balance: newBalance });
        return { id: customerId, balance: newBalance };
    }
    throw new Error("Cliente no encontrado");
});

export const customersSlice = createSlice({
  name: 'customers',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.customers = action.payload;
      })
      .addCase(addCustomer.fulfilled, (state, action) => {
        state.customers.push(action.payload);
      })
      .addCase(updateCustomer.fulfilled, (state, action) => {
        const index = state.customers.findIndex(c => c.id === action.payload.id);
        if (index !== -1) state.customers[index] = action.payload;
      })
      .addCase(deleteCustomer.fulfilled, (state, action) => {
        state.customers = state.customers.filter(c => c.id !== action.payload);
      })
      .addCase(updateCustomerBalance.fulfilled, (state, action) => {
        const customer = state.customers.find(c => c.id === action.payload.id);
        if (customer) customer.balance = action.payload.balance;
      })
      .addCase(addCustomerPayment.fulfilled, (state, action) => {
        const customer = state.customers.find(c => c.id === action.payload.id);
        if (customer) customer.balance = action.payload.balance;
      });
  },
});

export default customersSlice.reducer;
