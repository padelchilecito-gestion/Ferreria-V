// components/UpdateCheckStatusModal.tsx
import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../store';
import { updateCheckStatus } from '../store/checksSlice';
import { Check } from '../types';
import { XIcon } from './Icons';

interface UpdateCheckStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  check: Check | null;
}

const UpdateCheckStatusModal: React.FC<UpdateCheckStatusModalProps> = ({ isOpen, onClose, check }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [status, setStatus] = useState<Check['status']>('En cartera');

  useEffect(() => {
    if (check) {
      setStatus(check.status);
    }
  }, [check, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!check) return;

    dispatch(updateCheckStatus({ id: check.id, status }));
    onClose();
  };

  if (!isOpen || !check) {
    return null;
  }

  return (
    <div 
      className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center"
      onClick={onClose}
    >
      <div 
        className="bg-white w-full max-w-sm rounded-xl shadow-lg"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-bold text-slate-800">Actualizar Estado de Cheque</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-800">
            <XIcon className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4">
            <div>
              <p className="text-sm text-slate-500">Cheque N°: {check.number}</p>
              <p className="font-medium text-slate-800">Emisor: {check.issuer}</p>
              <p className="font-bold text-lg text-slate-800">${check.amount.toLocaleString('es-AR')}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-600">Nuevo Estado</label>
              <select 
                value={status} 
                onChange={e => setStatus(e.target.value as Check['status'])}
                className="w-full mt-1 p-2 border border-slate-300 rounded-lg"
              >
                <option value="En cartera">En cartera</option>
                <option value="Depositado">Depositado</option>
                <option value="Cobrado">Cobrado</option>
                <option value="Rechazado">Rechazado</option>
              </select>
            </div>
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
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Actualizar Estado
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateCheckStatusModal;
