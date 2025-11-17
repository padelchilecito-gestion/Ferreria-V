// types.ts
export interface Product {
  id: string;
  sku: string;
  name: string;
  supplier: string;
  stock: number;
  minStock: number;
  costPrice: number;
  retailPrice: number;
  wholesalePrice: number; // <-- NUEVO CAMPO
  category: string;
}

export interface Customer {
  id: string;
  name: string;
  cuit: string;
  phone: string;
  email: string;
  address: string;
  accountStatus: 'Active' | 'Inactive';
  balance: number;
}

export interface Supplier {
  id: string;
  name: string;
  cuit: string;
  phone: string;
  email: string;
  status: 'Active' | 'Inactive' | 'Pending';
  balance: number;
}

export interface Check {
    id: string;
    bank: string;
    number: string;
    issueDate: string;
    dueDate: string;
    amount: number;
    status: 'En cartera' | 'Depositado' | 'Cobrado' | 'Rechazado';
    issuer: string;
}

export interface CartItem extends Product {
    quantity: number;
}

export interface SaleItem extends CartItem {
  // No necesita cambios, hereda 'wholesalePrice' de Product
}

export interface Sale {
  id: string;
  date: string; 
  customerId: string; 
  customerName: string;
  items: SaleItem[];
  subtotal: number;
  tax: number;
  total: number;
  paymentMethod: 'efectivo' | 'debito' | 'cheque' | 'cuenta corriente';
  paidAmount: number;
  dueAmount: number;
}

export interface PurchaseItem {
  productId: string;
  name: string;
  quantity: number;
  costPrice: number;
}

export interface Purchase {
  id: string;
  date: string;
  supplierId: string;
  supplierName: string;
  invoiceNumber: string;
  items: PurchaseItem[];
  total: number;
  status: 'Pendiente de pago' | 'Pagada';
}
