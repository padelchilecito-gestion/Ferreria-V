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
    // --- INICIO DE NUEVO CÓDIGO ---
    updateCustomerBalance: (state, action: PayloadAction<{ customerId: string; dueAmount: number }>) => {
      // Esta acción actualiza el saldo de un cliente.
      // 'dueAmount' es lo que el cliente DEBE (positivo) o lo que pagó de más (negativo)
      const { customerId, dueAmount } = action.payload;
      const customer = state.customers.find(c => c.id === customerId);
      
      if (customer) {
        // Sumamos lo que debe a su saldo actual.
        // Si pagó de más (dueAmount es negativo), su saldo disminuirá.
        customer.balance += dueAmount;
      }
    },
    // --- FIN DE NUEVO CÓDIGO ---
  },
});

// Exportamos las acciones para usarlas en los componentes
// 4. Exportar la nueva acción
export const { addCustomer, updateCustomer, deleteCustomer, updateCustomerBalance } = customersSlice.actions;

// Exportamos el reductor para añadirlo al store
export default customersSlice.reducer;
