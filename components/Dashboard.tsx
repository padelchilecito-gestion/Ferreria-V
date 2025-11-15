import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendUpIcon, UserGroupIcon, AlertTriangleIcon, PlusIcon, CheckCircleIcon, DocumentTextIcon, CubeIcon } from './Icons';
// 1. Ya no importamos 'mockProducts', solo 'salesData'
import { salesData } from '../data/mockData';
import { ViewType } from '../App';
// 2. Importamos useSelector y RootState
import { useSelector } from 'react-redux';
import { RootState } from '../store';

const StatCard: React.FC<{ title: string; value: string; change: string; isPositive: boolean; icon: React.ElementType }> = ({ title, value, change, isPositive, icon: Icon }) => (
    <div className="bg-white p-5 rounded-xl shadow-sm flex-1">
        <div className="flex justify-between items-start">
            <div>
                <p className="text-sm font-medium text-slate-500">{title}</p>
                <p className="text-2xl font-bold text-slate-800 mt-1">{value}</p>
            </div>
            <div className="bg-slate-100 p-2 rounded-full">
                <Icon className="w-6 h-6 text-slate-600" />
            </div>
        </div>
        <div className="flex items-center mt-2">
            <TrendUpIcon className={`w-4 h-4 mr-1 ${isPositive ? 'text-green-500' : 'text-red-500'}`} />
            <p className={`text-sm ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                {change} <span className="text-slate-500">vs ayer</span>
            </p>
        </div>
    </div>
);

const Dashboard: React.FC<{setActiveView: (view: ViewType) => void}> = ({ setActiveView }) => {
    // 3. Leemos los productos y clientes desde el store global
    const allProducts = useSelector((state: RootState) => state.products.products);
    const allCustomers = useSelector((state: RootState) => state.customers.customers);

    // 4. Calculamos los productos con bajo stock usando los datos del store
    const lowStockProducts = allProducts.filter(p => p.stock <= p.minStock).slice(0, 3);

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 hidden lg:block">Bienvenido, Gerente</h1>
                    <p className="text-slate-500 mt-1">Aquí está el resumen general de su negocio hoy.</p>
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">
                        <CubeIcon className="w-5 h-5" />
                        Cargar Producto
                    </button>
                    <button onClick={() => setActiveView('sales')} className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
                        <PlusIcon className="w-5 h-5" />
                        Nueva Venta
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                {/* 5. Los datos de ventas siguen siendo estáticos por ahora */}
                <StatCard title="Ventas del Día" value="$1,250.75" change="+5.2%" isPositive={true} icon={TrendUpIcon} />
                <StatCard title="Ganancia Estimada" value="$480.50" change="+3.1%" isPositive={true} icon={TrendUpIcon} />
                {/* 6. Estos datos ahora son dinámicos desde el store */}
                <StatCard title="Nuevos Clientes" value={allCustomers.length.toString()} change="Hoy" isPositive={true} icon={UserGroupIcon} />
                <StatCard title="Poco Stock" value={lowStockProducts.length.toString()} change="Productos críticos" isPositive={false} icon={AlertTriangleIcon} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white p-5 rounded-xl shadow-sm">
                    <h2 className="text-lg font-semibold text-slate-800 mb-4">Rendimiento de Ventas Semanales</h2>
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={salesData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" tick={{ fill: '#64748b' }} axisLine={{ stroke: '#e2e8f0' }} tickLine={false} />
                                <YAxis tick={{ fill: '#64748b' }} axisLine={{ stroke: '#e2e8f0' }} tickLine={false} tickFormatter={(value) => `$${value/1000}k`} />
                                <Tooltip cursor={{ fill: 'rgba(226, 232, 240, 0.5)' }} contentStyle={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '0.5rem' }} />
                                <Bar dataKey="Ventas" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white p-5 rounded-xl shadow-sm">
                    <h2 className="text-lg font-semibold text-slate-800 mb-4">Alertas y Notificaciones</h2>
                    <ul className="space-y-4">
                        {/* 7. Estas alertas aún son estáticas. Podríamos conectarlas al 'checksSlice' luego */}
                        <li className="flex items-start gap-3">
                            <div className="mt-1 flex-shrink-0"><CheckCircleIcon className="w-5 h-5 text-yellow-500" /></div>
                            <div>
                                <p className="font-medium text-slate-700">Cheques a vencer (2)</p>
                                <p className="text-sm text-slate-500">Cheque #4532 vence en 3 días.</p>
                            </div>
                        </li>
                        <li className="flex items-start gap-3">
                            <div className="mt-1 flex-shrink-0"><DocumentTextIcon className="w-5 h-5 text-red-500" /></div>
                            <div>
                                <p className="font-medium text-slate-700">Facturas Pendientes (1)</p>
                                <p className="text-sm text-slate-500">Factura #INV-098 de 'Aceros S.A' vencida.</p>
                            </div>
                        </li>
                        <li className="flex items-start gap-3">
                           <div className="mt-1 flex-shrink-0"> <CubeIcon className="w-5 h-5 text-blue-500" /></div>
                            <div>
                                <p className="font-medium text-slate-700">Pedido Recibido</p>
                                <p className="text-sm text-slate-500">Pedido #PO-1123 ha llegado.</p>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>

            <div className="bg-white p-5 rounded-xl shadow-sm">
                <h2 className="text-lg font-semibold text-slate-800 mb-2">Productos con Poco Stock</h2>
                <p className="text-sm text-slate-500 mb-4">Estos productos necesitan tu atención para evitar quiebres de stock.</p>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="text-xs text-slate-500 uppercase bg-slate-50">
                            <tr>
                                <th className="px-4 py-2">Producto</th>
                                <th className="px-4 py-2">SKU</th>
                                <th className="px-4 py-2">Cantidad Actual</th>
                                <th className="px-4 py-2">Stock Mínimo</th>
                                <th className="px-4 py-2"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* 8. Esta tabla ahora se actualiza sola si el stock cambia */}
                            {lowStockProducts.map(product => (
                                <tr key={product.id} className="border-b border-slate-100">
                                    <td className="px-4 py-3 font-medium text-slate-700">{product.name}</td>
                                    <td className="px-4 py-3 text-slate-600">{product.sku}</td>
                                    <td className="px-4 py-3">
                                        <span className="bg-red-100 text-red-700 text-xs font-semibold px-2 py-1 rounded-full">{product.stock}</span>
                                    </td>
                                    <td className="px-4 py-3 text-slate-600">{product.minStock}</td>
                                    <td className="px-4 py-3 text-right">
                                        <a href="#" className="font-medium text-blue-600 hover:underline">Ver</a>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
