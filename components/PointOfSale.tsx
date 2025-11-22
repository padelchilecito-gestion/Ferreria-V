import React, { useState, useMemo } from 'react';
import { Product, Sale } from '../types';
import { SearchIcon, TrashIcon, CheckCircleIcon, CreditCardIcon } from './Icons';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { addToCart, updateQuantity, removeFromCart, clearCart } from '../store/cartSlice';
import { reduceStock } from '../store/productsSlice';
import { addSale } from '../store/salesSlice';
import { updateCustomerBalance } from '../store/customersSlice';

// --- CONFIGURACIÓN DE TARJETAS (ARGENTINA) ---
// Tasas y plazos simulados. Ajustar según los coeficientes reales de tu posnet/procesador (Payway, Posnet, MercadoPago, etc.)
const CREDIT_CARD_PLANS = [
    // VISA
    { id: 'visa-1', name: 'Visa - 1 pago', installments: 1, interest: 0, accreditationDays: 10 },
    { id: 'visa-3', name: 'Visa - 3 cuotas', installments: 3, interest: 0.15, accreditationDays: 2 }, // Cuota Simple / Ahora 3
    { id: 'visa-6', name: 'Visa - 6 cuotas', installments: 6, interest: 0.35, accreditationDays: 5 }, // Cuota Simple / Ahora 6
    { id: 'visa-12', name: 'Visa - 12 cuotas', installments: 12, interest: 0.75, accreditationDays: 5 }, // Cuota Simple / Ahora 12
    
    // MASTERCARD
    { id: 'master-1', name: 'Mastercard - 1 pago', installments: 1, interest: 0, accreditationDays: 10 },
    { id: 'master-3', name: 'Mastercard - 3 cuotas', installments: 3, interest: 0.15, accreditationDays: 2 },
    { id: 'master-6', name: 'Mastercard - 6 cuotas', installments: 6, interest: 0.35, accreditationDays: 5 },
    
    // NARANJA X
    { id: 'naranja-1', name: 'Naranja X - 1 pago', installments: 1, interest: 0, accreditationDays: 15 },
    { id: 'naranja-z', name: 'Naranja X - Plan Z (3 ctas)', installments: 3, interest: 0.10, accreditationDays: 15 }, // Simulación costo financiero
    { id: 'naranja-6', name: 'Naranja X - 6 cuotas', installments: 6, interest: 0.40, accreditationDays: 15 },

    // AMEX
    { id: 'amex-1', name: 'Amex - 1 pago', installments: 1, interest: 0, accreditationDays: 10 },
    { id: 'amex-3', name: 'Amex - 3 cuotas', installments: 3, interest: 0.18, accreditationDays: 5 },

    // CABAL
    { id: 'cabal-1', name: 'Cabal - 1 pago', installments: 1, interest: 0, accreditationDays: 10 },
    { id: 'cabal-3', name: 'Cabal - 3 cuotas', installments: 3, interest: 0.15, accreditationDays: 48 },
];

const PointOfSale: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCustomer, setSelectedCustomer] = useState<string>('final');
    const [priceType, setPriceType] = useState<'retail' | 'wholesale'>('retail');
    const [paymentMethod, setPaymentMethod] = useState<'efectivo' | 'debito' | 'cheque' | 'cuenta corriente' | 'credito'>('efectivo');
    const [paidAmount, setPaidAmount] = useState(0);
    // Estado para el costo de flete
    const [freightCost, setFreightCost] = useState(0);
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [isProcessing, setIsProcessing] = useState(false);
    
    const [selectedCardPlanId, setSelectedCardPlanId] = useState(CREDIT_CARD_PLANS[0].id);

    const dispatch = useDispatch<AppDispatch>();
    const cart = useSelector((state: RootState) => state.cart.items);
    const allProducts = useSelector((state: RootState) => state.products.products);
    const allCustomers = useSelector((state: RootState) => state.customers.customers);
    const taxRate = useSelector((state: RootState) => state.settings.taxRate);

    const uniqueCategories = useMemo(() => {
        return [...new Set(allProducts.map(p => p.category).filter(Boolean))];
    }, [allProducts]);

    const filteredProducts = allProducts.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              p.sku.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter;
        return matchesSearch && matchesCategory;
    });

    const dispatchAddToCart = (product: Product) => {
        dispatch(addToCart(product));
    };
    const dispatchUpdateQuantity = (productId: string, quantity: number) => {
        if (quantity <= 0) {
            dispatch(removeFromCart(productId));
        } else {
            dispatch(updateQuantity({ id: productId, quantity }));
        }
    };
    const dispatchRemoveFromCart = (productId: string) => {
        dispatch(removeFromCart(productId));
    };

    const getPrice = (item: Product) => {
        if (!item.wholesalePrice || item.wholesalePrice <= 0) {
            return item.retailPrice;
        }
        return priceType === 'wholesale' ? item.wholesalePrice : item.retailPrice;
    };

    // Cálculo de totales
    const subtotal = cart.reduce((acc, item) => {
        const price = getPrice(item);
        return acc + (price * item.quantity);
    }, 0);
    
    const tax = subtotal * taxRate;
    
    // El flete se suma al subtotal e impuestos para formar la base imponible final
    const baseTotal = subtotal + tax + Number(freightCost);
    
    // Cálculos específicos de tarjeta
    let surcharge = 0;
    let accreditationText = '';
    let installmentAmount = 0;

    if (paymentMethod === 'credito') {
        const plan = CREDIT_CARD_PLANS.find(p => p.id === selectedCardPlanId);
        if (plan) {
            // El interés se calcula sobre el total (incluyendo flete)
            surcharge = baseTotal * plan.interest;
            const finalCardTotal = baseTotal + surcharge;
            installmentAmount = finalCardTotal / plan.installments;
            accreditationText = `Se acredita en ${plan.accreditationDays} días hábiles (aprox)`;
        }
    }

    const total = baseTotal + surcharge;
    
    const getPaidAmount = () => {
        switch(paymentMethod) {
            case 'efectivo': return paidAmount;
            case 'debito': case 'cheque': case 'credito': return total;
            case 'cuenta corriente': return 0;
            default: return 0;
        }
    };
    
    const finalPaidAmount = getPaidAmount();
    const dueAmount = total - finalPaidAmount;
    const change = finalPaidAmount > total ? finalPaidAmount - total : 0;

    const handleFinalizeSale = async () => {
        if (cart.length === 0) return;
        setIsProcessing(true);

        const customerName = selectedCustomer === 'final'
            ? 'Consumidor Final'
            : allCustomers.find(c => c.id === selectedCustomer)?.name || 'Cliente Eliminado';

        const newSaleData = {
            date: new Date().toISOString(),
            customerId: selectedCustomer,
            customerName: customerName,
            items: cart, 
            subtotal: subtotal,
            tax: tax,
            freightCost: Number(freightCost),
            total: total,
            paymentMethod: paymentMethod,
            paidAmount: finalPaidAmount,
            dueAmount: dueAmount,
        };

        try {
            await dispatch(addSale(newSaleData)).unwrap();

            const stockPromises = cart.map(item => 
                dispatch(reduceStock({ id: item.id, quantity: item.quantity })).unwrap()
            );
            await Promise.all(stockPromises);

            if (selectedCustomer !== 'final' && dueAmount !== 0) {
                await dispatch(updateCustomerBalance({ customerId: selectedCustomer, dueAmount: dueAmount })).unwrap();
            }

            // Limpiar
            dispatch(clearCart());
            setPaidAmount(0);
            setFreightCost(0);
            setSelectedCustomer('final');
            setPaymentMethod('efectivo');
            alert("Venta realizada con éxito");

        } catch (error) {
            console.error("Error en la venta:", error);
            alert("Hubo un error al procesar la venta. Revise su conexión.");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-6 h-[calc(100vh-8rem)]">
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
                <div className="p-4 overflow-x-auto">
                    <div className="flex gap-2 mb-4 whitespace-nowrap">
                        <button onClick={() => setCategoryFilter('all')} className={`px-3 py-1 text-sm rounded-full transition-colors ${categoryFilter === 'all' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>Todas</button>
                        {uniqueCategories.map(cat => (
                            <button key={cat} onClick={() => setCategoryFilter(cat)} className={`px-3 py-1 text-sm rounded-full transition-colors ${categoryFilter === cat ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>{cat}</button>
                        ))}
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                    {filteredProducts.map(product => (
                        <div key={product.id} onClick={() => dispatchAddToCart(product)} className="p-3 border rounded-lg flex justify-between items-center hover:bg-blue-50 cursor-pointer transition">
                            <div>
                                <p className="font-semibold text-slate-700">{product.name}</p>
                                <p className="text-sm text-slate-500">Stock: {product.stock}</p>
                            </div>
                            <p className="text-lg font-bold text-slate-800">${getPrice(product).toFixed(2)}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="lg:col-span-4 bg-white rounded-xl shadow-sm flex flex-col">
                <div className="p-4 border-b">
                    <h2 className="text-lg font-bold text-slate-800">Carrito de Compra</h2>
                </div>
                <div className="p-4 flex gap-4 items-center border-b">
                    <select value={selectedCustomer} onChange={e => setSelectedCustomer(e.target.value)} className="flex-1 border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition">
                        <option value="final">Consumidor Final</option>
                        {allCustomers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
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
                            {cart.map(item => {
                                const price = getPrice(item);
                                return (
                                    <div key={item.id} className="flex items-center gap-4">
                                        <div className="flex-1">
                                            <p className="font-medium text-slate-800">{item.name}</p>
                                            <p className="text-sm text-slate-500">${price.toFixed(2)} / unidad</p>
                                        </div>
                                        <input type="number" value={item.quantity} onChange={(e) => dispatchUpdateQuantity(item.id, parseInt(e.target.value, 10))} className="w-16 text-center border border-slate-300 rounded-md p-1"/>
                                        <p className="w-20 text-right font-semibold">${(price * item.quantity).toFixed(2)}</p>
                                        <button onClick={() => dispatchRemoveFromCart(item.id)} className="text-red-500 hover:text-red-700">
                                            <TrashIcon className="w-5 h-5" />
                                        </button>
                                    </div>
                                );
                            })}
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
                            <span className="text-slate-600">IVA ({(taxRate * 100).toFixed(0)}%)</span>
                            <span className="font-medium text-slate-800">${tax.toFixed(2)}</span>
                        </div>
                        
                        {/* --- CAMPO DE FLETE --- */}
                        <div className="flex justify-between items-center py-1">
                            <span className="text-slate-600 font-medium">Envío / Flete</span>
                            <div className="flex items-center">
                                <span className="text-slate-500 mr-2 text-xs">$</span>
                                <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={freightCost === 0 ? '' : freightCost}
                                    onChange={e => setFreightCost(Number(e.target.value))}
                                    className="w-20 p-1 text-right border border-slate-300 rounded text-sm focus:ring-1 focus:ring-blue-500 outline-none"
                                    placeholder="0.00"
                                />
                            </div>
                        </div>

                         {paymentMethod === 'credito' && (
                            <div className="flex justify-between text-blue-600 pt-1 border-t border-slate-100">
                                <span className="">Recargo Tarjeta ({(CREDIT_CARD_PLANS.find(p => p.id === selectedCardPlanId)?.interest || 0) * 100}%)</span>
                                <span className="font-medium">+ ${surcharge.toFixed(2)}</span>
                            </div>
                        )}
                        <div className="flex justify-between text-lg font-bold border-t pt-2 mt-2">
                            <span className="text-slate-800">TOTAL</span>
                            <span className="text-blue-600">${total.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="lg:col-span-3 bg-white rounded-xl shadow-sm flex flex-col">
                <div className="p-4 border-b">
                    <h2 className="text-lg font-bold text-slate-800">Finalización y Métodos de Pago</h2>
                </div>
                <div className="p-4 space-y-3">
                    {['efectivo', 'debito', 'cheque', 'credito', 'cuenta corriente'].map(method => (
                        <button 
                            key={method} 
                            onClick={() => setPaymentMethod(method as any)} 
                            className={`w-full text-left p-4 border rounded-lg transition flex items-center gap-2 ${paymentMethod === method ? 'bg-blue-50 border-blue-500 ring-2 ring-blue-500' : 'bg-white border-slate-300'} ${method === 'cuenta corriente' && selectedCustomer === 'final' ? 'opacity-50 cursor-not-allowed' : ''}`}
                            disabled={method === 'cuenta corriente' && selectedCustomer === 'final'}
                        >
                            {method === 'credito' && <CreditCardIcon className="w-5 h-5 text-slate-500" />}
                            {method.charAt(0).toUpperCase() + method.slice(1)}
                            {method === 'cuenta corriente' && selectedCustomer === 'final' && <span className="text-xs text-red-500 ml-2">(Solo clientes)</span>}
                        </button>
                    ))}
                </div>

                {/* SECCIÓN DE TARJETA DE CRÉDITO */}
                {paymentMethod === 'credito' && (
                    <div className="p-4 border-t bg-blue-50 space-y-3 animate-in fade-in">
                        <label className="text-sm font-medium text-slate-700 block">Plan de Financiación</label>
                        <select 
                            value={selectedCardPlanId} 
                            onChange={e => setSelectedCardPlanId(e.target.value)}
                            className="w-full p-2 border border-blue-300 rounded-lg bg-white"
                        >
                            {CREDIT_CARD_PLANS.map(plan => (
                                <option key={plan.id} value={plan.id}>
                                    {plan.name} {plan.interest > 0 ? `(+${(plan.interest * 100).toFixed(0)}%)` : '(Sin interés)'}
                                </option>
                            ))}
                        </select>
                        
                        <div className="text-sm text-slate-600 space-y-1 mt-2 p-2 bg-white rounded border border-blue-200">
                            <div className="flex justify-between">
                                <span>Cuotas:</span>
                                <span className="font-bold">
                                    {CREDIT_CARD_PLANS.find(p => p.id === selectedCardPlanId)?.installments} x ${installmentAmount.toFixed(2)}
                                </span>
                            </div>
                            <div className="flex justify-between text-xs text-slate-500 pt-1 border-t border-slate-100">
                                <span>Acreditación:</span>
                                <span>{accreditationText}</span>
                            </div>
                        </div>
                    </div>
                )}

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
                    <button 
                        onClick={handleFinalizeSale}
                        className="w-full flex items-center justify-center gap-2 bg-green-600 text-white font-bold py-4 rounded-lg hover:bg-green-700 transition shadow-sm disabled:bg-slate-300" 
                        disabled={cart.length === 0 || isProcessing}
                    >
                        <CheckCircleIcon className="w-6 h-6" />
                        {isProcessing ? 'Procesando...' : 'Finalizar Venta'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PointOfSale;
