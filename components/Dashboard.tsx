import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendUpIcon, UserGroupIcon, AlertTriangleIcon, PlusIcon, CheckCircleIcon, DocumentTextIcon, CubeIcon } from './Icons';
import { ViewType } from '../App';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { Sale, Check } from '../types';

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
            {change === "N/A" ? (
                 <p className="text-sm text-slate-500">{value === "$0.00" ? "Sin ventas hoy" : (title === "Total Clientes" ? "Desde el inicio" : "Productos críticos")}</p>
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

const aggregateSalesByDay = (sales: Sale[]) => {
    const weeklySales: { [key: number]: { name: string, Ventas: number } } = {
        0: { name: "Dom", Ventas: 0 }, 1: { name: "Lun", Ventas: 0 }, 2: { name: "Mar", Ventas: 0 },
        3: { name: "Mié", Ventas: 0 }, 4: { name: "Jue", Ventas: 0 }, 5: { name: "Vie", Ventas: 0 },
        6: { name: "Sáb", Ventas: 0 },
    };
    const today = new Date();
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(today.getDate() - 7);

    sales.forEach(sale => {
        const saleDate = new Date(sale.date);
        if (saleDate >= oneWeekAgo) {
            const dayOfWeek = saleDate.getDay();
            weeklySales[dayOfWeek].Ventas += sale.total;
        }
    });
    
    return [ weeklySales[1], weeklySales[2], weeklySales[3], weeklySales[4], weeklySales[5], weeklySales[6], weeklySales[0] ];
};

const getTodayString = () => {
    const today = new Date();
    today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
    return today.toISOString().split('T')[0];
};

const getUpcomingChecks = (checks: Check[], daysThreshold: number = 7) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayTime = today.getTime();
    const msInDay = 1000 * 60 * 60 * 24;

    return checks
        .filter(check => check.status === 'En cartera')
        .map(check => {
            const dateParts = check.dueDate.split('-').map(part => parseInt(part, 10));
            const dueDate = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
            dueDate.setHours(0,0,0,0);
            const daysRemaining = Math.round((dueDate.getTime() - todayTime) / msInDay);
            return { ...check, daysRemaining };
        })
        .filter(check => check.daysRemaining >= 0 && check.daysRemaining <= daysThreshold)
        .sort((a, b) => a.daysRemaining - b.daysRemaining);
};


const Dashboard: React.FC<{setActiveView: (view: ViewType) => void}> = ({ setActiveView }) => {
    const allProducts = useSelector((state: RootState) => state.products.products);
    const allCustomers = useSelector((state: RootState) => state.customers.customers);
    const allSales = useSelector((state: RootState) => state.sales.sales);
    const allChecks = useSelector((state: RootState) => state.checks.checks);
    const allPurchases = useSelector((state: RootState) => state.purchases.purchases);

    // Corregido: Agregamos 'lowStockProducts' al destructuring
    const { salesToday, profitToday, salesChartData, lowStockProductCount, lowStockProducts, upcomingChecks, pendingPurchases } = useMemo(() => {
        const todayStr = getTodayString();
        const salesTodayArr = allSales.filter(s => s.date.startsWith(todayStr));
        
        const totalSales = salesTodayArr.reduce((acc, s) => acc + s.total, 0);
        
        const totalCost = salesTodayArr.reduce((accSale, sale) => {
            return accSale + sale.items.reduce((accItem, item) => {
                return accItem + (item.costPrice * item.quantity);
            }, 0);
        }, 0);

        const totalProfit = totalSales - totalCost;
        const chartData = aggregateSalesByDay(allSales);
        
        // Calcular productos con poco stock y la lista recortada a 5
        const lowStockList = allProducts.filter(p => p.stock <= p.minStock);
        const lowStockCount = lowStockList.length;
        const lowStockProductsData = lowStockList.slice(0, 5);

        const upcomingChecksData = getUpcomingChecks(allChecks, 7);
        
        const pendingPurchasesData = allPurchases
            .filter(purchase => purchase.status === 'Pendiente de pago')
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        return {
            salesToday: totalSales,
            profitToday: totalProfit,
            salesChartData: chartData,
            lowStockProductCount: lowStockCount,
            lowStockProducts: lowStockProductsData, // <--- Agregado aquí
            upcomingChecks: upcomingChecksData,
            pendingPurchases: pendingPurchasesData,
        };
    }, [allSales, allProducts, allChecks, allPurchases]);

    const customerCount = allCustomers.length;

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 hidden lg:block">Bienvenido, Gerente</h1>
                    <p className="text-slate-500 mt-1">Aquí está el resumen general de su negocio hoy.</p>
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <button 
                        onClick={() => setActiveView('inventory')}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                    >
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
                <StatCard 
                    title="Ventas del Día" 
                    value={`$${salesToday.toFixed(2)}`} 
                    change="+0.0%"
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
                    change="N/A" 
                    isPositive={true} 
                    icon={UserGroupIcon} 
                />
                <StatCard 
                    title="Poco Stock" 
                    value={lowStockProductCount.toString()} 
                    change="N/A" 
                    isPositive={lowStockProductCount === 0}
                    icon={AlertTriangleIcon} 
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white p-5 rounded-xl shadow-sm">
                    <h2 className="text-lg font-semibold text-slate-800 mb-4">Rendimiento de Ventas (Últ. 7 días)</h2>
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
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
                        
                        {upcomingChecks.length > 0 ? (
                            <li className="flex items-start gap-3">
                                <div className="mt-1 flex-shrink-0"><CheckCircleIcon className="w-5 h-5 text-yellow-500" /></div>
                                <div>
                                    <p className="font-medium text-slate-700">Cheques a vencer ({upcomingChecks.length})</p>
                                    <p className="text-sm text-slate-500">
                                        #{upcomingChecks[0].number} - ${upcomingChecks[0].amount.toLocaleString('es-AR')}
                                        {upcomingChecks[0].daysRemaining === 0 ? " (Vence hoy)" : ` (Vence en ${upcomingChecks[0].daysRemaining} ${upcomingChecks[0].daysRemaining === 1 ? 'día' : 'días'})`}
                                    </p>
                                </div>
                            </li>
                        ) : (
                            <li className="flex items-start gap-3">
                                <div className="mt-1 flex-shrink-0"><CheckCircleIcon className="w-5 h-5 text-green-500" /></div>
                                <div>
                                    <p className="font-medium text-slate-700">Cheques</p>
                                    <p className="text-sm text-slate-500">No hay cheques próximos a vencer.</p>
                                </div>
                            </li>
                        )}
                        
                        {pendingPurchases.length > 0 ? (
                            <li className="flex items-start gap-3">
                                <div className="mt-1 flex-shrink-0"><DocumentTextIcon className="w-5 h-5 text-red-500" /></div>
                                <div>
                                    <p className="font-medium text-slate-700">Facturas Pendientes ({pendingPurchases.length})</p>
                                    <p className="text-sm text-slate-500">
                                        Factura #{pendingPurchases[0].invoiceNumber} de {pendingPurchases[0].supplierName} está pendiente.
                                    </p>
                                </div>
                            </li>
                        ) : (
                            <li className="flex items-start gap-3">
                                <div className="mt-1 flex-shrink-0"><DocumentTextIcon className="w-5 h-5 text-green-500" /></div>
                                <div>
                                    <p className="font-medium text-slate-700">Facturas Pendientes</p>
                                    <p className="text-sm text-slate-500">No hay facturas pendientes de pago.</p>
                                </div>
                            </li>
                        )}

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
                            {lowStockProducts.map(product => (
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
                                        <a 
                                            href="#" 
                                            onClick={(e) => { 
                                                e.preventDefault(); 
                                                setActiveView('inventory'); 
                                            }} 
                                            className="font-medium text-blue-600 hover:underline"
                                        >
                                            Ver
                                        </a>
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
