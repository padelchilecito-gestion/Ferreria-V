
import React, { useState } from 'react';
import { mockProducts, mockCustomers } from '../data/mockData';
import { Product, CartItem, Customer } from '../types';
import { SearchIcon, TrashIcon, CheckCircleIcon } from './Icons';

const PointOfSale: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [cart, setCart] = useState<CartItem[]>([]);
    const [selectedCustomer, setSelectedCustomer] = useState<string>('final');
    const [priceType, setPriceType] = useState<'retail' | 'wholesale'>('retail');
    const [paymentMethod, setPaymentMethod] = useState<'efectivo' | 'debito' | 'cheque'>('efectivo');
    const [paidAmount, setPaidAmount] = useState(0);

    const filteredProducts = mockProducts.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        p.sku.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const addToCart = (product: Product) => {
        setCart(prevCart => {
            const existingItem = prevCart.find(item => item.id === product.id);
            if (existingItem) {
                return prevCart.map(item =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...prevCart, { ...product, quantity: 1 }];
        });
    };

    const updateQuantity = (productId: string, quantity: number) => {
        if (quantity <= 0) {
            removeFromCart(productId);
        } else {
            setCart(cart.map(item => item.id === productId ? { ...item, quantity } : item));
        }
    };
    
    const removeFromCart = (productId: string) => {
        setCart(cart.filter(item => item.id !== productId));
    };

    const subtotal = cart.reduce((acc, item) => acc + (item.retailPrice * item.quantity), 0);
    const tax = subtotal * 0.21; // Assuming 21% IVA
    const total = subtotal + tax;
    const change = paidAmount - total;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-6 h-[calc(100vh-8rem)]">
            {/* Left Column: Product Catalog */}
            <div className="lg:col-span-3 bg-white rounded-xl shadow-sm flex flex-col">
                <div className="p-4 border-b">
                    <h2 className="text-lg font-bold text-slate-800">Búsqueda y Catálogo</h2>
                    <div className="relative mt-2">
                        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Buscar por nombre o código..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                        />
                    </div>
                </div>
                <div className="p-4">
                    <div className="flex gap-2 mb-4">
                        {['Herramientas', 'Tornillería', 'Pintura', 'Electricidad'].map(cat => (
                            <button key={cat} className="px-3 py-1 text-sm bg-slate-100 text-slate-600 rounded-full hover:bg-slate-200">{cat}</button>
                        ))}
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                    {filteredProducts.map(product => (
                        <div key={product.id} onClick={() => addToCart(product)} className="p-3 border rounded-lg flex justify-between items-center hover:bg-blue-50 cursor-pointer transition">
                            <div>
                                <p className="font-semibold text-slate-700">{product.name}</p>
                                <p className="text-sm text-slate-500">Stock: {product.stock}</p>
                            </div>
                            <p className="text-lg font-bold text-slate-800">${product.retailPrice.toFixed(2)}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Middle Column: Shopping Cart */}
            <div className="lg:col-span-4 bg-white rounded-xl shadow-sm flex flex-col">
                <div className="p-4 border-b">
                    <h2 className="text-lg font-bold text-slate-800">Carrito de Compra</h2>
                </div>
                <div className="p-4 flex gap-4 items-center border-b">
                    <select value={selectedCustomer} onChange={e => setSelectedCustomer(e.target.value)} className="flex-1 border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition">
                        <option value="final">Consumidor Final</option>
                        {mockCustomers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                    <div className="flex rounded-lg border border-slate-300">
                        <button onClick={() => setPriceType('retail')} className={`px-3 py-2 text-sm rounded-l-md ${priceType === 'retail' ? 'bg-blue-600 text-white' : 'bg-white text-slate-700'}`}>Minorista</button>
                        <button onClick={() => setPriceType('wholesale')} className={`px-3 py-2 text-sm rounded-r-md ${priceType === 'wholesale' ? 'bg-blue-600 text-white' : 'bg-white text-slate-700'}`}>Mayorista</button>
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto p-4">
                    {cart.length === 0 ? (
                        <div className="text-center text-slate-500 pt-10">El carrito está vacío</div>
                    ) : (
                        <div className="space-y-3">
                            {cart.map(item => (
                                <div key={item.id} className="flex items-center gap-4">
                                    <div className="flex-1">
                                        <p className="font-medium text-slate-800">{item.name}</p>
                                        <p className="text-sm text-slate-500">${item.retailPrice.toFixed(2)} / unidad</p>
                                    </div>
                                    <input type="number" value={item.quantity} onChange={(e) => updateQuantity(item.id, parseInt(e.target.value, 10))} className="w-16 text-center border border-slate-300 rounded-md p-1"/>
                                    <p className="w-20 text-right font-semibold">${(item.retailPrice * item.quantity).toFixed(2)}</p>
                                    <button onClick={() => removeFromCart(item.id)} className="text-red-500 hover:text-red-700">
                                        <TrashIcon className="w-5 h-5" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <div className="p-4 border-t bg-slate-50 rounded-b-xl">
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-slate-600">Subtotal</span>
                            <span className="font-medium text-slate-800">${subtotal.toFixed(2)}</span>
                        </div>
                         <div className="flex justify-between">
                            <span className="text-slate-600">Descuento</span>
                            <span className="font-medium text-slate-800">$0.00</span>
                        </div>
                         <div className="flex justify-between">
                            <span className="text-slate-600">IVA (21%)</span>
                            <span className="font-medium text-slate-800">${tax.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-lg font-bold border-t pt-2 mt-2">
                            <span className="text-slate-800">TOTAL</span>
                            <span className="text-blue-600">${total.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Column: Payment */}
            <div className="lg:col-span-3 bg-white rounded-xl shadow-sm flex flex-col">
                <div className="p-4 border-b">
                    <h2 className="text-lg font-bold text-slate-800">Finalización y Métodos de Pago</h2>
                </div>
                <div className="p-4 space-y-3">
                    {['efectivo', 'debito', 'cheque'].map(method => (
                        <button key={method} onClick={() => setPaymentMethod(method as any)} className={`w-full text-left p-4 border rounded-lg transition ${paymentMethod === method ? 'bg-blue-50 border-blue-500 ring-2 ring-blue-500' : 'bg-white border-slate-300'}`}>
                            {method.charAt(0).toUpperCase() + method.slice(1)}
                        </button>
                    ))}
                </div>
                {paymentMethod === 'efectivo' && (
                    <div className="p-4 border-t space-y-4">
                        <div>
                            <label className="text-sm font-medium text-slate-600">Monto Pagado</label>
                            <input type="number" value={paidAmount || ''} onChange={e => setPaidAmount(parseFloat(e.target.value))} className="w-full mt-1 p-2 border border-slate-300 rounded-lg text-lg text-right" placeholder="$ 0.00" />
                        </div>
                         <div>
                            <label className="text-sm font-medium text-slate-600">Cambio</label>
                            <div className="w-full mt-1 p-2 border bg-slate-100 border-slate-300 rounded-lg text-lg text-right font-bold text-blue-600">
                                {change >= 0 ? `$${change.toFixed(2)}` : '-'}
                            </div>
                        </div>
                    </div>
                )}
                <div className="flex-1"></div>
                <div className="p-4">
                    <button className="w-full flex items-center justify-center gap-2 bg-green-600 text-white font-bold py-4 rounded-lg hover:bg-green-700 transition shadow-sm disabled:bg-slate-300" disabled={cart.length === 0}>
                        <CheckCircleIcon className="w-6 h-6" />
                        Finalizar Venta
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PointOfSale;
