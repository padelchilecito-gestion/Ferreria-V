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

// --- INICIO DE MODIFICACIÓN 1 ---
export interface Supplier {
  id: string;
  name: string;
  cuit: string;
  phone: string;
  email: string;
  status: 'Active' | 'Inactive' | 'Pending';
  balance: number; // Saldo que adeudamos al proveedor
}
// --- FIN DE MODIFICACIÓN 1 ---

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
  // (Sin cambios)
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

// --- INICIO DE NUEVO CÓDIGO ---

export interface PurchaseItem {
  productId: string;
  name: string; // Guardamos el nombre al momento de la compra
  quantity: number;
  costPrice: number; // Precio de costo al momento de la compra
}

export interface Purchase {
  id: string;
  date: string;
  supplierId: string;
  supplierName: string;
  invoiceNumber: string; // Número de factura/remito del proveedor
  items: PurchaseItem[];
  total: number;
  status: 'Pendiente de pago' | 'Pagada';
}

// --- FIN DE NUEVO CÓDIGO ---
