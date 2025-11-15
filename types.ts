
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
