import { Routes, Route } from 'react-router-dom';
import Login from './views/user/Login';
import Profile from './views/user/Profile';
import MainContainer from 'views/MainContainer';

const Paths: React.FC = () => (
  <Routes>
    <Route path="/" element={<MainContainer />}></Route>
    <Route path="/login" element={<Login />}></Route>
    <Route path="/profile" element={<Profile />}></Route>
  </Routes>
);

export default Paths;
