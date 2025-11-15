
import React from 'react';
import { mockChecks } from '../data/mockData';
import { Check } from '../types';

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
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-800 hidden lg:block">Gestión de Cartera de Cheques</h1>
                <p className="text-slate-500 mt-1">Controle todos los cheques en cartera, filtrándolos y actualizando su estado.</p>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-sm">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
                    <input type="text" placeholder="Buscar por número o emisor..." className="w-full md:w-1/3 p-2 border border-slate-300 rounded-lg" />
                     <div className="flex gap-2 w-full md:w-auto">
                        <select className="p-2 border border-slate-300 rounded-lg">
                            <option>Filtrar por estado</option>
                            <option>En cartera</option>
                            <option>Depositado</option>
                            <option>Cobrado</option>
                            <option>Rechazado</option>
                        </select>
                        <input type="date" className="p-2 border border-slate-300 rounded-lg" />
                    </div>
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
                            {mockChecks.map(check => (
                                <tr key={check.id} className="border-b border-slate-100 hover:bg-slate-50">
                                    <td className="px-4 py-3 font-medium text-slate-700">{check.bank}</td>
                                    <td className="px-4 py-3 text-slate-600">{check.number}</td>
                                    <td className="px-4 py-3 text-slate-700">{check.issuer}</td>
                                    <td className="px-4 py-3 text-slate-600">{check.issueDate}</td>
                                    <td className="px-4 py-3 text-slate-600 font-medium">{check.dueDate}</td>
                                    <td className="px-4 py-3 font-semibold text-slate-800">${check.amount.toLocaleString('es-AR')}</td>
                                    <td className="px-4 py-3"><StatusBadge status={check.status} /></td>
                                    <td className="px-4 py-3 text-center">...</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Checks;
