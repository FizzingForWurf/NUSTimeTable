import { useEffect } from 'react';
import Paths from './Paths';
import Navbar from './views/Navbar';
import { Toaster } from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { firebaseCheckAuthState } from './firebase/FirebaseAuth';
import { signInUser, signOutUser } from './redux/UserSlice';
import { AppDispatch } from './redux/store';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

// Import all scss classnames (NOT as module)
import 'styles/main.scss';

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
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Navbar />
      <Paths />
      <Toaster position="bottom-center" />
    </LocalizationProvider>
  );
}
