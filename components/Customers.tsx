import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux'; // 1. Importar useDispatch
import { RootState, AppDispatch } from '../store';
import { Customer } from '../types';
import { PlusIcon, SearchIcon } from './Icons';
import AddCustomerModal from './AddCustomerModal';
import EditCustomerModal from './EditCustomerModal'; // 2. Importar el nuevo modal de edición
import { deleteCustomer } from '../store/customersSlice'; // 3. Importar la acción de eliminar

// Modificamos CustomerDetail para que reciba los manejadores de eventos
interface CustomerDetailProps {
  customer: Customer | null;
  onEdit: () => void;
  onDelete: () => void;
}

const CustomerDetail: React.FC<CustomerDetailProps> = ({ customer, onEdit, onDelete }) => {
  if (!customer) {
      return (
          <div className="flex-1 flex items-center justify-center bg-slate-50 rounded-lg">
              <p className="text-slate-500">Seleccione un cliente para ver los detalles</p>
          </div>
      );
  }

  // 4. Conectamos los botones a las funciones recibidas por props
  return (
      <div className="flex-1 bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center gap-4 pb-6 border-b">
              <img src={`https://i.pravatar.cc/80?u=${customer.id}`} alt={customer.name} className="w-20 h-20 rounded-full" />
              <div>
                  <h2 className="text-xl font-bold text-slate-800">{customer.name}</h2>
                  <p className="text-sm text-slate-500">CUIT/DNI: {customer.cuit}</p>
              </div>
          </div>
          <div className="py-6 space-y-4">
              {/* ... (el resto de los campos de detalle no cambian) ... */}
              <div className="flex items-center">
                  <span className="w-24 font-medium text-sm text-slate-500">Email</span>
                  <span className="text-slate-700">{customer.email}</span>
              </div>
              <div className="flex items-center">
                  <span className="w-24 font-medium text-sm text-slate-500">Teléfono</span>
                  <span className="text-slate-700">{customer.phone}</span>
              </div>
              <div className="flex items-center">
                  <span className="w-24 font-medium text-sm text-slate-500">Dirección</span>
                  <span className="text-slate-700">{customer.address}</span>
              </div>
              <div className="flex items-center">
                  <span className="w-24 font-medium text-sm text-slate-500">Estado</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${customer.accountStatus === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {customer.accountStatus}
                  </span>
              </div>
              <div className="flex items-center">
                  <span className="w-24 font-medium text-sm text-slate-500">Saldo</span>
                  <span className="text-slate-700 font-bold">${customer.balance.toFixed(2)}</span>
              </div>
          </div>
           <div className="flex gap-2">
              <button 
                onClick={onEdit}
                className="flex-1 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50"
              >
                Editar
              </button>
              <button 
                onClick={onDelete}
                className="flex-1 py-2 bg-red-50 border border-red-200 rounded-lg text-red-600 hover:bg-red-100"
              >
                Eliminar
              </button>
          </div>
      </div>
  );
};

const Customers: React.FC = () => {
  const customers = useSelector((state: RootState) => state.customers.customers);
  const dispatch = useDispatch<AppDispatch>(); // 5. Obtener el dispatch

  // 6. Estados para ambos modales
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(customers[0] || null);

  // 7. Lógica para los botones de Editar y Eliminar
  const handleEdit = () => {
    if (!selectedCustomer) return; // No hacer nada si no hay cliente seleccionado
    setIsEditModalOpen(true); // Abrir el modal de edición
  };

  const handleDelete = () => {
    if (!selectedCustomer) return;
    
    // Pedir confirmación antes de eliminar
    if (window.confirm(`¿Está seguro de que desea eliminar a ${selectedCustomer.name}?`)) {
      dispatch(deleteCustomer(selectedCustomer.id));
      // Limpiar la selección
      setSelectedCustomer(null);
    }
  };

  return (
      <>
          <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                      <h1 className="text-2xl font-bold text-slate-800 hidden lg:block">Gestión de Clientes</h1>
                      <p className="text-slate-500 mt-1">Vea, busque y gestione la información de sus clientes.</p>
                  </div>
                  <button 
                      onClick={() => setIsAddModalOpen(true)}
                      className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                  >
                      <PlusIcon className="w-5 h-5" />
                      Añadir Nuevo Cliente
                  </button>
              </div>

              <div className="flex flex-col lg:flex-row gap-6">
                  <div className="lg:w-2/3 bg-white p-4 rounded-xl shadow-sm">
                      <div className="relative mb-4">
                          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                          <input type="text" placeholder="Buscar por Nombre, CUIT/DNI..." className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg" />
                      </div>
                      <div className="overflow-x-auto">
                          <table className="w-full text-left">
                              <thead className="text-xs text-slate-500 uppercase bg-slate-50">
                                  <tr>
                                      <th className="px-4 py-2">Nombre o Razón Social</th>
                                      <th className="px-4 py-2">CUIT/DNI</th>
                                      <th className="px-4 py-2">Teléfono</th>
                                      <th className="px-4 py-2">Email</th>
                                  </tr>
                              </thead>
                              <tbody>
                                  {customers.map(customer => (
                                      <tr 
                                          key={customer.id} 
                                          onClick={() => setSelectedCustomer(customer)}
                                          className={`border-b border-slate-100 cursor-pointer ${selectedCustomer?.id === customer.id ? 'bg-blue-50' : 'hover:bg-slate-50'}`}
                                      >
                                          <td className={`px-4 py-3 font-medium ${selectedCustomer?.id === customer.id ? 'text-blue-700' : 'text-slate-700'}`}>{customer.name}</td>
                                          <td className="px-4 py-3 text-slate-600">{customer.cuit}</td>
                                          <td className="px-4 py-3 text-slate-600">{customer.phone}</td>
                                          <td className="px-4 py-3 text-slate-600">{customer.email}</td>
                                      </tr>
                                  ))}
                              </tbody>
                          </table>
                      </div>
                  </div>
                  <div className="lg:w-1/3">
                      {/* 8. Pasar las funciones al detalle */}
                      <CustomerDetail 
                        customer={selectedCustomer} 
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                      />
                  </div>
              </div>
          </div>
          
          {/* 9. Renderizar ambos modales */}
          <AddCustomerModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
          <EditCustomerModal 
            isOpen={isEditModalOpen} 
            onClose={() => setIsEditModalOpen(false)} 
            customer={selectedCustomer} 
          />
      </>
  );
};

export default Customers;
