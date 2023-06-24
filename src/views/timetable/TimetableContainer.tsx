import { Box } from '@mui/material';
import Timetable from './Timetable';
import TimetableTabs from 'views/tabs/TimetableTabs';

const TimetableContainer = () => {
  return (
    <Box width="100%" height="100%">
      <Timetable />
      <TimetableTabs />
    </Box>
  );
};

export default TimetableContainer;
