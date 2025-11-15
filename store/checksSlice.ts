import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { mockChecks } from '../data/mockData';
import { Check } from '../types';

interface ChecksState {
  checks: Check[];
}

const initialState: ChecksState = {
  checks: mockChecks,
};

export const checksSlice = createSlice({
  name: 'checks',
  initialState,
  // Acciones para modificar el estado (las dejaremos listas)
  reducers: {
    addCheck: (state, action: PayloadAction<Check>) => {
      state.checks.push(action.payload);
    },
    updateCheckStatus: (state, action: PayloadAction<{ id: string; status: Check['status'] }>) => {
      const check = state.checks.find(c => c.id === action.payload.id);
      if (check) {
        check.status = action.payload.status;
      }
    },
  },
});

export const { addCheck, updateCheckStatus } = checksSlice.actions;

export default checksSlice.reducer;
