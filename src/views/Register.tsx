import { FormEvent, useState } from 'react';

import {
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  FilledInput,
} from '@mui/material';

import { AppDispatch, RootState } from '../redux/store';
import { registerUser } from '../redux/RegisterSlice';
import { useDispatch, useSelector } from 'react-redux';

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';

type RegisterProps = {
  show: boolean;
  onClose: () => void;
};

const NOT_MATCHING_PW_ERROR = 'Passwords do not match!';
const INVALID_PW_LENGTH_ERROR =
  'Password is too short! Please use at least 6 characters';

const Register = ({ show, onClose }: RegisterProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const isLoading = useSelector((state: RootState) => state.register.isLoading);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPW, setConfirmPW] = useState('');
  const [showError, setShowError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = (e: FormEvent<HTMLFormElement>) => {
    // Prevent the browser from reloading the page
    e.preventDefault();

    const samePW = password === confirmPW;
    const validPwLength = password.length >= 6;

    if (!samePW) setShowError(NOT_MATCHING_PW_ERROR);
    else if (!validPwLength) setShowError(INVALID_PW_LENGTH_ERROR);
    else {
      setShowError('');
      console.log('Register user with: ', email, password);

      dispatch(
        registerUser({
          email: email,
          password: password,
        })
      )
        .unwrap()
        .then(() => {
          //onClose();
        })
        .catch((e) => console.log(e));
    }
  };

  return (
    <Dialog open={show} onClose={onClose}>
      <form onSubmit={handleRegister}>
        <DialogTitle>Register</DialogTitle>
        <DialogContent>
          <TextField
            required
            id="name"
            label="Email Address"
            type="email"
            fullWidth
            variant="filled"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
            }}
            sx={{ mb: 2 }}
          />

          <FormControl fullWidth variant="filled">
            <InputLabel error={showError !== ''}>Password</InputLabel>
            <FilledInput
              required
              error={showError !== ''}
              type={showPassword ? 'text' : 'password'}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
              }}
              sx={{ mb: 2 }}
            />
          </FormControl>

          <FormControl fullWidth variant="filled">
            <InputLabel error={showError !== ''}>Confirm Password</InputLabel>
            <FilledInput
              required
              error={showError !== ''}
              type={showPassword ? 'text' : 'password'}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              value={confirmPW}
              onChange={(event) => {
                setConfirmPW(event.target.value);
              }}
            />
          </FormControl>

          <DialogContentText
            sx={{ pt: 1, pl: 1, color: '#FF0000', fontSize: 14 }}
          >
            {showError}
          </DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <LoadingButton loading={isLoading} variant="contained" type="submit">
            Register
          </LoadingButton>
        </DialogActions>
      </form>
    </Dialog>
    // <div
    //   className={styles.registerContainer}
    //   onClick={closeRegister}
    //   onKeyDown={closeRegister}
    //   role="button"
    //   tabIndex={0}
    // >
    //   <div
    //     className={styles.registerContent}
    //     onClick={(e) => e.stopPropagation()}
    //     onKeyDown={(e) => e.stopPropagation()}
    //     role="button"
    //     tabIndex={-1}
    //   >
    //     <div className={styles.registerHeader}>
    //       <h3 className={styles.registerTitle}>Register</h3>
    //       <button className={styles.closeButton} onClick={closeRegister}>
    //         <MdClose />
    //       </button>
    //     </div>
    //     <form onSubmit={handleRegister}>
    //       <div className={styles.registerBody}>
    //         <label>
    //           Email:
    //           <input required type="text" />
    //         </label>

    //         <label>
    //           Password:
    //           <input required type="password" />
    //         </label>

    //         <label>
    //           Confirm password:
    //           <input required type="password" />
    //         </label>

    //         {/* Error message */}
    //         {showError && <p className={styles.passwordError}>{showError}</p>}
    //       </div>
    //       <div className={styles.registerFooter}>
    //         <div>
    //           <button type="submit" disabled={isLoading}>
    //             Submit
    //           </button>
    //           <button
    //             className={styles.cancelButton}
    //             onClick={closeRegister}
    //             type="button"
    //           >
    //             Cancel
    //           </button>
    //         </div>
    //         {isLoading && <LoadingSpinner />}
    //       </div>
    //     </form>
    //   </div>
    // </div>
  );
};

export default Register;
