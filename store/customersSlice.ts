import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { mockCustomers } from '../data/mockData';
import { Customer } from '../types';

// Define la forma del estado de esta porción
interface CustomersState {
  customers: Customer[];
}

// Usa los mockCustomers como estado inicial
const initialState: CustomersState = {
  customers: mockCustomers,
};

export const customersSlice = createSlice({
  name: 'customers',
  initialState,
  // Aquí definimos las acciones para modificar el estado de los clientes
  reducers: {
    addCustomer: (state, action: PayloadAction<Customer>) => {
      // Esta acción recibirá un objeto Customer completo y lo añadirá al array
      state.customers.push(action.payload);
    },
    updateCustomer: (state, action: PayloadAction<Customer>) => {
      // Esta acción buscará un cliente por ID y lo reemplazará
      const index = state.customers.findIndex(c => c.id === action.payload.id);
      if (index !== -1) {
        state.customers[index] = action.payload;
      }
    },
    deleteCustomer: (state, action: PayloadAction<string>) => {
      // Esta acción eliminará un cliente por su ID
      const customerId = action.payload;
      state.customers = state.customers.filter(c => c.id !== customerId);
    },
  },
});

// Exportamos las acciones para usarlas en los componentes
export const { addCustomer, updateCustomer, deleteCustomer } = customersSlice.actions;

// Exportamos el reductor para añadirlo al store
export default customersSlice.reducer;
