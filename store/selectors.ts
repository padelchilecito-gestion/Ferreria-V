// store/selectors.ts
import { createSelector } from '@reduxjs/toolkit';
import { RootState } from './index';
import { Sale, Check, Product, Customer, Supplier, Purchase } from '../types';

// --- Selectores Base (Sacan los slices del estado) ---
export const selectProductsState = (state: RootState) => state.products;
export const selectCustomersState = (state: RootState) => state.customers;
export const selectSalesState = (state: RootState) => state.sales;
export const selectChecksState = (state: RootState) => state.checks;
// Agregamos los nuevos estados base
export const selectSuppliersState = (state: RootState) => state.suppliers;
export const selectPurchasesState = (state: RootState) => state.purchases;

// --- Selectores de Estado Directo (Devuelven los arrays de datos) ---
export const selectAllProducts = (state: RootState) => state.products.products;
export const selectAllCustomers = (state: RootState) => state.customers.customers;
export const selectAllSales = (state: RootState) => state.sales.sales;
export const selectAllChecks = (state: RootState) => state.checks.checks;
// Agregamos los selectores específicos que faltaban
export const selectAllSuppliers = (state: RootState) => state.suppliers.suppliers;
export const selectAllPurchases = (state: RootState) => state.purchases.purchases;

// --- Helpers (Funciones Puras) ---
const getTodayString = () => {
    const today = new Date();
    today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
    return today.toISOString().split('T')[0];
};

const aggregateSalesByDay = (sales: Sale[]) => {
    const weeklySales: { [key: number]: { name: string, Ventas: number } } = {
        0: { name: "Dom", Ventas: 0 }, 1: { name: "Lun", Ventas: 0 }, 2: { name: "Mar", Ventas: 0 },
        3: { name: "Mié", Ventas: 0 }, 4: { name: "Jue", Ventas: 0 }, 5: { name: "Vie", Ventas: 0 },
        6: { name: "Sáb", Ventas: 0 },
    };
    const today = new Date();
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(today.getDate() - 7);

    sales.forEach(sale => {
        const saleDate = new Date(sale.date);
        if (saleDate >= oneWeekAgo) {
            const dayOfWeek = saleDate.getDay();
            weeklySales[dayOfWeek].Ventas += sale.total;
        }
    });
    return [ weeklySales[1], weeklySales[2], weeklySales[3], weeklySales[4], weeklySales[5], weeklySales[6], weeklySales[0] ];
};

const getUpcomingChecks = (checks: Check[], daysThreshold: number = 7) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayTime = today.getTime();
    const msInDay = 1000 * 60 * 60 * 24;

    return checks
        .filter(check => check.status === 'En cartera')
        .map(check => {
            const dateParts = check.dueDate.split('-').map(part => parseInt(part, 10));
            const dueDate = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
            dueDate.setHours(0,0,0,0);
            const daysRemaining = Math.round((dueDate.getTime() - todayTime) / msInDay);
            return { ...check, daysRemaining };
        })
        .filter(check => check.daysRemaining >= 0 && check.daysRemaining <= daysThreshold)
        .sort((a, b) => a.daysRemaining - b.daysRemaining);
};

// --- Selectores Computados (Memorizados) para Dashboard ---

export const selectSalesToday = createSelector(
    [selectAllSales],
    (allSales) => {
        const todayStr = getTodayString();
        return allSales.filter(s => s.date.startsWith(todayStr));
    }
);

export const selectDashboardStats = createSelector(
    [selectSalesToday],
    (salesTodayArr) => {
        const totalSales = salesTodayArr.reduce((acc, s) => acc + s.total, 0);
        
        const totalCost = salesTodayArr.reduce((accSale, sale) => {
            return accSale + sale.items.reduce((accItem, item) => {
                return accItem + (item.costPrice * item.quantity);
            }, 0);
        }, 0);

        const totalProfit = totalSales - totalCost;
        
        return { salesToday: totalSales, profitToday: totalProfit };
    }
);

export const selectSalesChartData = createSelector(
    [selectAllSales],
    (allSales) => aggregateSalesByDay(allSales)
);

export const selectLowStockProductCount = createSelector(
    [selectAllProducts],
    (allProducts) => allProducts.filter(p => p.stock <= p.minStock).length
);

export const selectLowStockProducts = createSelector(
    [selectAllProducts],
    (allProducts) => allProducts.filter(p => p.stock <= p.minStock).slice(0, 5)
);

export const selectCustomerCount = createSelector(
    [selectAllCustomers],
    (allCustomers) => allCustomers.length
);

export const selectUpcomingChecks = createSelector(
    [selectAllChecks],
    (allChecks) => getUpcomingChecks(allChecks, 7) // Alerta con 7 días de antelación
);

// --- Selectores Computados (Memorizados) para Reports ---

export const selectAggregateSalesByMonth = createSelector(
    [selectAllSales],
    (allSales) => {
        const monthNames = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
        const monthlySales: { [key: string]: number } = {};

        allSales.forEach(sale => {
            const date = new Date(sale.date);
            const monthKey = `${date.getFullYear()}-${monthNames[date.getMonth()]}`;
            if (!monthlySales[monthKey]) {
                monthlySales[monthKey] = 0;
            }
            monthlySales[monthKey] += sale.total;
        });

        return Object.keys(monthlySales).map(key => ({
            name: key,
            Ventas: monthlySales[key],
        })).slice(-12);
    }
);

export const selectProductCategories = createSelector(
    [selectAllProducts],
    (allProducts) => {
        const productCategories = allProducts.reduce((acc, product) => {
            acc[product.category] = (acc[product.category] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        return Object.keys(productCategories).map(key => ({ name: key, value: productCategories[key] }));
    }
);

export const selectInventoryValue = createSelector(
    [selectAllProducts],
    (allProducts) => allProducts.reduce((acc, p) => acc + (p.costPrice * p.stock), 0)
);

export const selectCustomerRanking = createSelector(
    [selectAllCustomers],
    (allCustomers) => allCustomers
        .filter(c => c.balance > 0)
        .sort((a, b) => b.balance - a.balance)
        .slice(0, 5)
);
