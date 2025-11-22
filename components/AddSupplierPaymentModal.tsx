import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../store';
import { addSupplierPayment } from '../store/suppliersSlice';
import { updateCheckStatus } from '../store/checksSlice';
import { updatePurchaseStatus } from '../store/purchasesSlice'; // Importar acción para actualizar la compra
import { selectAllChecks } from '../store/selectors';
import { Supplier, Purchase } from '../types';
import { XIcon, CurrencyDollarIcon } from './Icons';

interface AddSupplierPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  supplier: Supplier | null;
  purchase?: Purchase | null; // Opcional: La compra específica que se está pagando
}

const AddSupplierPaymentModal: React.FC<AddSupplierPaymentModalProps> = ({ isOpen, onClose, supplier, purchase }) => {
  const dispatch = useDispatch<AppDispatch>();
  const allChecks = useSelector(selectAllChecks);

  const [cashAmount, setCashAmount] = useState(0);
  const [selectedCheckIds, setSelectedCheckIds] = useState<string[]>([]);
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const availableChecks = useMemo(() => {
    return allChecks.filter(c => c.status === 'En cartera');
  }, [allChecks]);

  const checksTotalAmount = useMemo(() => {
    return selectedCheckIds.reduce((total, id) => {
        const check = availableChecks.find(c => c.id === id);
        return total + (check ? check.amount : 0);
    }, 0);
  }, [selectedCheckIds, availableChecks]);

  const totalPayment = Number(cashAmount) + checksTotalAmount;

  useEffect(() => {
    if (isOpen && supplier) {
        // Si viene una compra específica, sugerimos ese monto
        if (purchase) {
            setCashAmount(purchase.total);
            setNote(`Pago de factura: ${purchase.invoiceNumber}`);
        } else {
            // Si es un pago general (aunque ahora lo limitamos desde compras, dejamos la lógica por seguridad)
            setCashAmount(supplier.balance > 0 ? supplier.balance : 0);
            setNote('');
        }
        setSelectedCheckIds([]);
    }
  }, [isOpen, supplier, purchase]);

  const handleCheckToggle = (checkId: string) => {
      setSelectedCheckIds(prev => 
        prev.includes(checkId) 
            ? prev.filter(id => id !== checkId) 
            : [...prev, checkId]
      );
  };

  // Efecto para ajustar el efectivo sugerido si se seleccionan cheques
  useEffect(() => {
      if (purchase) {
          const remaining = Math.max(0, purchase.total - checksTotalAmount);
          setCashAmount(remaining);
      }
  }, [checksTotalAmount, purchase]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supplier || totalPayment <= 0) {
        alert("El monto total del pago debe ser mayor a 0.");
        return;
    }
    setIsSubmitting(true);

    try {
      // 1. Actualizar cheques
      const checkPromises = selectedCheckIds.map(checkId => 
          dispatch(updateCheckStatus({ id: checkId, status: 'Entregado' })).unwrap()
      );
      await Promise.all(checkPromises);

      // 2. Registrar el pago en la cuenta del proveedor
      await dispatch(addSupplierPayment({
          supplierId: supplier.id, 
          paymentAmount: totalPayment
      })).unwrap();
      
      // 3. Si hay una compra asociada, marcarla como pagada
      if (purchase) {
          await dispatch(updatePurchaseStatus({ 
              id: purchase.id, 
              status: 'Pagada' 
          })).unwrap();
      }
      
      onClose();
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
        className="bg-white w-full max-w-2xl rounded-xl shadow-lg flex flex-col max-h-[90vh]"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <div className="flex items-center gap-3">
            <CurrencyDollarIcon className="w-6 h-6 text-slate-700" />
            <h2 className="text-lg font-bold text-slate-800">
                {purchase ? `Pagar Factura ${purchase.invoiceNumber}` : 'Registrar Pago a Proveedor'}
            </h2>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-800">
            <XIcon className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-hidden flex flex-col">
          <div className="p-6 space-y-6 overflow-y-auto">
            
            <div className="flex justify-between items-center bg-slate-50 p-4 rounded-lg border border-slate-200">
                <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Proveedor</label>
                    <p className="font-bold text-slate-800 text-lg">{supplier.name}</p>
                </div>
                <div className="text-right">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Saldo Total (Deuda)</label>
                    <p className="font-bold text-red-600 text-xl">${supplier.balance.toFixed(2)}</p>
                </div>
            </div>

            {purchase && (
                 <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 text-blue-800 text-sm flex justify-between items-center">
                    <span>Monto de la Factura:</span>
                    <span className="font-bold text-lg">${purchase.total.toFixed(2)}</span>
                 </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Efectivo / Transferencia</label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                            <input
                                type="number"
                                step="0.01"
                                value={cashAmount === 0 ? '' : cashAmount}
                                onChange={e => setCashAmount(Number(e.target.value))}
                                className="w-full pl-7 p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="0.00"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Nota / Comprobante</label>
                        <textarea
                            value={note}
                            onChange={e => setNote(e.target.value)}
                            className="w-full p-2 border border-slate-300 rounded-lg h-24 resize-none focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="Ej: Transferencia bancaria #987..."
                        />
                    </div>
                </div>

                <div className="border border-slate-200 rounded-lg flex flex-col h-64">
                    <div className="p-3 border-b bg-slate-50 font-medium text-slate-700 text-sm flex justify-between items-center">
                        <span>Cheques en Cartera</span>
                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">{availableChecks.length} disp.</span>
                    </div>
                    <div className="overflow-y-auto flex-1 p-2 space-y-2">
                        {availableChecks.length === 0 ? (
                            <p className="text-center text-slate-400 text-sm mt-10">No hay cheques en cartera.</p>
                        ) : (
                            availableChecks.map(check => (
                                <label 
                                    key={check.id} 
                                    className={`flex items-start gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${selectedCheckIds.includes(check.id) ? 'bg-blue-50 border-blue-300' : 'hover:bg-slate-50 border-slate-200'}`}
                                >
                                    <input 
                                        type="checkbox" 
                                        className="mt-1"
                                        checked={selectedCheckIds.includes(check.id)}
                                        onChange={() => handleCheckToggle(check.id)}
                                    />
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-center">
                                            <p className="font-bold text-slate-700 text-sm">${check.amount.toLocaleString('es-AR')}</p>
                                            <span className="text-xs text-slate-500">{check.dueDate}</span>
                                        </div>
                                        <p className="text-xs text-slate-600 truncate">{check.bank} - N° {check.number}</p>
                                        <p className="text-xs text-slate-400 truncate">De: {check.issuer}</p>
                                    </div>
                                </label>
                            ))
                        )}
                    </div>
                </div>
            </div>

            <div className="border-t border-slate-200 pt-4 mt-2">
                <div className="flex justify-end gap-8 text-sm">
                    <div className="text-right">
                        <p className="text-slate-500">Efectivo</p>
                        <p className="font-medium text-slate-700">${cashAmount.toLocaleString('es-AR', {minimumFractionDigits: 2})}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-slate-500">Cheques ({selectedCheckIds.length})</p>
                        <p className="font-medium text-slate-700">${checksTotalAmount.toLocaleString('es-AR', {minimumFractionDigits: 2})}</p>
                    </div>
                    <div className="text-right pl-8 border-l">
                        <p className="text-slate-500 font-bold">TOTAL A PAGAR</p>
                        <p className="font-bold text-green-600 text-xl">${totalPayment.toLocaleString('es-AR', {minimumFractionDigits: 2})}</p>
                    </div>
                </div>
                {totalPayment > supplier.balance && (
                    <p className="text-right text-xs text-amber-600 mt-2 font-medium">
                        ⚠️ El monto supera la deuda actual.
                    </p>
                )}
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
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-green-400 shadow-sm"
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

export default AddSupplierPaymentModal;
