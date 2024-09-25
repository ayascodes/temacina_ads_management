'use client';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define the product slice's state interface
interface ProductState {
  selectedProductId: string | null;
}

// Initial state for the product slice
const initialState: ProductState = {
  selectedProductId: null,
};

// Create the slice
const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    // Action to select a product
    selectProduct(state, action: PayloadAction<string>) {
      state.selectedProductId = action.payload;
    },
  },
});

// Export the action and the reducer
export const { selectProduct } = productSlice.actions;
export default productSlice.reducer;
