import { Routes, Route } from 'react-router-dom';
import Timetable from './views/Timetable';
import Login from './views/Login';
import Register from './views/Register';

const Paths: React.FC = () => (
  <Routes>
    <Route path="/" element={<Timetable />}></Route>
    <Route path="/login" element={<Login />}></Route>
    <Route path="/register" element={<Register />}></Route>
  </Routes>
);

export default Paths;
