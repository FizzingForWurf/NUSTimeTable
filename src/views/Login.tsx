import { FormEvent, useState } from 'react';
import styles from './Login.scss';
import Register from './Register';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../redux/store';
import { loginUser } from '../redux/UserSlice';
import { useNavigate } from 'react-router-dom';
import GoogleLogin from './GoogleLogin';

import TextField from '@mui/material/TextField';
import {
  Box,
  Button,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const Login = () => {
  const [showRegister, setShowRegister] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const isLoading = useSelector((state: RootState) => state.user.isLoading);
  const loginErrorMsg = useSelector((state: RootState) => state.user.errorMsg);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const handleLogin = (e: FormEvent<HTMLFormElement>) => {
    // Prevent the browser from reloading the page
    e.preventDefault();

    console.log(email, password);
    dispatch(loginUser({ email: email, password: password }))
      .unwrap()
      .then(() => {
        navigate('/', { replace: true });
      })
      .catch((e) => console.log(e));
  };

  return (
    <div className={styles.loginContainer}>
      <form method="post" onSubmit={handleLogin}>
        <FormControl fullWidth>
          <TextField
            required
            label="Email"
            margin="normal"
            type="email"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
            }}
          />
          <Box sx={{ height: 12 }} />
        </FormControl>

        <FormControl fullWidth variant="outlined">
          <InputLabel>Password</InputLabel>
          <OutlinedInput
            required
            margin="dense"
            type={showPassword ? 'text' : 'password'}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={() => setShowPassword(!showPassword)}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            label="Password"
            value={password}
            onChange={(event) => {
              setPassword(event.target.value);
            }}
          />
          <Box sx={{ height: 12 }} />
        </FormControl>

        {loginErrorMsg && (
          <p className={styles.loginErrorMessage}>
            Your email or password is incorrect! Please try again.
          </p>
        )}

        <LoadingButton
          variant="contained"
          loading={isLoading}
          type="submit"
          sx={{ mb: 2, width: '100%', height: 48 }}
        >
          Login
        </LoadingButton>

        <Button
          variant="contained"
          sx={{ mb: 2, width: '100%', height: 48 }}
          onClick={() => setShowRegister(true)}
        >
          Register
        </Button>
      </form>

      <Register show={showRegister} onClose={() => setShowRegister(false)} />
      <GoogleLogin />
    </div>
  );
};

export default Login;
