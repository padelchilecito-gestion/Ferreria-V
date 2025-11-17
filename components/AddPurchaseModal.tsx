// components/AddPurchaseModal.tsx
import React, { useState } in 'react';
import { useSelector, useDispatch } from 'react-redux';
import { nanoid } from 'nanoid';
import { AppDispatch, RootState } from '../store';
import { Product, Supplier, Purchase, PurchaseItem } from '../types';
import { addPurchase } from '../store/purchasesSlice';
import { increaseStock } from '../store/productsSlice';
import { updateSupplierBalance } from '../store/suppliersSlice';
import { XIcon, ShoppingBagIcon, TrashIcon, PlusIcon } from './Icons';

interface AddPurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddPurchaseModal: React.FC<AddPurchaseModalProps> = ({ isOpen, onClose }) => {
  const dispatch = useDispatch<AppDispatch>();
  const allProducts = useSelector((state: RootState) => state.products.products);
  const allSuppliers = useSelector((state: RootState) => state.suppliers.suppliers);

  // Estado para el formulario principal
  const [supplierId, setSupplierId] = useState('');
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [items, setItems] = useState<PurchaseItem[]>([]);
  
  // Estado para el sub-formulario de añadir item
  const [currentProductId, setCurrentProductId] = useState('');
  const [currentQuantity, setCurrentQuantity] = useState(1);
  const [currentCost, setCurrentCost] = useState(0);

  // Limpiar el modal al cerrar
  const handleClose = () => {
    setSupplierId('');
    setInvoiceNumber('');
    setItems([]);
    setCurrentProductId('');
    setCurrentQuantity(1);
    setCurrentCost(0);
    onClose();
  };

  // Añadir un producto a la lista de items de la compra
  const handleAddItem = () => {
    const product = allProducts.find(p => p.id === currentProductId);
    if (!product) {
      alert('Por favor seleccione un producto válido.');
      return;
    }
    
    // Prevenir items duplicados (opcional, mejor editar cantidad)
    const existingItem = items.find(i => i.productId === product.id);
    if(existingItem) {
      alert('Ese producto ya está en la lista. Edite la cantidad si es necesario.');
      return;
    }

    const newItem: PurchaseItem = {
      productId: product.id,
      name: product.name,
      quantity: Number(currentQuantity) || 1,
      costPrice: Number(currentCost) || product.costPrice, // Usar costo nuevo o el guardado
    };
    
    setItems([...items, newItem]);
    
    // Resetear formulario de item
    setCurrentProductId('');
    setCurrentQuantity(1);
    setCurrentCost(0);
  };

  // Quitar un producto de la lista
  const handleRemoveItem = (productId: string) => {
    setItems(items.filter(i => i.productId !== productId));
  };

  // Calcular el total de la compra
  const totalPurchase = items.reduce((acc, item) => acc + (item.costPrice * item.quantity), 0);

  // Guardar la compra
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!supplierId) {
        alert('Por favor seleccione un proveedor.');
        return;
    }
    if (items.length === 0) {
        alert('Por favor añada al menos un producto a la compra.');
        return;
    }

    const supplier = allSuppliers.find(s => s.id === supplierId);
    if (!supplier) return; // No debería pasar

    // 1. Crear el objeto de Compra
    const newPurchase: Purchase = {
        id: nanoid(),
        date: new Date().toISOString(),
        supplierId: supplier.id,
        supplierName: supplier.name,
        invoiceNumber: invoiceNumber || 'S/N',
        items: items,
        total: totalPurchase,
        status: 'Pendiente de pago', // Por defecto, la compra queda pendiente de pago
    };

    // 2. Despachar la acción para guardar la compra
    dispatch(addPurchase(newPurchase));

    // 3. Despachar la acción para incrementar el stock de CADA producto
    items.forEach(item => {
        dispatch(increaseStock({
            productId: item.productId,
            quantity: item.quantity
        }));
    });

    // 4. Despachar la acción para actualizar el saldo (deuda) con el proveedor
    dispatch(updateSupplierBalance({
        supplierId: supplier.id,
        dueAmount: totalPurchase // Sumamos el total de la factura a nuestra deuda
    }));
    
    // 5. Limpiar y cerrar
    handleClose();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div 
      className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center"
      onClick={handleClose}
    >
      <div 
        className="bg-white w-full max-w-3xl rounded-xl shadow-lg flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <div className="flex items-center gap-3">
            <ShoppingBagIcon className="w-6 h-6 text-slate-700" />
            <h2 className="text-lg font-bold text-slate-800">Registrar Nueva Compra</h2>
          </div>
          <button onClick={handleClose} className="text-slate-500 hover:text-slate-800">
            <XIcon className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-hidden flex flex-col">
          {/* Contenido del formulario con scroll */}
          <div className="p-6 space-y-4 overflow-y-auto max-h-[70vh]">
            
            {/* Sección Proveedor y Factura */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-slate-600">Proveedor</label>
                <select
                  value={supplierId}
                  onChange={e => setSupplierId(e.target.value)}
                  className="w-full mt-1 p-2 border border-slate-300 rounded-lg"
                  required
                >
                  <option value="" disabled>Seleccione un proveedor</option>
                  {allSuppliers.filter(s => s.status === 'Active').map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-600">N° de Factura/Remito</label>
                <input
                  type="text"
                  value={invoiceNumber}
                  onChange={e => setInvoiceNumber(e.target.value)}
                  className="w-full mt-1 p-2 border border-slate-300 rounded-lg"
                  placeholder="Ej: F-0001-00123"
                />
              </div>
            </div>

            {/* Sección Añadir Items */}
            <div className="border border-slate-200 rounded-lg p-4 space-y-3">
                <h3 className="font-semibold text-slate-700">Añadir Productos a la Compra</h3>
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                    <div className="md:col-span-5">
                        <label className="text-xs font-medium text-slate-600">Producto</label>
                        <select 
                            value={currentProductId}
                            onChange={e => {
                                setCurrentProductId(e.target.value);
                                // Auto-rellenar costo al seleccionar
                                const prod = allProducts.find(p => p.id === e.target.value);
                                if (prod) setCurrentCost(prod.costPrice);
                            }}
                            className="w-full mt-1 p-2 border border-slate-300 rounded-lg text-sm"
                        >
                            <option value="" disabled>Seleccione un producto</option>
                            {allProducts.map(p => (
                                <option key={p.id} value={p.id}>{p.name} ({p.sku})</option>
                            ))}
                        </select>
                    </div>
                    <div className="md:col-span-2">
                        <label className="text-xs font-medium text-slate-600">Cantidad</label>
                        <input
                            type="number"
                            value={currentQuantity}
                            onChange={e => setCurrentQuantity(Number(e.target.value))}
                            className="w-full mt-1 p-2 border border-slate-300 rounded-lg text-sm"
                        />
                    </div>
                     <div className="md:col-span-3">
                        <label className="text-xs font-medium text-slate-600">Costo Unitario ($)</label>
                        <input
                            type="number"
                            step="0.01"
                            value={currentCost}
                            onChange={e => setCurrentCost(Number(e.target.value))}
                            className="w-full mt-1 p-2 border border-slate-300 rounded-lg text-sm"
                        />
                    </div>
                    <div className="md:col-span-2 flex items-end">
                        <button
                            type="button"
                            onClick={handleAddItem}
                            className="w-full mt-1 p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex justify-center items-center"
                            aria-label="Añadir item"
                        >
                            <PlusIcon className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Sección Items Añadidos */}
            <div className="space-y-2">
                <h3 className="font-semibold text-slate-700">Items en la Compra</h3>
                {items.length === 0 ? (
                    <p className="text-sm text-slate-500 text-center py-4">Aún no hay productos en la compra.</p>
                ) : (
                    <table className="w-full text-left text-sm">
                        <thead className="text-xs text-slate-500 uppercase bg-slate-50">
                            <tr>
                                <th className="px-3 py-2">Producto</th>
                                <th className="px-3 py-2">Cant.</th>
                                <th className="px-3 py-2">Costo Unit.</th>
                                <th className="px-3 py-2">Subtotal</th>
                                <th className="px-3 py-2"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map(item => (
                                <tr key={item.productId} className="border-b">
                                    <td className="px-3 py-2 font-medium text-slate-700">{item.name}</td>
                                    <td className="px-3 py-2">{item.quantity}</td>
                                    <td className="px-3 py-2">${item.costPrice.toFixed(2)}</td>
                                    <td className="px-3 py-2 font-semibold">${(item.costPrice * item.quantity).toFixed(2)}</td>
                                    <td className="px-3 py-2 text-right">
                                        <button 
                                            type="button" 
                                            onClick={() => handleRemoveItem(item.productId)}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            <TrashIcon className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Total */}
            <div className="flex justify-end mt-4">
                <div className="text-right">
                    <span className="text-sm text-slate-600">TOTAL DE LA COMPRA</span>
                    <p className="text-2xl font-bold text-slate-800">${totalPurchase.toFixed(2)}</p>
                </div>
            </div>

          </div>

          {/* Pie del Modal */}
          <div className="p-4 border-t bg-slate-50 rounded-b-xl flex justify-end gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Guardar Compra
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPurchaseModal;
