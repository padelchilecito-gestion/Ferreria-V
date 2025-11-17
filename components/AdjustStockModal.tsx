// components/AdjustStockModal.tsx
import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../store';
import { adjustStock } from '../store/productsSlice';
import { Product } from '../types';
import { XIcon, ArchiveBoxIcon } from './Icons';

interface AdjustStockModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
}

const AdjustStockModal: React.FC<AdjustStockModalProps> = ({ isOpen, onClose, product }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [newStock, setNewStock] = useState(0);

  // Pre-rellenar el campo con el stock actual cuando el modal se abre
  useEffect(() => {
    if (product) {
      setNewStock(product.stock);
    }
  }, [product, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;

    // Despachar la nueva acción
    dispatch(adjustStock({ id: product.id, newStock: Number(newStock) }));
    
    onClose();
  };

  if (!isOpen || !product) {
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
            <ArchiveBoxIcon className="w-6 h-6 text-slate-700" />
            <h2 className="text-lg font-bold text-slate-800">Ajustar Stock</h2>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-800">
            <XIcon className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-600">Producto</label>
              <p className="font-semibold text-slate-800 text-lg">{product.name}</p>
              <p className="text-sm text-slate-500">SKU: {product.sku}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-slate-600">Stock Actual</label>
                <div className="mt-1 p-2 border border-slate-300 rounded-lg bg-slate-50 text-slate-700">
                  {product.stock}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-600">Nuevo Stock Total</label>
                <input
                  type="number"
                  value={newStock}
                  onChange={e => setNewStock(Number(e.target.value))}
                  className="w-full mt-1 p-2 border border-slate-300 rounded-lg"
                  required
                />
              </div>
            </div>
            <p className="text-xs text-slate-500">
              Ingrese la cantidad total que debe haber en stock. Por ejemplo, si el stock actual es 5 y añade 10, el nuevo stock total es 15.
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
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Guardar Ajuste
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdjustStockModal;
