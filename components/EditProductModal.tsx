// components/EditProductModal.tsx
import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../store';
import { updateProduct } from '../store/productsSlice';
import { Product } from '../types';
import { XIcon } from './Icons';

interface EditProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
}

const EditProductModal: React.FC<EditProductModalProps> = ({ isOpen, onClose, product }) => {
  const dispatch = useDispatch<AppDispatch>();
  
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [category, setCategory] = useState('');
  const [supplier, setSupplier] = useState('');
  const [stock, setStock] = useState(0);
  const [minStock, setMinStock] = useState(0);
  const [costPrice, setCostPrice] = useState(0);
  const [retailPrice, setRetailPrice] = useState(0);
  // 1. Añadir estado para precio mayorista
  const [wholesalePrice, setWholesalePrice] = useState(0);

  // 2. Rellenar el formulario cuando el producto cambia
  useEffect(() => {
    if (product) {
      setName(product.name);
      setSku(product.sku);
      setCategory(product.category);
      setSupplier(product.supplier);
      setStock(product.stock);
      setMinStock(product.minStock);
      setCostPrice(product.costPrice);
      setRetailPrice(product.retailPrice);
      setWholesalePrice(product.wholesalePrice || 0); // Añadir
    }
  }, [product, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;

    const updatedProduct: Product = {
      ...product, // Mantenemos el ID
      name,
      sku,
      category,
      supplier,
      stock: Number(stock) || 0,
      minStock: Number(minStock) || 0,
      costPrice: Number(costPrice) || 0,
      retailPrice: Number(retailPrice) || 0,
      wholesalePrice: Number(wholesalePrice) || Number(retailPrice), // 3. Añadir. Si es 0, usa el minorista.
    };

    dispatch(updateProduct(updatedProduct));
    onClose();
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
          <h2 className="text-lg font-bold text-slate-800">Editar Producto</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-800">
            <XIcon className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-slate-600">Nombre del Producto</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full mt-1 p-2 border border-slate-300 rounded-lg" required />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-600">SKU / Código</label>
                <input type="text" value={sku} onChange={e => setSku(e.target.value)} className="w-full mt-1 p-2 border border-slate-300 rounded-lg" required />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-slate-600">Categoría</label>
                <input type="text" value={category} onChange={e => setCategory(e.target.value)} className="w-full mt-1 p-2 border border-slate-300 rounded-lg" />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-600">Proveedor</label>
                <input type="text" value={supplier} onChange={e => setSupplier(e.target.value)} className="w-full mt-1 p-2 border border-slate-300 rounded-lg" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-slate-600">Stock Actual</label>
                <input type="number" value={stock} onChange={e => setStock(Number(e.target.value))} className="w-full mt-1 p-2 border border-slate-300 rounded-lg" />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-600">Stock Mínimo</label>
                <input type="number" value={minStock} onChange={e => setMinStock(Number(e.target.value))} className="w-full mt-1 p-2 border border-slate-300 rounded-lg" />
              </div>
            </div>
            
            {/* 4. Añadir campo de Precio Mayorista */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-slate-600">Precio de Costo</label>
                <input type="number" step="0.01" value={costPrice} onChange={e => setCostPrice(Number(e.target.value))} className="w-full mt-1 p-2 border border-slate-300 rounded-lg" />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-600">Precio Minorista</label>
                <input type="number" step="0.01" value={retailPrice} onChange={e => setRetailPrice(Number(e.target.value))} className="w-full mt-1 p-2 border border-slate-300 rounded-lg" />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-600">Precio Mayorista</label>
                <input type="number" step="0.01" value={wholesalePrice} onChange={e => setWholesalePrice(Number(e.target.value))} className="w-full mt-1 p-2 border border-slate-300 rounded-lg" />
              </div>
            </div>

          </div>

          <div className="p-4 border-t bg-slate-50 rounded-b-xl flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50">Cancelar</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Guardar Cambios</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProductModal;
