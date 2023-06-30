import { EditCalendar } from '@mui/icons-material';
import { Divider, Fab, Zoom, useTheme } from '@mui/material';
import ConditionConfig from './ConditionConfig';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/store';
import { checkConflictModule } from 'utils/conditionsUtils';

type ConditionsTabProps = {
  showFab: boolean;
};

const ConditionsTab = (props: ConditionsTabProps) => {
  const theme = useTheme();
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
    checkConflictModule(currentSem, modules, timetableConfig[currentSem] || {});
  };

  return (
    <div>
      <ConditionConfig />
      <Divider>Conditions</Divider>

      <Zoom in={props.showFab} timeout={transitionDuration} unmountOnExit>
        <Fab
          color="primary"
          variant="extended"
          onClick={handleGenerateClick}
          sx={{ position: 'absolute', bottom: 24, right: 24 }}
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
