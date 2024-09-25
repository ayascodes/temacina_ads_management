import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Ad } from '../../../interfaces/adInterface'; // Import from your ad interface file

interface AdsState {
  ads: Ad[];
}

// Initial state
const initialState: AdsState = {
  ads: [],
};

const adsSlice = createSlice({
  name: 'ads',
  initialState,
  reducers: {
    // Add a new ad
    addAd: (state, action: PayloadAction<Ad>) => {
      state.ads.push(action.payload);
    },
    // Update an existing ad by productId
    updateAd: (state, action: PayloadAction<Ad>) => {
      const index = state.ads.findIndex(ad => ad.productId === action.payload.productId);
      if (index !== -1) {
        state.ads[index] = action.payload;
      }
    },
    // Update the status of an ad by productId
    updateAdStatus: (state, action: PayloadAction<{ productId: string; status: AdStatus }>) => {
      const ad = state.ads.find(ad => ad.productId === action.payload.productId);
      if (ad) {
        ad.status = action.payload.status;
      }
    },
  },
});

export const { addAd, updateAd, updateAdStatus } = adsSlice.actions;
export default adsSlice.reducer;




/* import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AdsState {
  ads: Ad[];
}

const initialState: AdsState = {
  ads: [],
};

const adsSlice = createSlice({
  name: 'ads',
  initialState,
  reducers: {
    addAd: (state, action: PayloadAction<Ad>) => {
      state.ads.push(action.payload);
    },
    updateAd: (state, action: PayloadAction<Ad>) => {
      const index = state.ads.findIndex(ad => ad.productId === action.payload.productId);
      if (index !== -1) {
        state.ads[index] = action.payload;
      }
    },
    updateAdStatus: (state, action: PayloadAction<{ productId: string; status: AdStatus }>) => {
      const ad = state.ads.find(ad => ad.productId === action.payload.productId);
      if (ad) {
        ad.status = action.payload.status;
      }
    },
  },
});

export const { addAd, updateAd, updateAdStatus } = adsSlice.actions;
export default adsSlice.reducer; */