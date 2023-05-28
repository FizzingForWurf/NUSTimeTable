import { FormEvent, useState } from 'react';
import styles from './Register.scss';
import { MdClose } from 'react-icons/md';
import { registerUser } from '../Firebase/FirebaseAuth';
import { ToastContainer } from 'react-toastify';

type RegisterProps = {
  show: boolean;
  onClose: () => void;
};

const NOT_MATCHING_PW_ERROR = 'Passwords do not match!';
const INVALID_EMAIL_ERROR = 'Invalid email address!';
const INVALID_PW_LENGTH_ERROR =
  'Password is too short! Please use at least 6 characters';

const Register = ({ show, onClose }: RegisterProps) => {
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
      registerUser(email, password, closeRegister);
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
            <button type="submit">Submit</button>
            <button
              className={styles.cancelButton}
              onClick={closeRegister}
              type="button"
            >
              Cancel
            </button>
            <ToastContainer />
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
