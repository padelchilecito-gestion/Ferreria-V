import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from './store';
import { fetchProducts } from './store/productsSlice';
import { fetchCustomers } from './store/customersSlice'; // NUEVO
import { fetchSales } from './store/salesSlice'; // NUEVO

import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import PointOfSale from './components/PointOfSale';
import Inventory from './components/Inventory';
import Customers from './components/Customers';
import Suppliers from './components/Suppliers';
import Checks from './components/Checks';
import Reports from './components/Reports';
import Settings from './components/Settings';
import Purchases from './components/Purchases';
import { MenuIcon } from './components/Icons';

export type ViewType = 'dashboard' | 'sales' | 'inventory' | 'customers' | 'suppliers' | 'purchases' | 'checks' | 'reports' | 'settings';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<ViewType>('dashboard');
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    // Cargar todos los datos principales al iniciar
    dispatch(fetchProducts());
    dispatch(fetchCustomers());
    dispatch(fetchSales());
  }, [dispatch]);

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard setActiveView={setActiveView} />;
      case 'sales':
        return <PointOfSale />;
      case 'inventory':
        return <Inventory />;
      case 'customers':
        return <Customers />;
      case 'suppliers':
        return <Suppliers />;
      case 'purchases':
        return <Purchases />;
      case 'checks':
        return <Checks />;
      case 'reports':
        return <Reports />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard setActiveView={setActiveView} />;
    }
  };

  const viewTitles: Record<ViewType, string> = {
    dashboard: 'Bienvenido, Gerente',
    sales: 'Punto de Venta (POS)',
    inventory: 'Gestión de Inventario',
    customers: 'Gestión de Clientes',
    suppliers: 'Gestión de Proveedores',
    purchases: 'Gestión de Compras',
    checks: 'Gestión de Cartera de Cheques',
    reports: 'Reportes y Estadísticas',
    settings: 'Configuración',
  };

  return (
    <div className="bg-slate-50 min-h-screen flex">
      <Sidebar activeView={activeView} setActiveView={setActiveView} isOpen={isSidebarOpen} setOpen={setSidebarOpen} />
      <main className="flex-1 transition-all duration-300">
        <header className="bg-white/80 backdrop-blur-lg sticky top-0 z-20 p-4 border-b border-slate-200 flex items-center justify-between lg:hidden">
          <h1 className="text-xl font-bold text-slate-800">{viewTitles[activeView]}</h1>
          <button onClick={() => setSidebarOpen(true)} className="p-2 text-slate-600">
            <MenuIcon className="h-6 w-6" />
          </button>
        </header>
        <div className="p-4 sm:p-6 lg:p-8">
          {renderView()}
        </div>
      </main>
    </div>
  );
};

export default App;
