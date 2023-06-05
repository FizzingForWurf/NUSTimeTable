import { FormEvent, useState } from 'react';
import styles from './Login.scss';
import Register from './Register';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../redux/store';
import { loginUser } from '../redux/UserSlice';
import LoadingSpinner from './LoadingSpinner';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [showRegister, setShowRegister] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const isLoading = useSelector((state: RootState) => state.user.isLoading);
  const loginErrorMsg = useSelector((state: RootState) => state.user.errorMsg);

  const openRegisterPage = () => setShowRegister(true);
  const closeRegisterPage = () => setShowRegister(false);

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    // Prevent the browser from reloading the page
    e.preventDefault();

    const email = (e.currentTarget[0] as HTMLInputElement).value;
    const password = (e.currentTarget[1] as HTMLInputElement).value;

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
        <label>
          Email:
          <input required type="text" />
        </label>

        <label>
          Password:
          <input required type="password" />
        </label>

        {loginErrorMsg && (
          <p className={styles.loginErrorMessage}>
            Your email or password is incorrect! Please try again.
          </p>
        )}

        <button
          className={styles.loginButton}
          disabled={isLoading}
          type="submit"
        >
          <b>Login</b>
        </button>
      </form>
      <button className={styles.loginButton} onClick={openRegisterPage}>
        Register
      </button>
      <Register show={showRegister} onClose={closeRegisterPage} />
      {isLoading && (
        <div className={styles.loadingSpinner}>
          <LoadingSpinner />
        </div>
      )}
    </div>
  );
};

export default Login;
