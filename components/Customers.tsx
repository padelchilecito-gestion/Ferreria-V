import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { Customer } from '../types';
import { PlusIcon, SearchIcon, CurrencyDollarIcon } from './Icons';
import AddCustomerModal from './AddCustomerModal';
import EditCustomerModal from './EditCustomerModal';
import { deleteCustomer } from '../store/customersSlice';
import AddPaymentModal from './AddPaymentModal';

const ITEMS_PER_PAGE = 10;

interface CustomerDetailProps {
  customer: Customer | null;
  onEdit: () => void;
  onDelete: () => void;
  onAddPayment: () => void;
}

const CustomerDetail: React.FC<CustomerDetailProps> = ({ customer, onEdit, onDelete, onAddPayment }) => {
  if (!customer) {
      return (
          <div className="flex-1 flex items-center justify-center bg-slate-50 rounded-lg">
              <p className="text-slate-500">Seleccione un cliente para ver los detalles</p>
          </div>
      );
  }

  const hasDebt = customer.balance > 0;

  return (
      <div className="flex-1 bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center gap-4 pb-6 border-b">
              {/* Se eliminó la etiqueta <img> que mostraba la foto */}
              <div>
                  <h2 className="text-xl font-bold text-slate-800">{customer.name}</h2>
                  <p className="text-sm text-slate-500">CUIT/DNI: {customer.cuit}</p>
              </div>
          </div>
          <div className="py-6 space-y-4">
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
                      {customer.accountStatus === 'Active' ? 'Activo' : 'Inactivo'}
                  </span>
              </div>
              <div className="flex items-center">
                  <span className="w-24 font-medium text-sm text-slate-500">Saldo</span>
                  <span className={`text-lg font-bold ${hasDebt ? 'text-red-600' : 'text-slate-700'}`}>
                    ${customer.balance.toFixed(2)}
                    {hasDebt ? ' (Debe)' : (customer.balance < 0 ? ' (A favor)' : '')}
                  </span>
              </div>
          </div>
           <div className="space-y-2">
              <button 
                onClick={onAddPayment}
                className="w-full flex items-center justify-center gap-2 py-2 border border-green-600 bg-green-50 rounded-lg text-green-700 hover:bg-green-100 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!hasDebt}
              >
                <CurrencyDollarIcon className="w-5 h-5" />
                Registrar Pago
              </button>
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
      </div>
  );
};

const Customers: React.FC = () => {
  const customers = useSelector((state: RootState) => state.customers.customers);
  const dispatch = useDispatch<AppDispatch>(); 

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  const handleEdit = () => {
    if (!selectedCustomer) return;
    setIsEditModalOpen(true);
  };

  const handleDelete = () => {
    if (!selectedCustomer) return;
    if (window.confirm(`¿Está seguro de que desea eliminar a ${selectedCustomer.name}?`)) {
      dispatch(deleteCustomer(selectedCustomer.id));
      setSelectedCustomer(null);
    }
  };

  const handleAddPayment = () => {
    if (!selectedCustomer) return;
    setIsPaymentModalOpen(true);
  };

  const filteredCustomers = customers.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          c.cuit.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || c.accountStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredCustomers.length / ITEMS_PER_PAGE);
  const paginatedCustomers = filteredCustomers.slice(
      (currentPage - 1) * ITEMS_PER_PAGE,
      currentPage * ITEMS_PER_PAGE
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  useEffect(() => {
    const currentSelectionInPage = paginatedCustomers.find(c => c.id === selectedCustomer?.id);
    if (!currentSelectionInPage) {
        setSelectedCustomer(paginatedCustomers.length > 0 ? paginatedCustomers[0] : null);
    }
  }, [currentPage, paginatedCustomers, selectedCustomer]);

  const handlePageChange = (newPage: number) => {
      if (newPage >= 1 && newPage <= totalPages) {
          setCurrentPage(newPage);
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
                      <div className="flex flex-col sm:flex-row gap-4 mb-4">
                        <div className="relative flex-1">
                            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input 
                              type="text" 
                              placeholder="Buscar por Nombre, CUIT/DNI..." 
                              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg"
                              value={searchTerm}
                              onChange={e => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <select 
                            className="p-2 border border-slate-300 rounded-lg"
                            value={statusFilter}
                            onChange={e => setStatusFilter(e.target.value)}
                        >
                            <option value="all">Estado (Todos)</option>
                            <option value="Active">Activo</option>
                            <option value="Inactive">Inactivo</option>
                        </select>
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
                                  {paginatedCustomers.map(customer => (
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

                      <div className="flex justify-between items-center mt-4 text-sm">
                          <span className="text-slate-600">
                              Mostrando {Math.min((currentPage - 1) * ITEMS_PER_PAGE + 1, filteredCustomers.length) || 0} - {Math.min(currentPage * ITEMS_PER_PAGE, filteredCustomers.length)} de {filteredCustomers.length} clientes
                          </span>
                          <div className="flex gap-2">
                              <button
                                  onClick={() => handlePageChange(currentPage - 1)}
                                  disabled={currentPage === 1}
                                  className="px-3 py-1 border rounded-md bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                  &lt; Anterior
                              </button>
                              <button
                                  onClick={() => handlePageChange(currentPage + 1)}
                                  disabled={currentPage === totalPages || totalPages === 0}
                                  className="px-3 py-1 border rounded-md bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                  Siguiente &gt;
                              </button>
                          </div>
                      </div>

                  </div>
                  <div className="lg:w-1/3">
                      <CustomerDetail 
                        customer={selectedCustomer} 
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onAddPayment={handleAddPayment}
                      />
                  </div>
              </div>
          </div>
          
          <AddCustomerModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
          <EditCustomerModal 
            isOpen={isEditModalOpen} 
            onClose={() => setIsEditModalOpen(false)} 
            customer={selectedCustomer} 
          />
          <AddPaymentModal
            isOpen={isPaymentModalOpen}
            onClose={() => setIsPaymentModalOpen(false)}
            customer={selectedCustomer}
          />
      </>
  );
};

export default Customers;
