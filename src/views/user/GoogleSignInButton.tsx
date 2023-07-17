import React from 'react';
import 'firebase/compat/auth';
import { Button } from '@mui/material';
import { signInWithGoogle } from 'firebase/FirebaseAuth';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { AppDispatch } from 'redux/store';
import { signInUser } from 'redux/UserSlice';

const GoogleSignInButton: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const handleSignIn = async () => {
    try {
      const user = await signInWithGoogle();
      navigate('/', { replace: true });
      dispatch(signInUser(user));
      console.log(user);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Button
      variant="contained"
      sx={{ mb: 2, width: '100%', height: 48 }}
      onClick={handleSignIn}
    >
      Sign in with Google
    </Button>
  );
};

export default GoogleSignInButton;
