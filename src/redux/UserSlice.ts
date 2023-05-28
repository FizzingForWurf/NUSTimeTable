import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isLoading: false,
  errorMsg: '',
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    loading: (state) => {
      state.isLoading = true;
    },
    error: (state, action) => {
      state.isLoading = false;
      state.errorMsg = action.payload;
    },
  },
});

export const { loading, error } = userSlice.actions;
export default userSlice.reducer;
