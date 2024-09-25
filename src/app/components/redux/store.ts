'use client';

import { configureStore } from '@reduxjs/toolkit';
import productReducer from '../features/product/productSlice';
import offerReducer from '../features/offer/offerSlice'; // Import offer slice
import adsReducer from '../features/ad/adSlice'; // Import ads slice

export const makeStore = () => {
  return configureStore({
    reducer: {
      product: productReducer,
      offer: offerReducer,
      ads: adsReducer, // Add ads reducer here
    },
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
