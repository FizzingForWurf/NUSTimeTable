import Timetable from 'views/timetable/Timetable';
import TimetableTabs from 'views/tabs/TimetableTabs';

const MainContainer = () => {
  return (
    <div style={{ height: '100%', width: '100%' }}>
      <Timetable />
      <TimetableTabs />
    </div>
  );
};

export default MainContainer;
