
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Ad, AdStatus, AdType } from '../../../interfaces/adInterface';

interface AdsState {
  ads: Ad[];
  currentAdType: AdType | null;
  currentAd: Partial<Ad> | null;
}

const initialState: AdsState = {
  ads: [],
  currentAdType: null,
  currentAd: null,
};

const adsSlice = createSlice({
  name: 'ads',
  initialState,
  reducers: {
    setCurrentAdType: (state, action: PayloadAction<AdType>) => {
      state.currentAdType = action.payload;
    },
    addFileData: (state, action: PayloadAction<{ id: string; file: File }>) => {
      state.currentAd = {
        ...state.currentAd,
        id: action.payload.id,
        file: action.payload.file,
        status: 'draft',
      };
    },
    addAdDetails: (state, action: PayloadAction<Ad>) => {
      const newAd: Ad = {
        ...action.payload,
        id: state.currentAd?.id || action.payload.id,
        file: state.currentAd?.file || action.payload.file,
      };
      state.ads.push(newAd);
      state.currentAd = null;
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
  addFileData, 
  addAdDetails, 
  updateAd, 
  updateAdStatus, 
  resetCurrentAdType 
} = adsSlice.actions;

export default adsSlice.reducer;