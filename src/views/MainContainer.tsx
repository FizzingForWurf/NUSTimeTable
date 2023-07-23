import Timetable from 'views/timetable/Timetable';
import TimetableTabs from 'views/tabs/TimetableTabs';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/store';
import { fillColorMapping } from 'utils/colorUtils';

const MainContainer = () => {
  const modules = useSelector((state: RootState) => state.timetable.modules);
  const timetableConfig = useSelector(
    (state: RootState) => state.timetable.lessons
  );
  const currentSem = useSelector(
    (state: RootState) => state.timetable.semester
  );
  const activeLesson = useSelector(
    (state: RootState) => state.timetable.activeLesson
  );
  const modifiedCell = useSelector(
    (state: RootState) => state.timetable.modifiedCell
  );

  const currentColors = useSelector(
    (state: RootState) => state.timetable.colors
  );
  const colors = fillColorMapping(
    timetableConfig[currentSem] || {},
    currentColors[currentSem] || {}
  );

  // const hidden = useSelector((state: RootState) => state.timetable.hidden);
  // const hiddenModules = hidden[currentSem];
  return (
    <div style={{ height: '100%', width: '100%' }}>
      <Timetable
        readOnly={false}
        timetableConfig={timetableConfig[currentSem]}
        currentSem={currentSem}
        modules={modules}
        colors={colors}
        activeLesson={activeLesson}
        modifiedCell={modifiedCell}
      />
      <TimetableTabs />
    </div>
  );
};

export default MainContainer;
