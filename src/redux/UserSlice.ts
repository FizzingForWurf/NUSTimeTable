import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { firebaseSignInUser } from '../Firebase/FirebaseAuth';
import { User } from 'firebase/auth';
import toast from 'react-hot-toast';

const initialState = {
  isLoading: false,
  user: null as User | null,
  errorMsg: '',
};

export const loginUser = createAsyncThunk(
  'user/loginUser',
  (params: { email: string; password: string }) => {
    const { email, password } = params;
    return firebaseSignInUser(email, password);
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    signInUser: (state, action) => {
      state.user = action.payload;
      state.errorMsg = '';
      state.isLoading = false;
    },
    signOutUser: (state) => {
      state.user = null;
      state.errorMsg = '';
      state.isLoading = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loginUser.pending, (state) => {
      state.isLoading = true;
      state.errorMsg = '';
    });
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.isLoading = false;
      state.user = action.payload.user;
      state.errorMsg = '';

      console.log(action.payload);
      toast.success('Logged in successfully!');
    });
    builder.addCase(loginUser.rejected, (state, action) => {
      state.isLoading = false;
      state.errorMsg = action.error.message || '';
      state.user = null;

      console.log(action.error);
      toast.error('Error logging in!');
    });
  },
});

export const { signInUser, signOutUser } = userSlice.actions;
export default userSlice.reducer;
