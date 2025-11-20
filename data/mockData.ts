// data/mockData.ts
import { Product, Customer, Supplier, Check } from '../types';

export const mockProducts: Product[] = [
  { id: '1', sku: 'TRN-00123', name: 'Tornillo Autorroscante 1/4"', supplier: 'Genérico', stock: 15, minStock: 20, costPrice: 0.10, retailPrice: 0.25, wholesalePrice: 0.20, category: 'Tornillería' },
  { id: '2', sku: 'PNT-00456', name: 'Pintura Látex Blanca 1L', supplier: 'Alba', stock: 8, minStock: 10, costPrice: 8.50, retailPrice: 12.00, wholesalePrice: 11.00, category: 'Pintura' },
  { id: '3', sku: 'HER-00789', name: 'Martillo de Carpintero', supplier: 'Truper', stock: 5, minStock: 5, costPrice: 12.00, retailPrice: 18.00, wholesalePrice: 16.50, category: 'Herramientas' },
  { id: '4', sku: 'HD-98745', name: 'Juego de Destornilladores (6 pz)', supplier: 'Stanley', stock: 25, minStock: 10, costPrice: 25.00, retailPrice: 35.50, wholesalePrice: 32.00, category: 'Herramientas' },
  { id: '5', sku: 'HD-33214', name: 'Cinta Métrica 5m', supplier: 'Pretul', stock: 50, minStock: 15, costPrice: 8.00, retailPrice: 12.50, wholesalePrice: 11.00, category: 'Herramientas' },
  { id: '6', sku: 'HD-10589', name: 'Taladro Percutor 1/2"', supplier: 'DeWalt', stock: 0, minStock: 5, costPrice: 150.00, retailPrice: 220.00, wholesalePrice: 205.00, category: 'Herramientas Eléctricas' },
  { id: '7', sku: 'HD-78901', name: 'Llave Inglesa Ajustable 8"', supplier: 'Craftsman', stock: 18, minStock: 10, costPrice: 18.00, retailPrice: 28.00, wholesalePrice: 25.00, category: 'Herramientas' },
  { id: '8', sku: 'ELE-01234', name: 'Cinta Aislante Negra', supplier: '3M', stock: 150, minStock: 50, costPrice: 1.50, retailPrice: 2.50, wholesalePrice: 2.00, category: 'Electricidad' },
];

export const mockCustomers: Customer[] = [
    { id: '1', name: 'Constructora S.A.', cuit: '30-12345678-9', phone: '11-5555-1234', email: 'contacto@constructora.com', address: 'Av. Siempre Viva 742, Buenos Aires', accountStatus: 'Active', balance: 1250.75 },
    { id: '2', name: 'Juan Pérez', cuit: '20-98765432-1', phone: '11-5555-5678', email: 'juan.perez@email.com', address: 'Calle Falsa 123, Córdoba', accountStatus: 'Active', balance: 2540.50 },
    { id: '3', name: 'María García', cuit: '27-11223344-5', phone: '11-5555-8765', email: 'maria.garcia@email.com', address: 'Av. Libertador 4500, CABA', accountStatus: 'Inactive', balance: 0 },
    { id: '4', name: 'El Martillo Feliz SRL', cuit: '33-87654321-0', phone: '11-5555-4321', email: 'compras@elmartillofeliz.com', address: 'Ruta 9 Km 50, Pilar', accountStatus: 'Active', balance: -320.00 },
];

export const mockSuppliers: Supplier[] = [
    { id: '1', name: 'Ferretería Industrial S.A.', cuit: '30-12345678-9', phone: '+54 11 4567-8901', email: 'contacto@ferreteriaindustrial.com', status: 'Active', balance: 0 },
    { id: '2', name: 'Juan Pérez', cuit: '20-98765432-1', phone: '+54 11 4567-8901', email: 'juan.perez@proveedor.com', status: 'Active', balance: 150.00 },
    { id: '3', name: 'Distribuidora Central', cuit: '33-55555555-5', phone: '+54 11 2345-6789', email: 'ventas@distribuidoracentral.com', status: 'Inactive', balance: 0 },
    { id: '4', name: 'Materiales del Sur S.R.L.', cuit: '30-11223344-5', phone: '+54 11 9876-5432', email: 'info@materialesdelsur.com', status: 'Active', balance: 850.20 },
    { id: '5', name: 'Herramientas Total', cuit: '30-66778899-0', phone: '+54 11 5555-1234', email: 'soporte@herramientastotal.com', status: 'Pending', balance: 0 },
];

export const mockChecks: Check[] = [
    { id: '1', bank: 'Galicia', number: '4532', issueDate: '2023-10-15', dueDate: '2023-11-15', amount: 15000, status: 'En cartera', issuer: 'Constructora S.A.' },
    { id: '2', bank: 'Santander', number: '1123', issueDate: '2023-10-20', dueDate: '2023-11-20', amount: 22500, status: 'En cartera', issuer: 'El Martillo Feliz SRL' },
    { id: '3', bank: 'BBVA', number: '7890', issueDate: '2023-09-01', dueDate: '2023-10-01', amount: 8000, status: 'Cobrado', issuer: 'Juan Pérez' },
    { id: '4', bank: 'ICBC', number: '5643', issueDate: '2023-09-10', dueDate: '2023-10-10', amount: 35000, status: 'Depositado', issuer: 'Constructora S.A.' },
    { id: '5', bank: 'Ciudad', number: '9981', issueDate: '2023-08-15', dueDate: '2023-09-15', amount: 12000, status: 'Rechazado', issuer: 'El Martillo Feliz SRL' },
];

export const salesData = [
  { name: 'Lun', Ventas: 4000 },
  { name: 'Mar', Ventas: 3000 },
  { name: 'Mié', Ventas: 2000 },
  { name: 'Jue', Ventas: 2780 },
  { name: 'Vie', Ventas: 1890 },
  { name: 'Sáb', Ventas: 2390 },
  { name: 'Dom', Ventas: 3490 },
];
