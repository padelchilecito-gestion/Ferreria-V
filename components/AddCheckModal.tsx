import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../store';
import { addCheck } from '../store/checksSlice';
// import { Check } from '../types';
import { XIcon } from './Icons';

interface AddCheckModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const getTodayDate = () => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

const AddCheckModal: React.FC<AddCheckModalProps> = ({ isOpen, onClose }) => {
  const dispatch = useDispatch<AppDispatch>();
  
  const [bank, setBank] = useState('');
  const [number, setNumber] = useState('');
  const [issuer, setIssuer] = useState('');
  const [amount, setAmount] = useState(0);
  const [issueDate, setIssueDate] = useState(getTodayDate());
  const [dueDate, setDueDate] = useState(getTodayDate());
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const newCheck = {
      bank,
      number,
      issuer,
      amount: Number(amount) || 0,
      issueDate,
      dueDate,
      status: 'En cartera' as const,
    };

    try {
        await dispatch(addCheck(newCheck)).unwrap();
        
        onClose();
        setBank('');
        setNumber('');
        setIssuer('');
        setAmount(0);
        setIssueDate(getTodayDate());
        setDueDate(getTodayDate());
    } catch (error) {
        alert("Error al guardar el cheque: " + error);
    } finally {
        setIsSubmitting(false);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div 
      className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center"
      onClick={onClose}
    >
      <div 
        className="bg-white w-full max-w-lg rounded-xl shadow-lg"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-bold text-slate-800">Registrar Nuevo Cheque</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-800">
            <XIcon className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-slate-600">Banco</label>
                <input
                  type="text"
                  value={bank}
                  onChange={e => setBank(e.target.value)}
                  className="w-full mt-1 p-2 border border-slate-300 rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-600">Número de Cheque</label>
                <input
                  type="text"
                  value={number}
                  onChange={e => setNumber(e.target.value)}
                  className="w-full mt-1 p-2 border border-slate-300 rounded-lg"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-600">Emisor</label>
              <input
                type="text"
                value={issuer}
                onChange={e => setIssuer(e.target.value)}
                className="w-full mt-1 p-2 border border-slate-300 rounded-lg"
                placeholder="Ej: Constructora S.A."
                required
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-slate-600">Importe</label>
              <input
                type="number"
                step="0.01"
                value={amount}
                onChange={e => setAmount(Number(e.target.value))}
                className="w-full mt-1 p-2 border border-slate-300 rounded-lg"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-slate-600">Fecha de Emisión</label>
                <input
                  type="date"
                  value={issueDate}
                  onChange={e => setIssueDate(e.target.value)}
                  className="w-full mt-1 p-2 border border-slate-300 rounded-lg"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-600">Fecha de Cobro</label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={e => setDueDate(e.target.value)}
                  className="w-full mt-1 p-2 border border-slate-300 rounded-lg"
                />
              </div>
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
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Guardando...' : 'Guardar Cheque'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCheckModal;
