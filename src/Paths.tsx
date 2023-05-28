import { Routes, Route } from 'react-router-dom';
import Timetable from './views/Timetable';
import Login from './views/Login';

const Paths: React.FC = () => (
  <Routes>
    <Route path="/" element={<Timetable />}></Route>
    <Route path="/login" element={<Login invalid={false} />}></Route>
  </Routes>
);

export default Paths;
