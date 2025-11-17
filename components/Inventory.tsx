// components/Inventory.tsx
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux'; // 1. Importar useDispatch
import { RootState, AppDispatch } from '../store';
import { Product } from '../types'; // Importar Product
import { PlusIcon, TrashIcon, PencilIcon } from './Icons'; // 2. Importar iconos
import AddProductModal from './AddProductModal';
import EditProductModal from './EditProductModal'; // 3. Importar modal de edición
import { deleteProduct } from '../store/productsSlice'; // 4. Importar acción de eliminar

const StockBadge: React.FC<{ stock: number; minStock: number }> = ({ stock, minStock }) => {
    // ... (sin cambios) ...
    if (stock === 0) {
        return <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">Sin Stock</span>;
    }
    if (stock <= minStock) {
        return <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-full">Bajo</span>;
    }
    return <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">Alto</span>;
};


const Inventory: React.FC = () => {
    const products = useSelector((state: RootState) => state.products.products);
    const dispatch = useDispatch<AppDispatch>(); // 5. Obtener dispatch

    // 6. Estados para los modales
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [currentProduct, setCurrentProduct] = useState<Product | null>(null);

    // 7. Funciones de manejo de eventos
    const handleEdit = (product: Product) => {
        setCurrentProduct(product);
        setIsEditModalOpen(true);
    };

    const handleDelete = (productId: string, productName: string) => {
        if (window.confirm(`¿Está seguro de que desea eliminar "${productName}"?`)) {
            dispatch(deleteProduct(productId));
        }
    };
    
    return (
        <> 
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 hidden lg:block">Gestión de Inventario</h1>
                    <p className="text-slate-500 mt-1">Busca, filtra y gestiona todos tus productos.</p>
                </div>
                
                <div className="bg-white p-4 rounded-xl shadow-sm">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="w-full md:w-1/3">
                            <input type="text" placeholder="Buscar por Nombre o SKU..." className="w-full p-2 border border-slate-300 rounded-lg" />
                        </div>
                        <div className="flex gap-2 w-full md:w-auto">
                            <select className="p-2 border border-slate-300 rounded-lg">
                                <option>Categoría</option>
                            </select>
                             <select className="p-2 border border-slate-300 rounded-lg">
                                <option>Proveedor</option>
                            </select>
                             <select className="p-2 border border-slate-300 rounded-lg">
                                <option>Nivel de Stock</option>
                            </select>
                        </div>
                        <div className="flex gap-2 w-full md:w-auto">
                            <button className="w-full md:w-auto flex-1 whitespace-nowrap px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50">Ajuste de Stock</button>
                            <button 
                                onClick={() => setIsAddModalOpen(true)}
                                className="w-full md:w-auto flex-1 whitespace-nowrap flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                            >
                                <PlusIcon className="w-5 h-5"/>
                                Nuevo Producto
                            </button>
                        </div>
                    </div>

                    <div className="overflow-x-auto mt-6">
                        <table className="w-full text-left">
                            <thead className="text-xs text-slate-500 uppercase bg-slate-50">
                                <tr>
                                    <th className="px-4 py-3"><input type="checkbox" /></th>
                                    <th className="px-4 py-3">Código/SKU</th>
                                    <th className="px-4 py-3">Nombre</th>
                                    <th className="px-4 py-3">Proveedor</th>
                                    <th className="px-4 py-3">Stock Actual</th>
                                    <th className="px-4 py-3">Precio de Costo</th>
                                    <th className="px-4 py-3">Precio Minorista</th>
                                    <th className="px-4 py-3">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map(product => (
                                    <tr key={product.id} className="border-b border-slate-100 hover:bg-slate-50">
                                        <td className="px-4 py-3"><input type="checkbox" /></td>
                                        <td className="px-4 py-3 font-medium text-slate-700">{product.sku}</td>
                                        <td className="px-4 py-3 text-slate-800">{product.name}</td>
                                        <td className="px-4 py-3 text-slate-600">{product.supplier}</td>
                                        <td className="px-4 py-3"><StockBadge stock={product.stock} minStock={product.minStock} /></td>
                                        <td className="px-4 py-3 text-slate-600">${product.costPrice.toFixed(2)}</td>
                                        <td className="px-4 py-3 font-semibold text-slate-800">${product.retailPrice.toFixed(2)}</td>
                                        <td className="px-4 py-3 text-left">
                                            {/* 9. Botones de Editar y Eliminar */}
                                            <button 
                                                onClick={() => handleEdit(product)}
                                                className="text-blue-600 hover:text-blue-800 px-2"
                                                aria-label={`Editar ${product.name}`}
                                            >
                                                <PencilIcon className="w-4 h-4 inline-block" />
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(product.id, product.name)}
                                                className="text-red-600 hover:text-red-800 px-2"
                                                aria-label={`Eliminar ${product.name}`}
                                            >
                                                <TrashIcon className="w-4 h-4 inline-block" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* 10. Renderizar ambos modales */}
            <AddProductModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
            <EditProductModal 
                isOpen={isEditModalOpen} 
                onClose={() => setIsEditModalOpen(false)} 
                product={currentProduct} 
            />
        </>
    );
};

export default Inventory;
