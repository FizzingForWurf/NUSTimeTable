import { Link } from 'react-router-dom';
import styles from './Navbar.scss';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

const Navbar = () => {
  const curUser = useSelector((state: RootState) => state.user.user);

  return (
    <nav className={styles.navbar}>
      <Link to={'/'}>Home</Link>
      <p>NUSTimeTable</p>
      {!curUser && <Link to={'/login'}>Login</Link>}
      {curUser && <Link to={'/profile'}>Profile</Link>}
    </nav>
  );
};

export default Navbar;
