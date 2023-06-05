import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { firebaseRegisterUser } from '../firebase/FirebaseAuth';
import { toast } from 'react-hot-toast';

const initialState = {
  isLoading: false,
  errorMsg: '',
};

export const registerUser = createAsyncThunk(
  'register/registerUser',
  (params: { email: string; password: string }) => {
    const { email, password } = params;
    return firebaseRegisterUser(email, password);
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
      toast.success('Successfully registered!');
    });
    builder.addCase(registerUser.rejected, (state, action) => {
      state.isLoading = false;

      state.errorMsg = action.error.message || '';
      console.log('ERROR: ', action.error.message);

      if (action.error.code == 'auth/email-already-in-use')
        toast.error('Email already in use! Please try logging in.');
    });
  },
});

export default registerSlice.reducer;
