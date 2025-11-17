// store/settingsSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SettingsState {
  taxRate: number; // Tasa de IVA, ej: 0.21 para 21%
  companyName: string;
  companyCuit: string;
}

const initialState: SettingsState = {
  taxRate: 0.21, // Valor por defecto
  companyName: 'Ferretería Central',
  companyCuit: '30-12345678-9',
};

export const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setSettings: (state, action: PayloadAction<Partial<SettingsState>>) => {
      // Esta acción permite actualizar cualquier parte de la configuración
      Object.assign(state, action.payload);
    },
    setTaxRate: (state, action: PayloadAction<number>) => {
      // Acción específica para la tasa de IVA
      state.taxRate = action.payload;
    },
  },
});

export const { setSettings, setTaxRate } = settingsSlice.actions;

export default settingsSlice.reducer;
