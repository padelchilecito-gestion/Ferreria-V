import React from 'react';
// import { mockSuppliers } from '../data/mockData'; // <-- 1. Ya no importamos mocks
import { useSelector } from 'react-redux'; // <-- 2. Importar useSelector
import { RootState } from '../store'; // <-- 3. Importar RootState
import { Supplier } from '../types';
import { PlusIcon, SearchIcon } from './Icons';

const StatusBadge: React.FC<{ status: Supplier['status'] }> = ({ status }) => {
    const styles = {
        Active: 'bg-green-100 text-green-800',
        Inactive: 'bg-red-100 text-red-800',
        Pending: 'bg-yellow-100 text-yellow-800',
    };
    return <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status]}`}>{status}</span>;
};

const Suppliers: React.FC = () => {
    // 4. Leer los proveedores desde el store global
    const mockSuppliers = useSelector((state: RootState) => state.suppliers.suppliers);

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                 <div>
                    <h1 className="text-2xl font-bold text-slate-800 hidden lg:block">Gestión de Proveedores</h1>
                    <p className="text-slate-500 mt-1">Administre la información y el estado de sus proveedores.</p>
                </div>
                 <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
                    <PlusIcon className="w-5 h-5" />
                    Agregar Proveedor
                </button>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-sm">
                <div className="relative mb-4">
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input type="text" placeholder="Buscar por Nombre, CUIT/DNI..." className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg" />
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="text-xs text-slate-500 uppercase bg-slate-50">
                            <tr>
                                <th className="px-4 py-3"><input type="checkbox" /></th>
                                <th className="px-4 py-3">Nombre o Razón Social</th>
                                <th className="px-4 py-3">CUIT/DNI</th>
                                <th className="px-4 py-3">Teléfono</th>
                                <th className="px-4 py-3">Email</th>
                                <th className="px-4 py-3">Status</th>
                                <th className="px-4 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* 5. Mapear 'mockSuppliers' desde el store */}
                            {mockSuppliers.map(supplier => (
                                <tr key={supplier.id} className="border-b border-slate-100 hover:bg-slate-50">
                                    <td className="px-4 py-3"><input type="checkbox" /></td>
                                    <td className="px-4 py-3 font-medium text-slate-700">{supplier.name}</td>
                                    <td className="px-4 py-3 text-slate-600">{supplier.cuit}</td>
                                    <td className="px-4 py-3 text-slate-600">{supplier.phone}</td>
                                    <td className="px-4 py-3 text-slate-600">{supplier.email}</td>
                                    <td className="px-4 py-3"><StatusBadge status={supplier.status} /></td>
                                    <td className="px-4 py-3 text-center">...</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="flex justify-center items-center gap-2 mt-4 text-sm">
                    <button className="px-3 py-1 border rounded-md">&lt;</button>
                    <button className="px-3 py-1 border rounded-md bg-blue-600 text-white">1</button>
                    <button className="px-3 py-1 border rounded-md">2</button>
                    <button className="px-3 py-1 border rounded-md">3</button>
                    <span>...</span>
                    <button className="px-3 py-1 border rounded-md">10</button>
                    <button className="px-3 py-1 border rounded-md">&gt;</button>
                </div>
            </div>
        </div>
    );
};

export default Suppliers;
