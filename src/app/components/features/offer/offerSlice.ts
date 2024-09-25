import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface OfferState {
  selectedOffer: any | null;
}

const initialState: OfferState = {
  selectedOffer: null,
};

const offerSlice = createSlice({
  name: 'offer',
  initialState,
  reducers: {
    setSelectedOffer: (state, action: PayloadAction<any>) => {
      state.selectedOffer = action.payload;
    },
  },
});

export const { setSelectedOffer } = offerSlice.actions;
export default offerSlice.reducer;