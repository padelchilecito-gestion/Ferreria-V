import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../store';
import { addSupplierPayment } from '../store/suppliersSlice';
import { Supplier } from '../types';
import { XIcon, CurrencyDollarIcon } from './Icons';

interface AddSupplierPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  supplier: Supplier | null;
}

const AddSupplierPaymentModal: React.FC<AddSupplierPaymentModalProps> = ({ isOpen, onClose, supplier }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [amount, setAmount] = useState(0);
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (supplier && supplier.balance > 0) {
      setAmount(supplier.balance);
    } else {
      setAmount(0);
    }
    setNote('');
  }, [supplier, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supplier || Number(amount) <= 0) {
        alert("Por favor ingrese un monto válido.");
        return;
    }
    setIsSubmitting(true);

    try {
      await dispatch(addSupplierPayment({
          supplierId: supplier.id, 
          paymentAmount: Number(amount)
      })).unwrap();
      
      onClose();
      setAmount(0);
    } catch (error) {
      alert("Error al registrar el pago: " + error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !supplier) {
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
            <h2 className="text-lg font-bold text-slate-800">Registrar Pago a Proveedor</h2>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-800">
            <XIcon className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-600">Proveedor</label>
              <p className="font-semibold text-slate-800 text-lg">{supplier.name}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-slate-600">Saldo Actual (Deuda)</label>
                <div className="mt-1 p-2 border border-slate-300 rounded-lg bg-slate-50 text-red-600 font-bold">
                  ${supplier.balance.toFixed(2)}
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
                  max={supplier.balance > 0 ? supplier.balance : undefined}
                />
              </div>
            </div>
             <div>
                <label className="text-sm font-medium text-slate-600">Nota / N° Comprobante (Opcional)</label>
                <input
                  type="text"
                  value={note}
                  onChange={e => setNote(e.target.value)}
                  className="w-full mt-1 p-2 border border-slate-300 rounded-lg"
                />
            </div>
          </div>

          <div className="p-4 border-t bg-slate-50 rounded-b-xl flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50"
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-green-400"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Procesando...' : 'Guardar Pago'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSupplierPaymentModal;
