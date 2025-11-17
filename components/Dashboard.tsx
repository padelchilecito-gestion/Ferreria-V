import React, { useMemo } from 'react'; // 1. Importar useMemo
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendUpIcon, UserGroupIcon, AlertTriangleIcon, PlusIcon, CheckCircleIcon, DocumentTextIcon, CubeIcon } from './Icons';
// 2. Ya no importamos 'salesData'
import { ViewType } from '../App';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { Sale } from '../types'; // 3. Importar Sale

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
            {/* 4. Mostrar cambio dinámicamente o texto estático si no hay cambio */}
            {change === "+0.0%" ? (
                <p className="text-sm text-slate-500">{value === "$0.00" ? "Sin ventas hoy" : "Sin cambios vs ayer"}</p>
            ) : (
                <>
                    <TrendUpIcon className={`w-4 h-4 mr-1 ${isPositive ? 'text-green-500' : 'text-red-500'}`} />
                    <p className={`text-sm ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                        {change} <span className="text-slate-500">vs ayer</span>
                    </p>
                </>
            )}
        </div>
    </div>
);

// 5. Helper function para agrupar ventas por día (para el gráfico)
const aggregateSalesByDay = (sales: Sale[]) => {
    // const dayNames = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
    const weeklySales: { [key: number]: { name: string, Ventas: number } } = {
        0: { name: "Dom", Ventas: 0 },
        1: { name: "Lun", Ventas: 0 },
        2: { name: "Mar", Ventas: 0 },
        3: { name: "Mié", Ventas: 0 },
        4: { name: "Jue", Ventas: 0 },
        5: { name: "Vie", Ventas: 0 },
        6: { name: "Sáb", Ventas: 0 },
    };

    const today = new Date();
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(today.getDate() - 7);

    sales.forEach(sale => {
        const saleDate = new Date(sale.date);
        // Filtramos ventas de la última semana
        if (saleDate >= oneWeekAgo) {
            const dayOfWeek = saleDate.getDay(); // 0 = Domingo, 1 = Lunes...
            weeklySales[dayOfWeek].Ventas += sale.total;
        }
    });
    
    // Reordenar para que empiece en Lunes y termine en Domingo
    const orderedSales = [
        weeklySales[1],
        weeklySales[2],
        weeklySales[3],
        weeklySales[4],
        weeklySales[5],
        weeklySales[6],
        weeklySales[0],
    ];

    return orderedSales;
};

// 6. Helper para obtener la fecha de hoy en formato YYYY-MM-DD
const getTodayString = () => {
    const today = new Date();
    // Ajustar por la zona horaria local para asegurarse que la fecha es correcta
    today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
    return today.toISOString().split('T')[0];
};

const Dashboard: React.FC<{setActiveView: (view: ViewType) => void}> = ({ setActiveView }) => {
    const allProducts = useSelector((state: RootState) => state.products.products);
    const allCustomers = useSelector((state: RootState) => state.customers.customers);
    // 7. Obtener ventas reales del store
    const allSales = useSelector((state: RootState) => state.sales.sales);

    // 8. Calcular datos para el dashboard usando useMemo
    const { salesToday, profitToday, salesChartData, lowStockProductCount } = useMemo(() => {
        const todayStr = getTodayString();
        const salesTodayArr = allSales.filter(s => s.date.startsWith(todayStr));
        
        const totalSales = salesTodayArr.reduce((acc, s) => acc + s.total, 0);
        
        const totalCost = salesTodayArr.reduce((accSale, sale) => {
            return accSale + sale.items.reduce((accItem, item) => {
                // El item en la venta (SaleItem) tiene el 'costPrice'
                return accItem + (item.costPrice * item.quantity);
            }, 0);
        }, 0);

        const totalProfit = totalSales - totalCost;
        
        const chartData = aggregateSalesByDay(allSales);
        
        const lowStockCount = allProducts.filter(p => p.stock <= p.minStock).length;

        return {
            salesToday: totalSales,
            profitToday: totalProfit,
            salesChartData: chartData,
            lowStockProductCount: lowStockCount,
        };
    }, [allSales, allProducts]);

    // 9. El conteo de clientes ya es dinámico (correcto)
    const customerCount = allCustomers.length;

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

            {/* 10. Conectar StatCards a los datos calculados */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                <StatCard 
                    title="Ventas del Día" 
                    value={`$${salesToday.toFixed(2)}`} 
                    change="+0.0%" // Lógica de % de cambio no implementada (requiere datos de "ayer")
                    isPositive={true} 
                    icon={TrendUpIcon} 
                />
                <StatCard 
                    title="Ganancia Estimada" 
                    value={`$${profitToday.toFixed(2)}`} 
                    change="+0.0%" 
                    isPositive={true} 
                    icon={TrendUpIcon} 
                />
                <StatCard 
                    title="Total Clientes" 
                    value={customerCount.toString()} 
                    change="Desde el inicio" 
                    isPositive={true} 
                    icon={UserGroupIcon} 
                />
                <StatCard 
                    title="Poco Stock" 
                    value={lowStockProductCount.toString()} 
                    change="Productos críticos" 
                    isPositive={lowStockProductCount === 0} // Es positivo si NO hay poco stock
                    icon={AlertTriangleIcon} 
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white p-5 rounded-xl shadow-sm">
                    <h2 className="text-lg font-semibold text-slate-800 mb-4">Rendimiento de Ventas (Últ. 7 días)</h2>
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            {/* 11. Usar 'salesChartData' */}
                            <BarChart data={salesChartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
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
                        {/* Estas alertas siguen estáticas. Las conectaremos al 'checksSlice' a continuación */}
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
                            {/* 12. Usar los productos con bajo stock (mostrando los 5 primeros) */}
                            {allProducts.filter(p => p.stock <= p.minStock).slice(0, 5).map(product => (
                                <tr key={product.id} className="border-b border-slate-100">
                                    <td className="px-4 py-3 font-medium text-slate-700">{product.name}</td>
                                    <td className="px-4 py-3 text-slate-600">{product.sku}</td>
                                    <td className="px-4 py-3">
                                        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${product.stock === 0 ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                            {product.stock}
                                        </span>
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
