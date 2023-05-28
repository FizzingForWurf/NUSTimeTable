import { Counter } from '../Counter';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const notify = () => toast('Wow so easy!');

export const Timetable = () => {
  return (
    <>
      <h1>React TypeScript Webpack Starter Template</h1>
      <Counter />
      <button onClick={notify}>Login</button>
      <ToastContainer />
    </>
  );
};

export default Timetable;
