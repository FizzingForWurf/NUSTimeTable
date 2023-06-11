import TimetableTimings from './TimetableTimings';
import styles from './Timetable.scss';
import { SCHOOLDAYS } from '../../utils/timify';

export const Timetable = () => {
  const startingIndex = 20;
  const endingIndex = 46;
  const columns = endingIndex - startingIndex;
  const size = 100 / (columns / 4);

  const rowStyle: React.CSSProperties = {
    // Firefox defaults the second value (width) to auto if not specified
    backgroundSize: `${size}% ${size}%`,
  };

  return (
    <>
      <div className={styles.timetableWrapper}>
        <div className={styles.timetableScroll}>
          <div className={styles.timetableContainer}>
            <TimetableTimings
              startingIndex={startingIndex}
              endingIndex={endingIndex}
            />
            {/* <div className={styles.dayNameCover} /> */}
            <ol className={styles.timetableList}>
              {SCHOOLDAYS.map((day) => {
                return (
                  <li key={day} className={styles.timetableDayRow}>
                    <div className={styles.dayName}>
                      <span className={styles.dayNameText}>
                        {day.substring(0, 3)}
                      </span>
                    </div>
                    <div className={styles.dayRows} style={rowStyle} />
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      </div>
    </>
  );
};

export default Timetable;
