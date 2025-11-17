import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { mockCustomers } from '../data/mockData';
import { Customer } from '../types';

interface CustomersState {
  customers: Customer[];
}

const initialState: CustomersState = {
  customers: mockCustomers,
};

export const customersSlice = createSlice({
  name: 'customers',
  initialState,
  reducers: {
    addCustomer: (state, action: PayloadAction<Customer>) => {
      state.customers.push(action.payload);
    },
    updateCustomer: (state, action: PayloadAction<Customer>) => {
      const index = state.customers.findIndex(c => c.id === action.payload.id);
      if (index !== -1) {
        state.customers[index] = action.payload;
      }
    },
    deleteCustomer: (state, action: PayloadAction<string>) => {
      const customerId = action.payload;
      state.customers = state.customers.filter(c => c.id !== customerId);
    },
    updateCustomerBalance: (state, action: PayloadAction<{ customerId: string; dueAmount: number }>) => {
      const { customerId, dueAmount } = action.payload;
      const customer = state.customers.find(c => c.id === customerId);
      
      if (customer) {
        customer.balance += dueAmount;
      }
    },
    // --- INICIO DE NUEVO CÓDIGO ---
    addCustomerPayment: (state, action: PayloadAction<{ customerId: string; paymentAmount: number }>) => {
      // Esta acción REGISTRA UN PAGO (reduce la deuda/balance)
      const { customerId, paymentAmount } = action.payload;
      const customer = state.customers.find(c => c.id === customerId);
      
      if (customer) {
        customer.balance -= paymentAmount;
      }
    },
    // --- FIN DE NUEVO CÓDIGO ---
  },
});

// 5. Exportar la nueva acción
export const { 
  addCustomer, 
  updateCustomer, 
  deleteCustomer, 
  updateCustomerBalance,
  addCustomerPayment // <-- NUEVO
} = customersSlice.actions;

export default customersSlice.reducer;
