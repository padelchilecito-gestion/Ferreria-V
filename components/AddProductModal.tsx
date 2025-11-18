import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
// import { nanoid } from 'nanoid'; // YA NO ES NECESARIO
import { AppDispatch } from '../store';
import { addProduct } from '../store/productsSlice';
// import { Product } from '../types'; // Ya no usamos Product directamente para crear, sino Omit<Product, 'id'>
import { XIcon } from './Icons';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddProductModal: React.FC<AddProductModalProps> = ({ isOpen, onClose }) => {
  const dispatch = useDispatch<AppDispatch>();
  
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [category, setCategory] = useState('');
  const [supplier, setSupplier] = useState('');
  const [stock, setStock] = useState(0);
  const [minStock, setMinStock] = useState(0);
  const [costPrice, setCostPrice] = useState(0);
  const [retailPrice, setRetailPrice] = useState(0);
  const [wholesalePrice, setWholesalePrice] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false); // Estado de carga local

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Creamos el objeto SIN ID (Firebase lo crea)
    const newProductData = {
      name,
      sku,
      category,
      supplier,
      stock: Number(stock) || 0,
      minStock: Number(minStock) || 0,
      costPrice: Number(costPrice) || 0,
      retailPrice: Number(retailPrice) || 0,
      wholesalePrice: Number(wholesalePrice) || Number(retailPrice),
    };

    try {
      // Esperamos a que Firebase confirme el guardado
      await dispatch(addProduct(newProductData)).unwrap();
      
      // Limpiar y cerrar
      onClose();
      setName('');
      setSku('');
      setCategory('');
      setSupplier('');
      setStock(0);
      setMinStock(0);
      setCostPrice(0);
      setRetailPrice(0);
      setWholesalePrice(0);
    } catch (error) {
      alert("Error al guardar el producto: " + error);
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
          <h2 className="text-lg font-bold text-slate-800">Añadir Nuevo Producto</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-800">
            <XIcon className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-slate-600">Nombre del Producto</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full mt-1 p-2 border border-slate-300 rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-600">SKU / Código</label>
                <input
                  type="text"
                  value={sku}
                  onChange={e => setSku(e.target.value)}
                  className="w-full mt-1 p-2 border border-slate-300 rounded-lg"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-slate-600">Categoría</label>
                <input
                  type="text"
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="w-full mt-1 p-2 border border-slate-300 rounded-lg"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-600">Proveedor</label>
                <input
                  type="text"
                  value={supplier}
                  onChange={e => setSupplier(e.target.value)}
                  className="w-full mt-1 p-2 border border-slate-300 rounded-lg"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-slate-600">Stock Actual</label>
                <input
                  type="number"
                  value={stock}
                  onChange={e => setStock(Number(e.target.value))}
                  className="w-full mt-1 p-2 border border-slate-300 rounded-lg"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-600">Stock Mínimo</label>
                <input
                  type="number"
                  value={minStock}
                  onChange={e => setMinStock(Number(e.target.value))}
                  className="w-full mt-1 p-2 border border-slate-300 rounded-lg"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-slate-600">Precio de Costo</label>
                <input
                  type="number"
                  step="0.01"
                  value={costPrice}
                  onChange={e => setCostPrice(Number(e.target.value))}
                  className="w-full mt-1 p-2 border border-slate-300 rounded-lg"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-600">Precio Minorista</label>
                <input
                  type="number"
                  step="0.01"
                  value={retailPrice}
                  onChange={e => setRetailPrice(Number(e.target.value))}
                  className="w-full mt-1 p-2 border border-slate-300 rounded-lg"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-600">Precio Mayorista</label>
                <input
                  type="number"
                  step="0.01"
                  value={wholesalePrice}
                  onChange={e => setWholesalePrice(Number(e.target.value))}
                  className="w-full mt-1 p-2 border border-slate-300 rounded-lg"
                  placeholder="0.00"
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
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-green-400"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Guardando...' : 'Guardar Producto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductModal;
