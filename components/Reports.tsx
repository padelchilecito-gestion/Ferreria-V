// components/Reports.tsx
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
// 1. Ya no importamos 'salesData'
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { Sale } from '../types'; // 2. Importamos el tipo 'Sale'

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

// 3. Helper function para agrupar ventas por mes
const aggregateSalesByMonth = (sales: Sale[]) => {
    const monthNames = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
    const monthlySales: { [key: string]: number } = {};

    sales.forEach(sale => {
        const date = new Date(sale.date);
        // Creamos una clave legible, ej: "2024-Nov"
        const monthKey = `${date.getFullYear()}-${monthNames[date.getMonth()]}`;
        
        if (!monthlySales[monthKey]) {
            monthlySales[monthKey] = 0;
        }
        monthlySales[monthKey] += sale.total;
    });

    // Convertir a formato de array para Recharts
    return Object.keys(monthlySales).map(key => ({
        name: key,
        Ventas: monthlySales[key],
    })).slice(-12); // Mostrar solo los últimos 12 meses registrados
};


const Reports: React.FC = () => {
    const allProducts = useSelector((state: RootState) => state.products.products);
    const allCustomers = useSelector((state: RootState) => state.customers.customers);
    // 4. Leemos las ventas reales del store
    const allSales = useSelector((state: RootState) => state.sales.sales);

    // 5. Procesamos las ventas para el gráfico
    const processedSalesData = aggregateSalesByMonth(allSales);

    // El gráfico de categorías ya usa 'allProducts' (esto estaba correcto)
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
                             {/* 6. Usamos los datos procesados */}
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
                                    data={categoryData} // <-- Usa datos del store (correcto)
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
                 {/* Esto ya usa 'allProducts' (correcto) */}
                 <p className="text-slate-600">Valor total del inventario actual: <span className="font-bold text-xl text-green-600">$ {allProducts.reduce((acc, p) => acc + (p.costPrice * p.stock), 0).toFixed(2)}</span></p>
            </div>
             <div className="bg-white p-5 rounded-xl shadow-sm">
                 <h2 className="text-lg font-semibold text-slate-800 mb-4">Ranking de Clientes (por Deuda)</h2>
                 <ul className="space-y-2">
                    {/* 7. Actualizamos para mostrar solo clientes con saldo deudor */}
                    {allCustomers.filter(c => c.balance > 0).sort((a,b) => b.balance - a.balance).slice(0,5).map(c => (
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
