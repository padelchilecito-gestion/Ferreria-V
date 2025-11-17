// components/AddPaymentModal.tsx
import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../store';
import { addCustomerPayment } from '../store/customersSlice';
import { Customer } from '../types';
import { XIcon, CurrencyDollarIcon } from './Icons';

interface AddPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer: Customer | null;
}

const AddPaymentModal: React.FC<AddPaymentModalProps> = ({ isOpen, onClose, customer }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [amount, setAmount] = useState(0);

  // Pre-rellenar el campo con el saldo deudor
  useEffect(() => {
    if (customer && customer.balance > 0) {
      setAmount(customer.balance);
    } else {
      setAmount(0);
    }
  }, [customer, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customer || Number(amount) <= 0) {
        alert("Por favor ingrese un monto válido.");
        return;
    }

    // Despachar la nueva acción
    dispatch(addCustomerPayment({
        customerId: customer.id, 
        paymentAmount: Number(amount)
    }));
    
    onClose();
    setAmount(0); // Resetear el monto
  };

  if (!isOpen || !customer) {
    return null;
  }

  return (
    <div 
      className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center"
      onClick={onClose}
    >
      <div 
        className="bg-white w-full max-w-md rounded-xl shadow-lg"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <div className="flex items-center gap-3">
            <CurrencyDollarIcon className="w-6 h-6 text-slate-700" />
            <h2 className="text-lg font-bold text-slate-800">Registrar Pago de Cliente</h2>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-800">
            <XIcon className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-600">Cliente</label>
              <p className="font-semibold text-slate-800 text-lg">{customer.name}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-slate-600">Saldo Actual (Deuda)</label>
                <div className="mt-1 p-2 border border-slate-300 rounded-lg bg-slate-50 text-red-600 font-bold">
                  ${customer.balance.toFixed(2)}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-600">Monto a Pagar ($)</label>
                <input
                  type="number"
                  step="0.01"
                  value={amount}
                  onChange={e => setAmount(Number(e.target.value))}
                  className="w-full mt-1 p-2 border border-slate-300 rounded-lg"
                  required
                  max={customer.balance > 0 ? customer.balance : undefined}
                />
              </div>
            </div>
            <p className="text-xs text-slate-500">
              Ingrese el monto que el cliente está pagando. Esto reducirá su saldo deudor.
            </p>
          </div>

          <div className="p-4 border-t bg-slate-50 rounded-b-xl flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Guardar Pago
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPaymentModal;
