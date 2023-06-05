import { useEffect } from 'react';
import Paths from './Paths';
import Navbar from './views/Navbar';
import { Toaster } from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { firebaseCheckAuthState } from './firebase/FirebaseAuth';
import { signInUser, signOutUser } from './redux/UserSlice';
import { AppDispatch } from './redux/store';

export function App() {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const unsubscribe = firebaseCheckAuthState((user) => {
      if (user) dispatch(signInUser(user));
      else dispatch(signOutUser());
    });
    unsubscribe();
  }, []);

  return (
    <>
      <Navbar />
      <Paths />
      <Toaster position="bottom-center" />
    </>
  );
}
