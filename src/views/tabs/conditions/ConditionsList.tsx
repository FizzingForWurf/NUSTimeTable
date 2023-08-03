import { Typography } from '@mui/material';
import styles from './ConditionList.scss';
import EmptyConditionSvg from 'svg/condition_options.svg';

const EmptyConditionsPage = () => {
  return (
    <div className={styles.emptyConditionWrapper}>
      <img
        alt="No conditions found"
        src={EmptyConditionSvg}
        className={styles.emptyConditionIcon}
      />
      <Typography className={styles.emptyConditionText}>
        No conditions found.
      </Typography>
      <Typography className={styles.emptyConditionText}>
        Add conditions above to customise your timetable!
      </Typography>
    </div>
  );
};

const ConditionsList = () => {
  return <EmptyConditionsPage />;
};

export default ConditionsList;
