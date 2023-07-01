import styles from './ModulesTab.scss';
import AddModuleSvg from 'svg/add_modules.svg';
import { Typography } from '@mui/material';

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
  //   const modules = useSelector((state: RootState) => state.timetable.modules);
  //   const timetableConfig = useSelector(
  //     (state: RootState) => state.timetable.lessons
  //   );
  //   const currentSem = useSelector(
  //     (state: RootState) => state.timetable.semester
  //   );

  return (
    <div>
      <EmptyModulesPage />
    </div>
  );
};

export default ModulesTab;
