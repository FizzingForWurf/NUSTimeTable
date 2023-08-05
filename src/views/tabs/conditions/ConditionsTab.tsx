import { EditCalendar } from '@mui/icons-material';
import { Divider, Fab, Zoom, useTheme } from '@mui/material';
import ConditionConfig from './ConditionConfig';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/store';
import { setupTimetableGenerationData } from 'utils/conditionsUtils';
import { findSuitableTimetableConfig } from 'utils/generateTimetableUtils';
import { size } from 'lodash';
import { useState } from 'react';
import TimetableResults from '../timetable/TimetableResults';
import toast from 'react-hot-toast';
import { SemTimetableConfig } from 'types/timetable';
import ConditionsList from './ConditionsList';

type ConditionsTabProps = {
  showFab: boolean;
};

const ConditionsTab = (props: ConditionsTabProps) => {
  const theme = useTheme();
  const [showResults, setShowResults] = useState(false);
  const [newTimetable, setNewTimetable] = useState<SemTimetableConfig>({});

  const modules = useSelector((state: RootState) => state.timetable.modules);
  const timetableConfig = useSelector(
    (state: RootState) => state.timetable.lessons
  );
  const currentSem = useSelector(
    (state: RootState) => state.timetable.semester
  );

  const transitionDuration = {
    enter: theme.transitions.duration.enteringScreen,
    exit: theme.transitions.duration.leavingScreen,
  };

  const handleGenerateClick = () => {
    const curSemTimetable = timetableConfig[currentSem] || {};
    if (size(curSemTimetable) < 2) {
      toast.error('Please select at least 2 modules first!');
      return;
    }

    const data = setupTimetableGenerationData(
      currentSem,
      modules,
      curSemTimetable
    );

    const timetableResult = findSuitableTimetableConfig(data);
    console.log(timetableResult);
    setNewTimetable(timetableResult);
    setShowResults(true);
  };

  return (
    <div>
      <ConditionConfig />

      <Divider>Conditions</Divider>

      <ConditionsList />

      <TimetableResults
        show={showResults}
        timetable={newTimetable}
        close={() => setShowResults(false)}
      />

      <Zoom in={props.showFab} timeout={transitionDuration} unmountOnExit>
        <Fab
          color="primary"
          variant="extended"
          onClick={handleGenerateClick}
          sx={{ position: 'fixed', bottom: 24, right: 24 }}
        >
          <EditCalendar sx={{ mr: 1 }} />
          {/* <CircularProgress sx={{ color: 'white' }} thickness={5} size={24} /> */}
          Generate timetable
        </Fab>
      </Zoom>
    </div>
  );
};

export default ConditionsTab;
