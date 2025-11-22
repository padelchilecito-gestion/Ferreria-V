// components/Purchases.tsx
import React, { useState, useMemo, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { Purchase, Supplier } from '../types';
import { SearchIcon, CurrencyDollarIcon, CheckCircleIcon } from './Icons';
import { selectAllPurchases, selectAllSuppliers } from '../store/selectors';
import AddSupplierPaymentModal from './AddSupplierPaymentModal'; // Importamos el modal

const ITEMS_PER_PAGE = 10;

const StatusBadge: React.FC<{ status: Purchase['status'] }> = ({ status }) => {
    const styles = {
        'Pendiente de pago': 'bg-yellow-100 text-yellow-800',
        'Pagada': 'bg-green-100 text-green-800',
    };
    return <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status]}`}>{status}</span>;
};

const Purchases: React.FC = () => {
    const allPurchases = useSelector(selectAllPurchases);
    const allSuppliers = useSelector(selectAllSuppliers);
    
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [supplierFilter, setSupplierFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    
    // Estados para el modal de pago
    const [isPayModalOpen, setIsPayModalOpen] = useState(false);
    const [selectedPurchase, setSelectedPurchase] = useState<Purchase | null>(null);
    const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);

    const filteredPurchases = useMemo(() => {
        return allPurchases.filter(p => {
            const matchesSearch = p.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              p.supplierName.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
            const matchesSupplier = supplierFilter === 'all' || p.supplierId === supplierFilter;
            return matchesSearch && matchesStatus && matchesSupplier;
        }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [allPurchases, searchTerm, statusFilter, supplierFilter]);

    const totalPages = Math.ceil(filteredPurchases.length / ITEMS_PER_PAGE);
    const paginatedPurchases = filteredPurchases.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, statusFilter, supplierFilter]);

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    const handleOpenPayModal = (purchase: Purchase) => {
        const supplier = allSuppliers.find(s => s.id === purchase.supplierId);
        if (supplier) {
            setSelectedSupplier(supplier);
            setSelectedPurchase(purchase);
            setIsPayModalOpen(true);
        } else {
            alert("No se encontró la información del proveedor.");
        }
    };

    return (
        <> 
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 hidden lg:block">Historial de Compras</h1>
                    <p className="text-slate-500 mt-1">Busque y filtre todas las facturas de compra registradas a proveedores.</p>
                </div>

                <div className="bg-white p-4 rounded-xl shadow-sm">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
                        <div className="relative w-full md:w-1/3">
                            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input 
                                type="text" 
                                placeholder="Buscar por N° Factura o Proveedor..." 
                                className="w-full p-2 pl-10 border border-slate-300 rounded-lg"
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                            />
                        </div>
                        
                        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                            <select 
                                className="p-2 border border-slate-300 rounded-lg"
                                value={statusFilter}
                                onChange={e => setStatusFilter(e.target.value)}
                            >
                                <option value="all">Estado (Todos)</option>
                                <option value="Pendiente de pago">Pendiente de pago</option>
                                <option value="Pagada">Pagada</option>
                            </select>
                            <select 
                                className="p-2 border border-slate-300 rounded-lg"
                                value={supplierFilter}
                                onChange={e => setSupplierFilter(e.target.value)}
                            >
                                <option value="all">Proveedor (Todos)</option>
                                {allSuppliers.map(s => (
                                    <option key={s.id} value={s.id}>{s.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="text-xs text-slate-500 uppercase bg-slate-50">
                                <tr>
                                    <th className="px-4 py-3">Fecha</th>
                                    <th className="px-4 py-3">N° Factura</th>
                                    <th className="px-4 py-3">Proveedor</th>
                                    <th className="px-4 py-3">Items</th>
                                    <th className="px-4 py-3">Flete</th>
                                    <th className="px-4 py-3">Total</th>
                                    <th className="px-4 py-3">Estado</th>
                                    <th className="px-4 py-3">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedPurchases.map(purchase => (
                                    <tr key={purchase.id} className="border-b border-slate-100 hover:bg-slate-50">
                                        <td className="px-4 py-3 text-slate-600">{new Date(purchase.date).toLocaleDateString()}</td>
                                        <td className="px-4 py-3 font-medium text-slate-700">{purchase.invoiceNumber}</td>
                                        <td className="px-4 py-3 text-slate-700">{purchase.supplierName}</td>
                                        <td className="px-4 py-3 text-slate-600">{purchase.items.length}</td>
                                        <td className="px-4 py-3 text-slate-600">${(purchase.freightCost || 0).toLocaleString('es-AR', { minimumFractionDigits: 2 })}</td>
                                        <td className="px-4 py-3 font-semibold text-slate-800">${purchase.total.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                        <td className="px-4 py-3"><StatusBadge status={purchase.status} /></td>
                                        <td className="px-4 py-3 text-left whitespace-nowrap">
                                            {purchase.status === 'Pendiente de pago' ? (
                                                <button 
                                                    onClick={() => handleOpenPayModal(purchase)}
                                                    className="text-blue-600 hover:text-blue-800 px-2 flex items-center gap-1"
                                                    title="Pagar Factura"
                                                >
                                                    <CurrencyDollarIcon className="w-5 h-5" />
                                                    <span className="text-sm font-medium">Pagar</span>
                                                </button>
                                            ) : (
                                                <span className="text-green-600 flex items-center gap-1 px-2">
                                                    <CheckCircleIcon className="w-5 h-5" />
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex justify-between items-center mt-4 text-sm">
                        <span className="text-slate-600">
                            Mostrando {Math.min((currentPage - 1) * ITEMS_PER_PAGE + 1, filteredPurchases.length) || 0} - {Math.min(currentPage * ITEMS_PER_PAGE, filteredPurchases.length)} de {filteredPurchases.length} compras
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

            {/* Modal de Pago, ahora reutilizable */}
            <AddSupplierPaymentModal
                isOpen={isPayModalOpen}
                onClose={() => setIsPayModalOpen(false)}
                supplier={selectedSupplier}
                purchase={selectedPurchase}
            />
        </>
    );
};

export default Purchases;
