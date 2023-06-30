import { EditCalendar } from '@mui/icons-material';
import { Fab, Zoom, useTheme } from '@mui/material';

type ConditionsTabProps = {
  startFabAnimation: boolean;
};

const ConditionsTab = (props: ConditionsTabProps) => {
  const theme = useTheme();

  const transitionDuration = {
    enter: theme.transitions.duration.enteringScreen,
    exit: theme.transitions.duration.leavingScreen,
  };

  return (
    <Zoom
      in={props.startFabAnimation}
      timeout={transitionDuration}
      unmountOnExit
    >
      <Fab
        color="primary"
        variant="extended"
        sx={{ position: 'absolute', bottom: 24, right: 24 }}
      >
        <EditCalendar sx={{ mr: 1 }} />
        Generate timetable
      </Fab>
    </Zoom>
  );
};

export default ConditionsTab;
