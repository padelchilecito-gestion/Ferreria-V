// components/Reports.tsx
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
// 1. Importar los nuevos selectores
import {
    selectAggregateSalesByMonth,
    selectProductCategories,
    selectInventoryValue,
    selectCustomerRanking
} from '../store/selectors';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

// 2. ¡Todas las funciones helper han sido eliminadas!

const Reports: React.FC = () => {
    // 3. Usar los selectores para obtener datos ya procesados
    const processedSalesData = useSelector(selectAggregateSalesByMonth);
    const categoryData = useSelector(selectProductCategories);
    const inventoryValue = useSelector(selectInventoryValue);
    const customerRanking = useSelector(selectCustomerRanking);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-800 hidden lg:block">Reportes y Estadísticas</h1>
                <p className="text-slate-500 mt-1">Analice el rendimiento de su negocio para tomar mejores decisiones.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-5 rounded-xl shadow-sm">
                     <h2 className="text-lg font-semibold text-slate-800 mb-4">Reporte de Ventas Mensuales</h2>
                     <div className="h-72">
                         <ResponsiveContainer width="100%" height="100%">
                             <BarChart data={processedSalesData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                 <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                 <XAxis dataKey="name" />
                                 <YAxis />
                                 <Tooltip />
                                 <Legend />
                                 <Bar dataKey="Ventas" fill="#3b82f6" />
                             </BarChart>
                         </ResponsiveContainer>
                    </div>
                </div>
                 <div className="bg-white p-5 rounded-xl shadow-sm">
                    <h2 className="text-lg font-semibold text-slate-800 mb-4">Distribución de Productos por Categoría</h2>
                     <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={categoryData} // <-- 4. Usar datos del selector
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    outerRadius={100}
                                    fill="#8884d8"
                                    dataKey="value"
                                    nameKey="name"
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                >
                                    {categoryData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                     </div>
                </div>
            </div>

            <div className="bg-white p-5 rounded-xl shadow-sm">
                 <h2 className="text-lg font-semibold text-slate-800 mb-4">Valorización de Inventario</h2>
                 {/* 5. Usar datos del selector */}
                 <p className="text-slate-600">Valor total del inventario actual: <span className="font-bold text-xl text-green-600">$ {inventoryValue.toFixed(2)}</span></p>
            </div>
             <div className="bg-white p-5 rounded-xl shadow-sm">
                 <h2 className="text-lg font-semibold text-slate-800 mb-4">Ranking de Clientes (por Deuda)</h2>
                 <ul className="space-y-2">
                    {/* 6. Usar datos del selector */}
                    {customerRanking.map(c => (
                        <li key={c.id} className="flex justify-between p-2 rounded-md hover:bg-slate-50">
                            <span className="text-slate-700">{c.name}</span>
                            <span className="font-semibold text-red-600">${c.balance.toFixed(2)}</span>
                        </li>
                    ))}
                 </ul>
            </div>
        </div>
    );
};

export default Reports;
