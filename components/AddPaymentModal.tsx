import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../store';
import { addCustomerPayment } from '../store/customersSlice';
import { addCheck } from '../store/checksSlice'; // Importamos la acción para crear cheques
import { Customer } from '../types';
import { XIcon, CurrencyDollarIcon, ChecksIcon } from './Icons';

interface AddPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer: Customer | null;
}

// Tipos de métodos de pago disponibles
type PaymentMethod = 'Efectivo' | 'Transferencia' | 'Cheque' | 'Tarjeta de Crédito' | 'Otro';

const AddPaymentModal: React.FC<AddPaymentModalProps> = ({ isOpen, onClose, customer }) => {
  const dispatch = useDispatch<AppDispatch>();
  
  // Estado del pago general
  const [amount, setAmount] = useState(0);
  const [method, setMethod] = useState<PaymentMethod>('Efectivo');
  const [note, setNote] = useState('');
  
  // Estados específicos para Cheques
  const [bank, setBank] = useState('');
  const [checkNumber, setCheckNumber] = useState('');
  const [issueDate, setIssueDate] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [issuer, setIssuer] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reiniciar formulario al abrir
  useEffect(() => {
    if (customer && isOpen) {
      setAmount(customer.balance > 0 ? customer.balance : 0); // Sugerir pagar el total de la deuda
      setIssuer(customer.name); // El emisor por defecto es el cliente
    } else {
      setAmount(0);
      setIssuer('');
    }
    // Valores por defecto
    const today = new Date().toISOString().split('T')[0];
    setIssueDate(today);
    setDueDate(today);
    setMethod('Efectivo');
    setNote('');
    setBank('');
    setCheckNumber('');
  }, [customer, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customer || Number(amount) <= 0) {
        alert("Por favor ingrese un monto válido.");
        return;
    }

    // Validaciones extra para cheques
    if (method === 'Cheque') {
        if (!bank || !checkNumber || !issueDate || !dueDate || !issuer) {
            alert("Por favor complete todos los datos del cheque.");
            return;
        }
    }

    setIsSubmitting(true);

    try {
        // 1. Si es cheque, lo registramos en la cartera
        if (method === 'Cheque') {
            await dispatch(addCheck({
                bank,
                number: checkNumber,
                issuer,
                amount: Number(amount),
                issueDate,
                dueDate,
                status: 'En cartera' // Entra directamente a tu cartera
            })).unwrap();
        }

        // 2. Registramos el pago en la cuenta del cliente (baja deuda)
        // Podríamos agregar la nota o el método al historial si tuviéramos esa estructura,
        // por ahora impacta en el saldo.
        await dispatch(addCustomerPayment({
            customerId: customer.id, 
            paymentAmount: Number(amount)
        })).unwrap();
        
        onClose();
    } catch (error) {
        console.error(error);
        alert("Ocurrió un error al registrar el pago.");
    } finally {
        setIsSubmitting(false);
    }
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
        className="bg-white w-full max-w-lg rounded-xl shadow-lg flex flex-col max-h-[90vh]"
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

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-5">
            
            {/* Info Cliente */}
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-500">Cliente</span>
                    <span className="font-semibold text-slate-700">{customer.name}</span>
                </div>
                <div className="flex justify-between items-center mt-1">
                    <span className="text-sm text-slate-500">Deuda Actual</span>
                    <span className="font-bold text-red-600">${customer.balance.toFixed(2)}</span>
                </div>
            </div>

            {/* Monto y Método */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Monto a Pagar</label>
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                        <input
                            type="number"
                            step="0.01"
                            value={amount}
                            onChange={e => setAmount(Number(e.target.value))}
                            className="w-full pl-7 p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                            required
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Método de Pago</label>
                    <select 
                        value={method} 
                        onChange={e => setMethod(e.target.value as PaymentMethod)}
                        className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                    >
                        <option value="Efectivo">Efectivo</option>
                        <option value="Transferencia">Transferencia</option>
                        <option value="Cheque">Cheque</option>
                        <option value="Tarjeta de Crédito">Tarjeta de Crédito</option>
                        <option value="Otro">Otro</option>
                    </select>
                </div>
            </div>

            {/* Sección Específica para Cheques */}
            {method === 'Cheque' && (
                <div className="border border-blue-200 bg-blue-50 p-4 rounded-lg space-y-3 animate-in fade-in slide-in-from-top-2">
                    <div className="flex items-center gap-2 text-blue-800 border-b border-blue-200 pb-2 mb-2">
                        <ChecksIcon className="w-5 h-5" />
                        <span className="font-semibold text-sm">Datos del Cheque Entrante</span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-xs font-medium text-blue-700">Banco</label>
                            <input 
                                type="text" 
                                value={bank} 
                                onChange={e => setBank(e.target.value)}
                                className="w-full mt-1 p-1.5 text-sm border border-blue-300 rounded focus:border-blue-500 outline-none"
                                placeholder="Ej: Galicia"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-medium text-blue-700">N° Cheque</label>
                            <input 
                                type="text" 
                                value={checkNumber} 
                                onChange={e => setCheckNumber(e.target.value)}
                                className="w-full mt-1 p-1.5 text-sm border border-blue-300 rounded focus:border-blue-500 outline-none"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-xs font-medium text-blue-700">F. Emisión</label>
                            <input 
                                type="date" 
                                value={issueDate} 
                                onChange={e => setIssueDate(e.target.value)}
                                className="w-full mt-1 p-1.5 text-sm border border-blue-300 rounded focus:border-blue-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-medium text-blue-700">F. Cobro</label>
                            <input 
                                type="date" 
                                value={dueDate} 
                                onChange={e => setDueDate(e.target.value)}
                                className="w-full mt-1 p-1.5 text-sm border border-blue-300 rounded focus:border-blue-500 outline-none"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-medium text-blue-700">Emisor (Titular)</label>
                        <input 
                            type="text" 
                            value={issuer} 
                            onChange={e => setIssuer(e.target.value)}
                            className="w-full mt-1 p-1.5 text-sm border border-blue-300 rounded focus:border-blue-500 outline-none"
                            placeholder="Nombre del titular"
                        />
                    </div>
                    <p className="text-xs text-blue-600 italic mt-1">
                        * Este cheque se agregará automáticamente a tu cartera.
                    </p>
                </div>
            )}

            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Notas (Opcional)</label>
                <textarea
                    value={note}
                    onChange={e => setNote(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none resize-none h-20 text-sm"
                    placeholder="Detalles adicionales del cobro..."
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
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 shadow-sm disabled:bg-green-400"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Procesando...' : 'Confirmar Pago'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPaymentModal;
