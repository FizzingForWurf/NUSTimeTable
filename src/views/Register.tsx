import { FormEvent, useState } from 'react';
import styles from './Register.scss';
import { MdClose } from 'react-icons/md';

import { AppDispatch, RootState } from '../redux/store';
import { registerUser } from '../redux/RegisterSlice';
import { useDispatch, useSelector } from 'react-redux';
import LoadingSpinner from './LoadingSpinner';

type RegisterProps = {
  show: boolean;
  onClose: () => void;
};

const NOT_MATCHING_PW_ERROR = 'Passwords do not match!';
const INVALID_EMAIL_ERROR = 'Invalid email address!';
const INVALID_PW_LENGTH_ERROR =
  'Password is too short! Please use at least 6 characters';

const Register = ({ show, onClose }: RegisterProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const isLoading = useSelector((state: RootState) => state.register.isLoading);

  const [showError, setShowError] = useState('');
  if (!show) return null;

  // Reset error message for next register
  const closeRegister = () => {
    setShowError('');
    onClose();
  };

  const handleRegister = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const email = (e.currentTarget[0] as HTMLInputElement).value;
    const password = (e.currentTarget[1] as HTMLInputElement).value;
    const confirmPW = (e.currentTarget[2] as HTMLInputElement).value;

    const samePW = password === confirmPW;
    const validPwLength = password.length >= 6;
    const isEmail = (email: string) =>
      /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email);

    if (!isEmail(email)) setShowError(INVALID_EMAIL_ERROR);
    else if (!samePW) setShowError(NOT_MATCHING_PW_ERROR);
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
          onClose();
        })
        .catch((e) => console.log(e));
    }
  };

  return (
    <div
      className={styles.registerContainer}
      onClick={closeRegister}
      onKeyDown={closeRegister}
      role="button"
      tabIndex={0}
    >
      <div
        className={styles.registerContent}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
        role="button"
        tabIndex={-1}
      >
        <div className={styles.registerHeader}>
          <h3 className={styles.registerTitle}>Register</h3>
          <button className={styles.closeButton} onClick={closeRegister}>
            <MdClose />
          </button>
        </div>
        <form onSubmit={handleRegister}>
          <div className={styles.registerBody}>
            <label>
              Email:
              <input required type="text" />
            </label>

            <label>
              Password:
              <input required type="password" />
            </label>

            <label>
              Confirm password:
              <input required type="password" />
            </label>

            {/* Error message */}
            {showError && <p className={styles.passwordError}>{showError}</p>}
          </div>
          <div className={styles.registerFooter}>
            <div>
              <button type="submit" disabled={isLoading}>
                Submit
              </button>
              <button
                className={styles.cancelButton}
                onClick={closeRegister}
                type="button"
              >
                Cancel
              </button>
            </div>
            {isLoading && <LoadingSpinner />}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
