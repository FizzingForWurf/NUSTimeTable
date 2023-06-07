import { configureStore } from '@reduxjs/toolkit';
import RegisterSlice from './RegisterSlice';
import UserSlice from './UserSlice';
import ModuleDataSlice from './ModuleDataSlice';

const Store = configureStore({
  reducer: {
    register: RegisterSlice,
    user: UserSlice,
    moduleData: ModuleDataSlice,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof Store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof Store.dispatch;

export default Store;
