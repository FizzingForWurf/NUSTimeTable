import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { firebaseRegisterUser } from '../Firebase/FirebaseAuth';

const initialState = {
  isLoading: false,
  errorMsg: '',
};

export const registerUser = createAsyncThunk(
  'register/registerUser',
  (params: {
    email: string;
    password: string;
    closeRegisterPage: () => void;
  }) => {
    const { email, password, closeRegisterPage } = params;
    return firebaseRegisterUser(email, password, closeRegisterPage);
  }
);

const registerSlice = createSlice({
  name: 'register',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(registerUser.pending, (state) => {
      state.isLoading = true;
      state.errorMsg = '';
    });
    builder.addCase(registerUser.fulfilled, (state, action) => {
      state.isLoading = false;
      state.errorMsg = '';
      console.log('Successfully register user: ', action.payload);
    });
    builder.addCase(registerUser.rejected, (state, action) => {
      state.isLoading = false;
      state.errorMsg = action.error.message || '';
    });
  },
  // reducers: {
  //     loading: (state) => {
  //         state.isLoading = true;
  //     },
  //     error: (state, action) => {
  //         state.isLoading = false;
  //         state.errorMsg = action.payload;
  //     }
  // }
});

// export const { loading, error } = registerSlice.actions
export default registerSlice.reducer;
