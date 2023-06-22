import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import { useState } from 'react';
import { firebaseSignOutUser } from '../../firebase/FirebaseAuth';
import { useNavigate } from 'react-router-dom';
import { signOutUser } from '../../redux/UserSlice';
import { toast } from 'react-hot-toast';

const Profile = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const dispatch = useDispatch<AppDispatch>();
  const curUser = useSelector((state: RootState) => state.user.user);

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      setError('');
      await firebaseSignOutUser();

      setIsLoading(false);
      dispatch(signOutUser());
      toast.success('Signed out!', { position: 'top-right' });
      navigate('/');
    } catch (error) {
      setIsLoading(false);
      setError('An error occurred while signing out. Please try again later.');
    }
  };

  return (
    <div>
      <p>Profile</p>
      <p>{curUser?.displayName}</p>
      <p>{curUser?.email}</p>
      <p>{curUser?.uid}</p>
      <p>{curUser?.photoURL}</p>

      {error !== '' && <p>{error}</p>}
      <button onClick={handleLogout}>Sign out</button>
      {isLoading && <p>Loading...</p>}
    </div>
  );
};

export default Profile;
