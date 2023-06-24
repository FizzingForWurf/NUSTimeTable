import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { Box, IconButton, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { switchSemester } from 'redux/TimetableSlice';
import { AppDispatch, RootState } from 'redux/store';
import { semesterStringName } from 'utils/moduleUtils';
import { isValidSemester } from 'utils/timetableUtils';

const SemesterSwitcher = () => {
  const dispatch = useDispatch<AppDispatch>();
  const currentSem = useSelector(
    (state: RootState) => state.timetable.semester
  );
  const activeLesson = useSelector(
    (state: RootState) => state.timetable.activeLesson
  );

  const handleSwitchSemester = (offset: number) => () => {
    const newSemester = currentSem + offset;
    if (isValidSemester(newSemester)) dispatch(switchSemester(newSemester));
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      width="auto"
    >
      <IconButton
        disabled={!isValidSemester(currentSem - 1) || !!activeLesson}
        onClick={handleSwitchSemester(-1)}
      >
        <ChevronLeft />
      </IconButton>
      <Typography variant="overline" sx={{ px: 2, py: 1, fontSize: 14 }}>
        {semesterStringName[currentSem]}
      </Typography>
      <IconButton
        disabled={!isValidSemester(currentSem + 1) || !!activeLesson}
        onClick={handleSwitchSemester(1)}
      >
        <ChevronRight />
      </IconButton>
    </Box>
  );
};

export default SemesterSwitcher;
