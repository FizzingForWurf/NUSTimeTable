import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { autocompleteModule } from '../utils/search';
import { ModuleInformation } from '../types/modules';

const initialState = {
  isLoading: false,
  searchResults: [] as ModuleInformation[],
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
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(searchModule.pending, (state) => {
      state.isLoading = true;
      state.errorMsg = '';
    });
    builder.addCase(searchModule.fulfilled, (state, action) => {
      state.isLoading = false;
      state.searchResults.length = 0;
      state.searchResults.push(...(action.payload || []));
      state.errorMsg = '';
    });
    builder.addCase(searchModule.rejected, (state, action) => {
      state.isLoading = false;
      state.errorMsg = action.error.message || '';
      state.searchResults = [];
      console.log(action.error);
    });
  },
});

export default searchSlice.reducer;
