// Redux Slice for File Handling

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FileState {
  files: { file: File }[];
  previewUrl: string | null;
}

const initialState: FileState = {
  files: [],
  previewUrl: null,
};

const fileSlice = createSlice({
  name: 'file',
  initialState,
  reducers: {
    setFiles(state, action: PayloadAction<{ file: File }[]>) {
      state.files = action.payload;
    },
    setPreviewUrl(state, action: PayloadAction<string>) {
      state.previewUrl = action.payload;
    },
  },
});

export const { setFiles, setPreviewUrl } = fileSlice.actions;
export default fileSlice.reducer;
