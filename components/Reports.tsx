import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
// 1. Ya no importamos 'mockProducts' ni 'mockCustomers'
import { salesData } from '../data/mockData';
// 2. Importamos useSelector y RootState
import { useSelector } from 'react-redux';
import { RootState } from '../store';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const Reports: React.FC = () => {
    // 3. Leemos los productos y clientes desde el store global
    const allProducts = useSelector((state: RootState) => state.products.products);
    const allCustomers = useSelector((state: RootState) => state.customers.customers);

    // 4. El gráfico de categorías ahora usa 'allProducts'
    const productCategories = allProducts.reduce((acc, product) => {
        acc[product.category] = (acc[product.category] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const categoryData = Object.keys(productCategories).map(key => ({ name: key, value: productCategories[key] }));

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
                             <BarChart data={salesData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
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
                                    data={categoryData} // <-- 5. Usa datos del store
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
                 {/* 6. La valorización ahora usa 'allProducts' */}
                 <p className="text-slate-600">Valor total del inventario actual: <span className="font-bold text-xl text-green-600">$ {allProducts.reduce((acc, p) => acc + (p.costPrice * p.stock), 0).toFixed(2)}</span></p>
            </div>
             <div className="bg-white p-5 rounded-xl shadow-sm">
                 <h2 className="text-lg font-semibold text-slate-800 mb-4">Ranking de Clientes</h2>
                 <ul className="space-y-2">
                    {/* 7. El ranking ahora usa 'allCustomers' */}
                    {allCustomers.sort((a,b) => b.balance - a.balance).slice(0,5).map(c => (
                        <li key={c.id} className="flex justify-between p-2 rounded-md hover:bg-slate-50">
                            <span className="text-slate-700">{c.name}</span>
                            <span className="font-semibold">${c.balance.toFixed(2)}</span>
                        </li>
                    ))}
                 </ul>
            </div>
        </div>
    );
};

export default Reports;
