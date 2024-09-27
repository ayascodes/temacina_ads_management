import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Ad, AdStatus, AdType } from '../../../interfaces/adInterface'; // Import from your ad interface file

interface AdsState {
  ads: Ad[];
  currentAdType: AdType | null;
}

// Initial state
const initialState: AdsState = {
  ads: [],
  currentAdType: null,
};

const adsSlice = createSlice({
  name: 'ads',
  initialState,
  reducers: {
    // Set the current ad type
    setCurrentAdType: (state, action: PayloadAction<AdType>) => {
      state.currentAdType = action.payload;
    },

    // Add a new ad
    addAd: (state, action: PayloadAction<Ad>) => {
      state.ads.push(action.payload);
    },

    // Update an existing ad by id
    updateAd: (state, action: PayloadAction<Ad>) => {
      const index = state.ads.findIndex(ad => ad.id === action.payload.id);
      if (index !== -1) {
        state.ads[index] = action.payload;
      }
    },

    // Update the status of an ad by id
    updateAdStatus: (state, action: PayloadAction<{ id: string; status: AdStatus }>) => {
      const ad = state.ads.find(ad => ad.id === action.payload.id);
      if (ad) {
        ad.status = action.payload.status;
      }
    },

    // Reset the current ad type
    resetCurrentAdType: (state) => {
      state.currentAdType = null;
    },
  },
});

export const { 
  setCurrentAdType, 
  addAd, 
  updateAd, 
  updateAdStatus, 
  resetCurrentAdType 
} = adsSlice.actions;

export default adsSlice.reducer;