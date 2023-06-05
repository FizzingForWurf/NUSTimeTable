import { useSelector } from 'react-redux';
import { Counter } from '../Counter';
import { toast } from 'react-hot-toast';
import { RootState } from '../redux/store';
import { firebaseGetCurrentUser } from '../firebase/FirebaseAuth';

export const Timetable = () => {
  const curState = useSelector((state: RootState) => state);

  return (
    <>
      <h1>React TypeScript Webpack Starter Template</h1>
      <Counter />
      <button
        onClick={() => {
          toast('Wow so easy!');
          firebaseGetCurrentUser();
          console.log(curState);
        }}
      >
        TESTING
      </button>
    </>
  );
};

export default Timetable;
