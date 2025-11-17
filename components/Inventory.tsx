// components/Inventory.tsx
import React, { useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { Product } from '../types';
import { PlusIcon, TrashIcon, PencilIcon } from './Icons';
import AddProductModal from './AddProductModal';
import EditProductModal from './EditProductModal';
import { deleteProduct } from '../store/productsSlice';
import AdjustStockModal from './AdjustStockModal';

// 1. Definir cuántos items mostrar por página
const ITEMS_PER_PAGE = 10;

const StockBadge: React.FC<{ stock: number; minStock: number }> = ({ stock, minStock }) => {
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
    const dispatch = useDispatch<AppDispatch>(); 

    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [supplierFilter, setSupplierFilter] = useState('all');
    const [stockLevelFilter, setStockLevelFilter] = useState('all');

    // 2. Estado para la paginación
    const [currentPage, setCurrentPage] = useState(1);

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
    const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
    const [currentProduct, setCurrentProduct] = useState<Product | null>(null);

    const uniqueCategories = useMemo(() => {
        return [...new Set(products.map(p => p.category).filter(Boolean))];
    }, [products]);

    const uniqueSuppliers = useMemo(() => {
        return [...new Set(products.map(p => p.supplier).filter(Boolean))];
    }, [products]);

    const handleEdit = (product: Product) => {
        setCurrentProduct(product);
        setIsEditModalOpen(true);
    };

    const handleDelete = (productId: string, productName: string) => {
        if (window.confirm(`¿Está seguro de que desea eliminar "${productName}"?`)) {
            dispatch(deleteProduct(productId));
        }
    };
    
    const handleCheckboxChange = (productId: string) => {
        if (selectedProductId === productId) {
            setSelectedProductId(null);
            setCurrentProduct(null);
        } else {
            setSelectedProductId(productId);
            const product = products.find(p => p.id === productId);
            setCurrentProduct(product || null);
        }
    };
    
    const handleOpenAdjustModal = () => {
        if (currentProduct) {
            setIsAdjustModalOpen(true);
        }
    };
    
    // 3. Lógica de filtrado (sin cambios)
    const filteredProducts = products.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              p.sku.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter;
        const matchesSupplier = supplierFilter === 'all' || p.supplier === supplierFilter;
        const matchesStockLevel = stockLevelFilter === 'all' ||
            (stockLevelFilter === 'low' && p.stock <= p.minStock && p.stock > 0) ||
            (stockLevelFilter === 'out' && p.stock === 0) ||
            (stockLevelFilter === 'high' && p.stock > p.minStock);
        return matchesSearch && matchesCategory && matchesSupplier && matchesStockLevel;
    });

    // 4. Lógica de paginación
    const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
    const paginatedProducts = filteredProducts.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
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
                            <input 
                                type="text" 
                                placeholder="Buscar por Nombre o SKU..." 
                                className="w-full p-2 border border-slate-300 rounded-lg"
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-2 w-full md:w-auto">
                            <select 
                                className="p-2 border border-slate-300 rounded-lg"
                                value={categoryFilter}
                                onChange={e => setCategoryFilter(e.target.value)}
                            >
                                <option value="all">Categoría (Todas)</option>
                                {uniqueCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                            </select>
                             <select 
                                className="p-2 border border-slate-300 rounded-lg"
                                value={supplierFilter}
                                onChange={e => setSupplierFilter(e.target.value)}
                             >
                                <option value="all">Proveedor (Todos)</option>
                                {uniqueSuppliers.map(sup => <option key={sup} value={sup}>{sup}</option>)}
                            </select>
                             <select 
                                className="p-2 border border-slate-300 rounded-lg"
                                value={stockLevelFilter}
                                onChange={e => setStockLevelFilter(e.target.value)}
                             >
                                <option value="all">Nivel de Stock (Todos)</option>
                                <option value="high">Alto</option>
                                <option value="low">Bajo</option>
                                <option value="out">Sin Stock</option>
                            </select>
                        </div>
                        <div className="flex gap-2 w-full md:w-auto">
                            <button 
                                className="w-full md:w-auto flex-1 whitespace-nowrap px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                onClick={handleOpenAdjustModal}
                                disabled={!selectedProductId}
                            >
                                Ajuste de Stock
                            </button>
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
                                    <th className="px-4 py-3"><input type="checkbox" disabled /></th>
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
                                {/* 5. Mapear sobre paginatedProducts */}
                                {paginatedProducts.map(product => (
                                    <tr key={product.id} className={`border-b border-slate-100 ${selectedProductId === product.id ? 'bg-blue-50' : 'hover:bg-slate-50'}`}>
                                        <td className="px-4 py-3">
                                            <input 
                                                type="checkbox" 
                                                checked={selectedProductId === product.id}
                                                onChange={() => handleCheckboxChange(product.id)}
                                            />
                                        </td>
                                        <td className="px-4 py-3 font-medium text-slate-700">{product.sku}</td>
                                        <td className="px-4 py-3 text-slate-800">{product.name}</td>
                                        <td className="px-4 py-3 text-slate-600">{product.supplier}</td>
                                        <td className="px-4 py-3"><StockBadge stock={product.stock} minStock={product.minStock} /></td>
                                        <td className="px-4 py-3 text-slate-600">${product.costPrice.toFixed(2)}</td>
                                        <td className="px-4 py-3 font-semibold text-slate-800">${product.retailPrice.toFixed(2)}</td>
                                        <td className="px-4 py-3 text-left">
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

                    {/* 6. Controles de Paginación */}
                    <div className="flex justify-between items-center mt-4 text-sm">
                        <span className="text-slate-600">
                            Mostrando {Math.min((currentPage - 1) * ITEMS_PER_PAGE + 1, filteredProducts.length)} - {Math.min(currentPage * ITEMS_PER_PAGE, filteredProducts.length)} de {filteredProducts.length} productos
                        </span>
                        <div className="flex gap-2">
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="px-3 py-1 border rounded-md bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                &lt; Anterior
                            </button>
                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages || totalPages === 0}
                                className="px-3 py-1 border rounded-md bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Siguiente &gt;
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <AddProductModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
            <EditProductModal 
                isOpen={isEditModalOpen} 
                onClose={() => setIsEditModalOpen(false)} 
                product={currentProduct} 
            />
            <AdjustStockModal
                isOpen={isAdjustModalOpen}
                onClose={() => {
                    setIsAdjustModalOpen(false);
                    setSelectedProductId(null);
                    setCurrentProduct(null);
                }}
                product={currentProduct}
            />
        </>
    );
};

export default Inventory;
