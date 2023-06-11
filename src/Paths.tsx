import { Routes, Route } from 'react-router-dom';
import Timetable from './views/timetable/Timetable';
import Login from './views/Login';
import Profile from './views/Profile';

const Paths: React.FC = () => (
  <Routes>
    <Route path="/" element={<Timetable />}></Route>
    <Route path="/login" element={<Login />}></Route>
    <Route path="/profile" element={<Profile />}></Route>
  </Routes>
);

export default Paths;
