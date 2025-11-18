import React from 'react';
import { ViewType } from '../App';
import { 
    DashboardIcon, SalesIcon, InventoryIcon, CustomersIcon, SuppliersIcon, 
    ReportsIcon, SettingsIcon, LogoutIcon, ChecksIcon, CubeIcon,
    ShoppingBagIcon, ClockIcon // 1. Importar ClockIcon
} from './Icons';

interface SidebarProps {
  activeView: ViewType;
  setActiveView: (view: ViewType) => void;
  isOpen: boolean;
  setOpen: (isOpen: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView, isOpen, setOpen }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: DashboardIcon },
    { id: 'sales', label: 'Ventas', icon: SalesIcon },
    // 2. Añadir el item de Historial de Ventas aquí
    { id: 'salesHistory', label: 'Historial Ventas', icon: ClockIcon }, 
    { id: 'inventory', label: 'Inventario', icon: InventoryIcon },
    { id: 'customers', label: 'Clientes', icon: CustomersIcon },
    { id: 'suppliers', label: 'Proveedores', icon: SuppliersIcon },
    { id: 'purchases', label: 'Compras', icon: ShoppingBagIcon },
    { id: 'checks', label: 'Cheques', icon: ChecksIcon },
    { id: 'reports', label: 'Reportes', icon: ReportsIcon },
  ];

  const NavLink: React.FC<{item: typeof navItems[0]}> = ({ item }) => {
    const isActive = activeView === item.id;
    return (
      <li>
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            setActiveView(item.id as ViewType);
            setOpen(false);
          }}
          className={`flex items-center p-3 my-1 rounded-lg transition-colors duration-200 ${
            isActive
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-600 hover:bg-blue-100 hover:text-blue-700'
          }`}
        >
          <item.icon className="w-6 h-6 mr-3" />
          <span className="font-medium">{item.label}</span>
        </a>
      </li>
    );
  };
  
  const sidebarContent = (
    <div className="flex flex-col h-full bg-white border-r border-slate-200 shadow-sm lg:shadow-none">
        <div className="p-4 border-b border-slate-200">
          <div className="flex items-center">
            <div className="bg-blue-600 p-2 rounded-lg mr-3">
                <CubeIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-800">Ferretería Central</h1>
              <p className="text-xs text-slate-500">manager@email.com</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-3">
          <ul>
            {navItems.map((item) => <NavLink key={item.id} item={item} />)}
          </ul>
        </nav>
        <div className="p-3 border-t border-slate-200">
          <ul>
            <NavLink item={{ id: 'settings', label: 'Configuración', icon: SettingsIcon }} />
            <li>
                <a href="#" className="flex items-center p-3 my-1 rounded-lg text-slate-600 hover:bg-red-100 hover:text-red-700 transition-colors duration-200">
                    <LogoutIcon className="w-6 h-6 mr-3" />
                    <span className="font-medium">Cerrar Sesión</span>
                </a>
            </li>
          </ul>
        </div>
      </div>
  );

  return (
    <>
        <div className="hidden lg:block lg:w-64 lg:flex-shrink-0">
            {sidebarContent}
        </div>
        <div className={`fixed inset-0 z-40 lg:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)}></div>
            <div className={`relative w-64 h-full bg-white transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                {sidebarContent}
            </div>
        </div>
    </>
  );
};

export default Sidebar;
