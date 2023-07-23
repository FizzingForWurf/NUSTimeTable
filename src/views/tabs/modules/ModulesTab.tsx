import styles from './ModulesTab.scss';
import AddModuleSvg from 'svg/add_modules.svg';
import { Grid, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/store';
import { isEmpty } from 'lodash';
import { getSemesterModules } from 'utils/timetableUtils';
import ModuleItem from './ModuleItem';

const EmptyModulesPage = () => {
  return (
    <div className={styles.emptyPageWrapper}>
      <img
        alt="No modules found"
        src={AddModuleSvg}
        className={styles.emptyPageIcon}
      />
      <Typography className={styles.emptyPageText}>
        No modules found.
      </Typography>
      <Typography className={styles.emptyPageText}>
        Add modules via the search bar to this semester!
      </Typography>
    </div>
  );
};

const ModulesTab = () => {
  const modules = useSelector((state: RootState) => state.timetable.modules);
  const timetableConfig = useSelector(
    (state: RootState) => state.timetable.lessons
  );
  const currentColors = useSelector(
    (state: RootState) => state.timetable.colors
  );
  const currentSem = useSelector(
    (state: RootState) => state.timetable.semester
  );

  const currentSemTimetable = timetableConfig[currentSem] || {};
  if (isEmpty(currentSemTimetable)) return <EmptyModulesPage />;

  const currentSemModules = getSemesterModules(currentSemTimetable, modules);
  const currentSemColors = currentColors[currentSem] || {};
  return (
    <Grid container spacing={2}>
      {currentSemModules.map((module, index) => (
        <Grid item xs={12} sm={6} md={4} key={index}>
          <ModuleItem
            module={module}
            currentSem={currentSem}
            colorIndex={currentSemColors[module.moduleCode] || 0}
          />
        </Grid>
      ))}
    </Grid>
  );
};

export default ModulesTab;
