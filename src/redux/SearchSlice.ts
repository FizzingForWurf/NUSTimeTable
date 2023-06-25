import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { autocompleteModule } from '../utils/searchUtils';
import { AutoCompleteResponse } from '../types/modules';

const initialState = {
  isLoading: false,
  searchNumber: 0,
  searchResults: null as AutoCompleteResponse | null,
  errorMsg: '',
};

export const searchModule = createAsyncThunk(
  'search/searchModule',
  (query: string) => {
    return autocompleteModule(query);
  }
);

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    updateSearchResultNo: (state, action: PayloadAction<number>) => {
      state.searchNumber = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(searchModule.pending, (state) => {
      state.isLoading = true;
      state.errorMsg = '';
    });
    builder.addCase(searchModule.fulfilled, (state, action) => {
      state.isLoading = false;
      state.searchResults = action.payload || null;
      state.errorMsg = '';
    });
    builder.addCase(searchModule.rejected, (state, action) => {
      state.isLoading = false;
      state.errorMsg = action.error.message || '';
      state.searchResults = null;
      console.log(action.error);
    });
  },
});

export const { updateSearchResultNo } = searchSlice.actions;
export default searchSlice.reducer;
