import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../store';
import { addSupplier } from '../store/suppliersSlice';
// import { Supplier } from '../types';
import { XIcon } from './Icons';

interface AddSupplierModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddSupplierModal: React.FC<AddSupplierModalProps> = ({ isOpen, onClose }) => {
  const dispatch = useDispatch<AppDispatch>();
  
  const [name, setName] = useState('');
  const [cuit, setCuit] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const newSupplier = {
      name,
      cuit,
      email,
      phone,
      status: 'Active' as const,
      balance: 0,
    };

    try {
      await dispatch(addSupplier(newSupplier)).unwrap();
      
      onClose();
      setName('');
      setCuit('');
      setEmail('');
      setPhone('');
    } catch (error) {
      alert("Error al guardar proveedor: " + error);
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
          <h2 className="text-lg font-bold text-slate-800">Agregar Nuevo Proveedor</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-800">
            <XIcon className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-600">Nombre o Razón Social</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full mt-1 p-2 border border-slate-300 rounded-lg"
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-slate-600">CUIT/DNI</label>
                <input
                  type="text"
                  value={cuit}
                  onChange={e => setCuit(e.target.value)}
                  className="w-full mt-1 p-2 border border-slate-300 rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-600">Teléfono</label>
                <input
                  type="text"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full mt-1 p-2 border border-slate-300 rounded-lg"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-600">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
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
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Guardando...' : 'Guardar Proveedor'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSupplierModal;
