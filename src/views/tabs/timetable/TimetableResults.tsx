import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from '@mui/material';
import styles from './TimetableResults.scss';
import NoTimetableSvg from 'svg/timetable_not_found.svg';
import { Close } from '@mui/icons-material';
import { SemTimetableConfig } from 'types/timetable';
import Timetable from 'views/timetable/Timetable';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from 'redux/store';
import { importTimetable } from 'redux/TimetableSlice';

const NoTimetablePage = () => {
  return (
    <div className={styles.noTimetableWrapper}>
      <img
        alt="No conditions found"
        src={NoTimetableSvg}
        className={styles.noTimetableIcon}
      />
      <Typography className={styles.noTimetableText}>
        No suitable timetable found.
      </Typography>
      <Typography className={styles.noTimetableText}>
        There are conflicting lessons in your current selection of modules:
      </Typography>
    </div>
  );
};

type TimetableResultsProps = {
  show: boolean;
  close: () => void;
  timetable: SemTimetableConfig;
};

const TimetableResults = (props: TimetableResultsProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const modules = useSelector((state: RootState) => state.timetable.modules);
  const currentSem = useSelector(
    (state: RootState) => state.timetable.semester
  );
  const currentColors = useSelector(
    (state: RootState) => state.timetable.colors
  );

  const handleImportTimetable = () => {
    dispatch(importTimetable(props.timetable));
    props.close();
  };

  return (
    <Dialog fullWidth maxWidth="xl" onClose={props.close} open={props.show}>
      <DialogTitle className={styles.dialogTitle}>
        Timetable options
        {
          <IconButton aria-label="close" onClick={props.close}>
            <Close />
          </IconButton>
        }
      </DialogTitle>

      <DialogContent dividers>
        {!props.timetable ? (
          <NoTimetablePage />
        ) : (
          <Timetable
            readOnly
            currentSem={currentSem}
            modules={modules}
            colors={currentColors[currentSem] || {}}
            timetableConfig={props.timetable}
          />
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={props.close}>Cancel</Button>
        <Button variant="outlined" onClick={handleImportTimetable}>
          Import timetable
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TimetableResults;
