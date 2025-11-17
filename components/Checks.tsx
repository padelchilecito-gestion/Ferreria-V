// components/Checks.tsx
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { Check } from '../types';
import { PlusIcon, PencilIcon } from './Icons';
import AddCheckModal from './AddCheckModal';
import UpdateCheckStatusModal from './UpdateCheckStatusModal';

// 1. Definir items por página
const ITEMS_PER_PAGE = 10;

const StatusBadge: React.FC<{ status: Check['status'] }> = ({ status }) => {
    const styles = {
        'En cartera': 'bg-blue-100 text-blue-800',
        'Depositado': 'bg-indigo-100 text-indigo-800',
        'Cobrado': 'bg-green-100 text-green-800',
        'Rechazado': 'bg-red-100 text-red-800',
    };
    return <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status]}`}>{status}</span>;
};

const Checks: React.FC = () => {
    const checks = useSelector((state: RootState) => state.checks.checks);
    const dispatch = useDispatch<AppDispatch>(); 

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [startDateFilter, setStartDateFilter] = useState('');
    const [endDateFilter, setEndDateFilter] = useState('');

    // 2. Estado para paginación
    const [currentPage, setCurrentPage] = useState(1);

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [currentCheck, setCurrentCheck] = useState<Check | null>(null);

    const handleUpdateStatus = (check: Check) => {
        setCurrentCheck(check);
        setIsUpdateModalOpen(true);
    };

    const filteredChecks = checks.filter(c => {
        const matchesSearch = c.issuer.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              c.number.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
        const matchesStartDate = !startDateFilter || c.dueDate >= startDateFilter;
        const matchesEndDate = !endDateFilter || c.dueDate <= endDateFilter;
        return matchesSearch && matchesStatus && matchesStartDate && matchesEndDate;
    });

    // 3. Lógica de paginación
    const totalPages = Math.ceil(filteredChecks.length / ITEMS_PER_PAGE);
    const paginatedChecks = filteredChecks.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    // Resetear página a 1 cuando cambian los filtros
    React.useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, statusFilter, startDateFilter, endDateFilter]);

    return (
        <> 
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 hidden lg:block">Gestión de Cartera de Cheques</h1>
                    <p className="text-slate-500 mt-1">Controle todos los cheques en cartera, filtrándolos y actualizando su estado.</p>
                </div>

                <div className="bg-white p-4 rounded-xl shadow-sm">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
                        <input 
                            type="text" 
                            placeholder="Buscar por número o emisor..." 
                            className="w-full md:w-1/3 p-2 border border-slate-300 rounded-lg"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                            <select 
                                className="p-2 border border-slate-300 rounded-lg"
                                value={statusFilter}
                                onChange={e => setStatusFilter(e.target.value)}
                            >
                                <option value="all">Estado (Todos)</option>
                                <option value="En cartera">En cartera</option>
                                <option value="Depositado">Depositado</option>
                                <option value="Cobrado">Cobrado</option>
                                <option value="Rechazado">Rechazado</option>
                            </select>
                            <input 
                                type="date" 
                                className="p-2 border border-slate-300 rounded-lg"
                                value={startDateFilter}
                                onChange={e => setStartDateFilter(e.target.value)}
                                title="Vencimiento Desde"
                            />
                            <input 
                                type="date" 
                                className="p-2 border border-slate-300 rounded-lg"
                                value={endDateFilter}
                                onChange={e => setEndDateFilter(e.target.value)}
                                title="Vencimiento Hasta"
                            />
                        </div>
                        <button 
                            onClick={() => setIsAddModalOpen(true)}
                            className="w-full md:w-auto whitespace-nowrap flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                            <PlusIcon className="w-5 h-5"/>
                            Registrar Cheque
                        </button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="text-xs text-slate-500 uppercase bg-slate-50">
                                <tr>
                                    <th className="px-4 py-3">Banco</th>
                                    <th className="px-4 py-3">Número</th>
                                    <th className="px-4 py-3">Emisor</th>
                                    <th className="px-4 py-3">Fecha de Emisión</th>
                                    <th className="px-4 py-3">Fecha de Cobro</th>
                                    <th className="px-4 py-3">Importe</th>
                                    <th className="px-4 py-3">Estado</th>
                                    <th className="px-4 py-3">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* 4. Mapear sobre paginatedChecks */}
                                {paginatedChecks.map(check => (
                                    <tr key={check.id} className="border-b border-slate-100 hover:bg-slate-50">
                                        <td className="px-4 py-3 font-medium text-slate-700">{check.bank}</td>
                                        <td className="px-4 py-3 text-slate-600">{check.number}</td>
                                        <td className="px-4 py-3 text-slate-700">{check.issuer}</td>
                                        <td className="px-4 py-3 text-slate-600">{check.issueDate}</td>
                                        <td className="px-4 py-3 text-slate-600 font-medium">{check.dueDate}</td>
                                        <td className="px-4 py-3 font-semibold text-slate-800">${check.amount.toLocaleString('es-AR')}</td>
                                        <td className="px-4 py-3"><StatusBadge status={check.status} /></td>
                                        <td className="px-4 py-3 text-center">
                                            <button 
                                                onClick={() => handleUpdateStatus(check)}
                                                className="text-blue-600 hover:text-blue-800 px-2"
                                                aria-label={`Actualizar estado de cheque ${check.number}`}
                                            >
                                                <PencilIcon className="w-4 h-4 inline-block" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* 5. Controles de Paginación */}
                    <div className="flex justify-between items-center mt-4 text-sm">
                        <span className="text-slate-600">
                            Mostrando {Math.min((currentPage - 1) * ITEMS_PER_PAGE + 1, filteredChecks.length)} - {Math.min(currentPage * ITEMS_PER_PAGE, filteredChecks.length)} de {filteredChecks.length} cheques
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

            <AddCheckModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
            <UpdateCheckStatusModal 
                isOpen={isUpdateModalOpen} 
                onClose={() => setIsUpdateModalOpen(false)} 
                check={currentCheck} 
            />
        </>
    );
};

export default Checks;
