import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { Supplier } from '../types';
import { PlusIcon, SearchIcon, TrashIcon } from './Icons';
import { deleteSupplier } from '../store/suppliersSlice';
import AddSupplierModal from './AddSupplierModal';
import EditSupplierModal from './EditSupplierModal';

const StatusBadge: React.FC<{ status: Supplier['status'] }> = ({ status }) => {
    const styles = {
        Active: 'bg-green-100 text-green-800',
        Inactive: 'bg-red-100 text-red-800',
        Pending: 'bg-yellow-100 text-yellow-800',
    };
    return <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status]}`}>{status}</span>;
};

const Suppliers: React.FC = () => {
    const suppliers = useSelector((state: RootState) => state.suppliers.suppliers);
    const dispatch = useDispatch<AppDispatch>();

    const [searchTerm, setSearchTerm] = useState('');
    // 1. Estado para el filtro de estado
    const [statusFilter, setStatusFilter] = useState('all');

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [currentSupplier, setCurrentSupplier] = useState<Supplier | null>(null);

    const handleEdit = (supplier: Supplier) => {
        setCurrentSupplier(supplier);
        setIsEditModalOpen(true);
    };

    const handleDelete = (supplierId: string, supplierName: string) => {
        if (window.confirm(`¿Está seguro de que desea eliminar a ${supplierName}?`)) {
            dispatch(deleteSupplier(supplierId));
        }
    };

    // 2. Filtramos los proveedores (combinando búsqueda y filtro)
    const filteredSuppliers = suppliers.filter(s => {
        const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              s.cuit.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesStatus = statusFilter === 'all' || s.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    return (
        <> 
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800 hidden lg:block">Gestión de Proveedores</h1>
                        <p className="text-slate-500 mt-1">Administre la información y el estado de sus proveedores.</p>
                    </div>
                    <button 
                        onClick={() => setIsAddModalOpen(true)}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                    >
                        <PlusIcon className="w-5 h-5" />
                        Agregar Proveedor
                    </button>
                </div>

                <div className="bg-white p-4 rounded-xl shadow-sm">
                    {/* 3. Contenedor para los filtros */}
                    <div className="flex flex-col sm:flex-row gap-4 mb-4">
                        <div className="relative flex-1">
                            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input 
                                type="text" 
                                placeholder="Buscar por Nombre, CUIT/DNI..." 
                                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg"
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <select 
                            className="p-2 border border-slate-300 rounded-lg"
                            value={statusFilter}
                            onChange={e => setStatusFilter(e.target.value)}
                        >
                            <option value="all">Estado (Todos)</option>
                            <option value="Active">Activo</option>
                            <option value="Inactive">Inactivo</option>
                            <option value="Pending">Pendiente</option>
                        </select>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="text-xs text-slate-500 uppercase bg-slate-50">
                                <tr>
                                    <th className="px-4 py-3">Nombre o Razón Social</th>
                                    <th className="px-4 py-3">CUIT/DNI</th>
                                    <th className="px-4 py-3">Teléfono</th>
                                    <th className="px-4 py-3">Email</th>
                                    <th className="px-4 py-3">Status</th>
                                    <th className="px-4 py-3">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* 4. Mapear sobre filteredSuppliers */}
                                {filteredSuppliers.map(supplier => (
                                    <tr key={supplier.id} className="border-b border-slate-100 hover:bg-slate-50">
                                        <td className="px-4 py-3 font-medium text-slate-700">{supplier.name}</td>
                                        <td className="px-4 py-3 text-slate-600">{supplier.cuit}</td>
                                        <td className="px-4 py-3 text-slate-600">{supplier.phone}</td>
                                        <td className="px-4 py-3 text-slate-600">{supplier.email}</td>
                                        <td className="px-4 py-3"><StatusBadge status={supplier.status} /></td>
                                        <td className="px-4 py-3 text-center">
                                            <button 
                                                onClick={() => handleEdit(supplier)}
                                                className="text-blue-600 hover:text-blue-800 px-2"
                                            >
                                                Editar
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(supplier.id, supplier.name)}
                                                className="text-red-600 hover:text-red-800 px-2"
                                            >
                                                <TrashIcon className="w-4 h-4 inline-block" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {/* ... (Paginación estática, la dejamos para después) ... */}
                </div>
            </div>
            
            <AddSupplierModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
            <EditSupplierModal 
                isOpen={isEditModalOpen} 
                onClose={() => setIsEditModalOpen(false)} 
                supplier={currentSupplier} 
            />
        </>
    );
};

export default Suppliers;
