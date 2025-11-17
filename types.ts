export interface Product {
  id: string;
  sku: string;
  name: string;
  supplier: string;
  stock: number;
  minStock: number;
  costPrice: number;
  retailPrice: number;
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

// --- INICIO DE NUEVO CÓDIGO ---

export interface SaleItem extends CartItem {
  // Podríamos añadir más campos específicos de la venta si quisiéramos
  // (ej. precio al momento de la venta, descuento aplicado, etc.)
}

export interface Sale {
  id: string;
  date: string; // Guardaremos la fecha como un string ISO (new Date().toISOString())
  customerId: string; // 'final' para Consumidor Final
  customerName: string;
  items: SaleItem[];
  subtotal: number;
  tax: number;
  total: number;
  paymentMethod: 'efectivo' | 'debito' | 'cheque' | 'cuenta corriente';
  paidAmount: number; // Monto que pagó en el momento
  dueAmount: number; // Saldo pendiente (total - paidAmount)
}

// --- FIN DE NUEVO CÓDIGO ---
export interface Product {
  id: string;
  sku: string;
  name: string;
  supplier: string;
  stock: number;
  minStock: number;
  costPrice: number;
  retailPrice: number;
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
