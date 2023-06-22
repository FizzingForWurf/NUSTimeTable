import { Routes, Route } from 'react-router-dom';
import Timetable from './views/timetable/Timetable';
import Login from './views/user/Login';
import Profile from './views/user/Profile';
import ModulesCatalog from './views/ModulesCatalog';
import { ModuleDetails } from './views/ModuleDetails';

const Paths: React.FC = () => (
  <Routes>
    <Route path="/" element={<Timetable />}></Route>
    <Route path="/login" element={<Login />}></Route>
    <Route path="/profile" element={<Profile />}></Route>
    <Route path="/modules" element={<ModulesCatalog />}></Route>
    <Route path="/modules/:moduleCode" element={<ModuleDetails />}></Route>
  </Routes>
);

export default Paths;
