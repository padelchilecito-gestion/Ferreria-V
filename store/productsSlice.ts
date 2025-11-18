import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Product } from '../types';
import { db } from '../firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';

interface ProductsState {
  products: Product[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: ProductsState = {
  products: [],
  status: 'idle',
  error: null,
};

// 1. Obtener productos (Fetch)
export const fetchProducts = createAsyncThunk('products/fetchProducts', async () => {
  const querySnapshot = await getDocs(collection(db, "products"));
  const products: Product[] = [];
  querySnapshot.forEach((doc) => {
    products.push({ id: doc.id, ...doc.data() } as Product);
  });
  return products;
});

// 2. Añadir producto
export const addProduct = createAsyncThunk('products/addProduct', async (newProduct: Omit<Product, 'id'>) => {
  const docRef = await addDoc(collection(db, "products"), newProduct);
  return { id: docRef.id, ...newProduct } as Product;
});

// 3. Actualizar producto (Edición general)
export const updateProduct = createAsyncThunk('products/updateProduct', async (product: Product) => {
  const { id, ...data } = product;
  const productRef = doc(db, "products", id);
  await updateDoc(productRef, data as any); // 'as any' para evitar conflictos estrictos de tipo parcial
  return product;
});

// 4. Eliminar producto
export const deleteProduct = createAsyncThunk('products/deleteProduct', async (id: string) => {
  await deleteDoc(doc(db, "products", id));
  return id;
});

// 5. Acciones especiales de Stock (Ventas, Ajustes, Compras)
// Reducir stock (Venta)
export const reduceStock = createAsyncThunk('products/reduceStock', async ({ id, quantity }: { id: string; quantity: number }, { getState }) => {
    const state = getState() as any;
    const product = state.products.products.find((p: Product) => p.id === id);
    if (product) {
        const newStock = product.stock - quantity;
        const productRef = doc(db, "products", id);
        await updateDoc(productRef, { stock: newStock });
        return { id, stock: newStock };
    }
    throw new Error("Producto no encontrado");
});

// Ajustar stock (Manual)
export const adjustStock = createAsyncThunk('products/adjustStock', async ({ id, newStock }: { id: string; newStock: number }) => {
    const productRef = doc(db, "products", id);
    await updateDoc(productRef, { stock: newStock });
    return { id, stock: newStock };
});

// Incrementar stock (Compra) - También actualiza costo si se provee
export const increaseStock = createAsyncThunk('products/increaseStock', async ({ productId, quantity, newCostPrice }: { productId: string; quantity: number; newCostPrice?: number }, { getState }) => {
    const state = getState() as any;
    const product = state.products.products.find((p: Product) => p.id === productId);
    
    if (product) {
        const newStock = product.stock + quantity;
        const updates: any = { stock: newStock };
        
        // Si hay nuevo precio de costo y es diferente, lo actualizamos
        if (newCostPrice !== undefined && newCostPrice !== product.costPrice) {
            updates.costPrice = newCostPrice;
        }

        const productRef = doc(db, "products", productId);
        await updateDoc(productRef, updates);
        
        return { id: productId, ...updates }; // Devolvemos los campos actualizados
    }
    throw new Error("Producto no encontrado");
});


export const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchProducts.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      })
      // Add
      .addCase(addProduct.fulfilled, (state, action) => {
        state.products.push(action.payload);
      })
      // Update
      .addCase(updateProduct.fulfilled, (state, action) => {
        const index = state.products.findIndex(p => p.id === action.payload.id);
        if (index !== -1) state.products[index] = action.payload;
      })
      // Delete
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.products = state.products.filter(p => p.id !== action.payload);
      })
      // Reduce Stock
      .addCase(reduceStock.fulfilled, (state, action) => {
        const product = state.products.find(p => p.id === action.payload.id);
        if (product) product.stock = action.payload.stock;
      })
      // Adjust Stock
      .addCase(adjustStock.fulfilled, (state, action) => {
        const product = state.products.find(p => p.id === action.payload.id);
        if (product) product.stock = action.payload.stock;
      })
      // Increase Stock
      .addCase(increaseStock.fulfilled, (state, action) => {
          const product = state.products.find(p => p.id === action.payload.id);
          if (product) {
              product.stock = action.payload.stock;
              if (action.payload.costPrice !== undefined) {
                  product.costPrice = action.payload.costPrice;
              }
          }
      });
  },
});

export default productsSlice.reducer;
