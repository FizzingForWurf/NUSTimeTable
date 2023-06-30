import { configureStore } from '@reduxjs/toolkit';
import RegisterSlice from './RegisterSlice';
import UserSlice from './UserSlice';
import SearchSlice from './SearchSlice';
import TimetableSlice from './TimetableSlice';

const Store = configureStore({
  reducer: {
    register: RegisterSlice,
    user: UserSlice,
    search: SearchSlice,
    timetable: TimetableSlice,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof Store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof Store.dispatch;

export default Store;
