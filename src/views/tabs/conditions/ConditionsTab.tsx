import { EditCalendar } from '@mui/icons-material';
import { Divider, Fab, Typography, Zoom, useTheme } from '@mui/material';
import ConditionConfig from './ConditionConfig';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/store';
import { setupTimetableGenerationData } from 'utils/conditionsUtils';
import { findSuitableTimetableConfig } from 'utils/generateTimetableUtils';
import { size } from 'lodash';
import styles from './ConditionsTab.scss';
import EmptyConditionSvg from 'svg/condition_options.svg';

const EmptyConditionsPage = () => {
  return (
    <div className={styles.emptyConditionWrapper}>
      <img
        alt="No conditions found"
        src={EmptyConditionSvg}
        className={styles.emptyConditionIcon}
      />
      <Typography className={styles.emptyPageText}>
        No conditions found.
      </Typography>
      <Typography className={styles.emptyConditionText}>
        Add conditions above to customise your timetable!
      </Typography>
    </div>
  );
};

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
    const curSemTimetable = timetableConfig[currentSem] || {};
    if (size(curSemTimetable) < 2) return;

    const data = setupTimetableGenerationData(
      currentSem,
      modules,
      curSemTimetable
    );

    const timetableResult = findSuitableTimetableConfig(data);
    console.log(timetableResult);
  };

  return (
    <div>
      <ConditionConfig />

      <Divider>Conditions</Divider>

      <EmptyConditionsPage />

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
