import React, { useState, useMemo, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { SearchIcon } from './Icons';
import { selectAllSales } from '../store/selectors';

const ITEMS_PER_PAGE = 10;

const SalesHistory: React.FC = () => {
    // Obtenemos todas las ventas del estado global
    const allSales = useSelector(selectAllSales);
    
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    
    // Filtramos las ventas según la búsqueda
    const filteredSales = useMemo(() => {
        return allSales.filter(sale => {
            const matchesSearch = 
                sale.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                sale.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (sale.paymentMethod && sale.paymentMethod.toLowerCase().includes(searchTerm.toLowerCase()));
            return matchesSearch;
        });
        // Nota: allSales ya viene ordenado por fecha desde el slice/selector
    }, [allSales, searchTerm]);

    // Paginación
    const totalPages = Math.ceil(filteredSales.length / ITEMS_PER_PAGE);
    const paginatedSales = filteredSales.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-800 hidden lg:block">Historial de Ventas</h1>
                <p className="text-slate-500 mt-1">Consulte el registro histórico de todas las ventas realizadas.</p>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-sm">
                {/* Barra de Búsqueda */}
                <div className="relative w-full md:w-1/3 mb-6">
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input 
                        type="text" 
                        placeholder="Buscar por Cliente o Método..." 
                        className="w-full p-2 pl-10 border border-slate-300 rounded-lg"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="text-xs text-slate-500 uppercase bg-slate-50">
                            <tr>
                                <th className="px-4 py-3">Fecha</th>
                                <th className="px-4 py-3">Cliente</th>
                                <th className="px-4 py-3">Items</th>
                                <th className="px-4 py-3">Método Pago</th>
                                <th className="px-4 py-3 text-right">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedSales.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                                        No se encontraron ventas registradas.
                                    </td>
                                </tr>
                            ) : (
                                paginatedSales.map(sale => (
                                    <tr key={sale.id} className="border-b border-slate-100 hover:bg-slate-50">
                                        <td className="px-4 py-3 text-slate-600">
                                            {new Date(sale.date).toLocaleString('es-AR')}
                                        </td>
                                        <td className="px-4 py-3 font-medium text-slate-700">
                                            {sale.customerName}
                                        </td>
                                        <td className="px-4 py-3 text-slate-600">
                                            {sale.items.length} productos
                                        </td>
                                        <td className="px-4 py-3 capitalize text-slate-600">
                                            {sale.paymentMethod}
                                        </td>
                                        <td className="px-4 py-3 font-bold text-slate-800 text-right">
                                            ${sale.total.toFixed(2)}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Controles de Paginación */}
                {filteredSales.length > 0 && (
                    <div className="flex justify-between items-center mt-4 text-sm">
                        <span className="text-slate-600">
                            Mostrando {Math.min((currentPage - 1) * ITEMS_PER_PAGE + 1, filteredSales.length)} - {Math.min(currentPage * ITEMS_PER_PAGE, filteredSales.length)} de {filteredSales.length} ventas
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
                )}
            </div>
        </div>
    );
};

export default SalesHistory;
