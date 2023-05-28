import { FormEvent, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from './Login.scss';
import Register from './Register';

type LoginProps = {
  invalid: boolean;
};

const Login = ({ invalid = true }: LoginProps) => {
  const [showRegister, setShowRegister] = useState(false);

  const openRegisterPage = () => setShowRegister(true);
  const closeRegisterPage = () => setShowRegister(false);

  const handleLogin = (e: FormEvent<HTMLFormElement>) => {
    // Prevent the browser from reloading the page
    e.preventDefault();

    const email = (e.currentTarget[0] as HTMLInputElement).value;
    const password = (e.currentTarget[1] as HTMLInputElement).value;

    console.log(email, password);
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

        {invalid && (
          <p className={styles.loginErrorMessage}>
            Your email or password is incorrect! Please try again.
          </p>
        )}

        <button className={styles.loginButton} type="submit">
          <b>Login</b>
        </button>
      </form>
      <button onClick={openRegisterPage}>Register</button>
      <Register show={showRegister} onClose={closeRegisterPage} />
      <ToastContainer />
    </div>
  );
};

export default Login;
